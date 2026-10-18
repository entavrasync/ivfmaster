import assert from 'node:assert/strict'
import test from 'node:test'
import { analyzeReference, reconcileMissingFields } from '../scripts/reference-compatibility.mjs'
import { PROCEDURES } from '../lib/procedures.ts'
import { mapProcedureDocument } from '../sanity/lib/procedure-mapping.ts'

const original = PROCEDURES.find((record) => record.slug === 'ivf')
const localized = (en) => ({ en })
function reference() {
  return { _id: 'source-ivf', _type: 'procedure', _rev: 'source-revision', slug: { current: 'ivf' }, reviewStatus: 'approved',
    ...Object.fromEntries(['name', 'fullName', 'oneLiner', 'heroDescription', 'whatToExpect'].map((key) => [key, localized(original[key])])),
    quickFacts: original.quickFacts.map((row, i) => ({ _key: `q${i}`, label: localized(row.label), value: localized(row.value) })),
    whoItsFor: original.whoItsFor.map((en, i) => ({ _key: `w${i}`, en })),
    process: original.process.map((row, i) => ({ _key: `p${i}`, title: localized(row.title), detail: localized(row.detail) })),
    faqs: original.faqs.map((row, i) => ({ _key: `f${i}`, question: localized(row.q), answer: localized(row.a) })),
  }
}

test('explicit FAQ/slug mapping passes the real target validator without granting approval', () => {
  const source = reference(), before = structuredClone(source), result = analyzeReference([source])
  const row = result.records[0]
  assert.deepEqual(row.validationFailures, [])
  assert.equal(row.disposition, 'requires-human-review')
  assert.equal(row.approval.targetApprovalGranted, false)
  assert.equal(row.candidate.faqs[0]._key, source.faqs[0]._key)
  assert.equal(row.candidate.faqs[0].q.en, original.faqs[0].q)
  assert.equal(mapProcedureDocument(row.candidate, original, 'en').name, original.name)
  assert.deepEqual(source, before)
  assert.deepEqual(result.operations, [])
})

test('missing approval, legacy required fields and unsupported slugs remain failures', () => {
  const source = reference(); delete source.reviewStatus; delete source.name
  source.slug.current = 'iui'
  const row = analyzeReference([source]).records[0]
  assert.equal(row.disposition, 'incompatible')
  for (const path of ['reviewStatus', 'name', 'slug']) assert(row.validationFailures.some((issue) => issue.path === path))
})

test('localized mappings retain Marathi copy and existing English fallback', () => {
  const source = reference(); source.name.mr = 'मराठी'; source.heroDescription.mr = ' '
  const candidate = analyzeReference([source]).records[0].candidate
  assert.equal(mapProcedureDocument(candidate, original, 'mr').name, 'मराठी')
  assert.equal(mapProcedureDocument(candidate, original, 'mr').heroDescription, original.heroDescription)
  assert.equal(mapProcedureDocument(candidate, original, 'en').name, original.name)
})

test('duplicate IDs and conflicting target singleton mappings are rejected', () => {
  const source = reference()
  const duplicate = analyzeReference([source, structuredClone(source)])
  assert.deepEqual(duplicate.duplicateIds, ['source-ivf'])
  assert(duplicate.records.every((row) => row.disposition === 'incompatible'))
  const singletons = analyzeReference([{ _id: 'settings-one', _type: 'siteSettings' }, { _id: 'settings-two', _type: 'siteSettings' }])
  assert(singletons.records.every((row) => row.validationFailures.some((failure) => failure.code === 'conflict')))
})

test('unsupported types are explicit and reports are deterministic', () => {
  const input = [reference(), { _id: 'navigation', _type: 'navigation', links: [] }]
  assert.deepEqual(analyzeReference(input), analyzeReference([...input].reverse()))
  assert.equal(analyzeReference(input).records.find((row) => row.sourceType === 'navigation').disposition, 'unsupported-type')
  assert.equal(analyzeReference(input).targetInventoryComplete, false)
})

test('dry-run reconciliation preserves existing values, blanks, revisions, arrays and keys', () => {
  const existing = { _rev: 'live', name: { en: '', mr: null }, faqs: [{ _key: 'kept', q: 'Existing' }] }
  const before = structuredClone(existing)
  const result = reconcileMissingFields(existing, { _rev: 'source', name: { en: 'Changed', mr: 'Changed' }, faqs: [], seo: { title: 'Candidate' } })
  assert.deepEqual(existing, before)
  assert.deepEqual(result.missing, [{ path: 'seo', value: { title: 'Candidate' } }])
  assert.deepEqual(result.conflicts, ['_rev', 'name.en', 'name.mr', 'faqs'])
  assert.deepEqual(reconcileMissingFields({ name: { mr: 'अ' } }, { name: { en: 'English', mr: 'अ' } }).missing, [{ path: 'name.en', value: 'English' }])
})

test('published/draft/release target family members block automatic reconciliation', () => {
  const source = reference()
  const target = [source, { ...source, _id: `drafts.${source._id}` }, { ...source, _id: `versions.release.${source._id}` }]
  const row = analyzeReference([source], target).records[0]
  assert.equal(row.disposition, 'incompatible')
  assert.equal(row.reconciliation, null)
  assert(row.validationFailures.some((issue) => issue.reason.includes('family')))
})

test('same target slug under a different ID is a conflict rather than a new-document proposal', () => {
  const source = reference()
  const target = { ...source, _id: 'existing-target-id', name: { en: 'Existing target value' } }
  const before = structuredClone(target)
  const result = analyzeReference([source], [target])
  assert.equal(result.records[0].disposition, 'incompatible')
  assert(result.records[0].validationFailures.some((issue) => issue.code === 'conflict'))
  assert.deepEqual(target, before)
  assert.deepEqual(result.operations, [])
})
