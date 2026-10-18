import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'
import { PROCEDURES } from '../lib/procedures.ts'
import { buildPageMetadata } from '../lib/seo/metadata.ts'
import { mapProcedureDocument, resolveProcedures, type ProcedureDocument } from '../sanity/lib/procedure-mapping.ts'
import { allProceduresQuery } from '../sanity/lib/procedure-query.ts'
import initialContent from '../sanity/reference/initial-content.json' with { type: 'json' }

// Exercise the actual GROQ parser/evaluator already supplied by Sanity, without adding a test dependency.
const require = createRequire(import.meta.url)
const groq = createRequire(require.resolve('sanity'))('groq-js') as {
  parse(query: string): unknown
  evaluate(query: unknown, options: { dataset: unknown[]; params: { slug: string; slugs?: string[] } }): Promise<{ get(): Promise<unknown> }>
}

const original = PROCEDURES.find((proc) => proc.slug === 'ivf')!
const localized = (en: string) => ({ en })

test('all existing procedure templates flow through the actual collection query and reader without replacing route styling', async () => {
  const dataset = initialContent.procedures.map((entry) => ({ ...structuredClone(entry.value), _id: `local-${entry.slug}`, _type: 'procedure', reviewStatus: 'approved' }))
  const result = await (await groq.evaluate(groq.parse(allProceduresQuery), { dataset, params: { slug: 'ivf', slugs: PROCEDURES.map((item) => item.slug) } })).get()
  for (const locale of ['en', 'mr'] as const) {
    const mapped = resolveProcedures(result, PROCEDURES, locale)
    assert.equal(mapped.status, 'sanity')
    for (const [index, page] of mapped.procedures.entries()) {
      const { seo, ...content } = page
      assert.deepEqual(content, PROCEDURES[index])
    }
  }
  const conflicting = [...result as unknown[], (result as unknown[])[0]]
  assert.equal(resolveProcedures(conflicting, PROCEDURES, 'en').status, 'ambiguous')
})

function fixture(): ProcedureDocument {
  return {
    _id: 'test-ivf', slug: 'ivf', reviewStatus: 'approved',
    name: localized(original.name), fullName: localized(original.fullName),
    oneLiner: localized(original.oneLiner), heroDescription: localized(original.heroDescription),
    quickFacts: original.quickFacts.map((fact, i) => ({ _key: `fact-${i}`, label: localized(fact.label), value: localized(fact.value) })),
    whoItsFor: original.whoItsFor.map((text, i) => ({ _key: `indication-${i}`, en: text })),
    process: original.process.map((step, i) => ({ _key: `step-${i}`, title: localized(step.title), detail: localized(step.detail) })),
    whatToExpect: localized(original.whatToExpect),
    faqs: original.faqs.map((faq, i) => ({ _key: `faq-${i}`, q: localized(faq.q), a: localized(faq.a) })),
  }
}

test('maps the existing English copy without changing visuals, arrays or ordering', () => {
  const mapped = mapProcedureDocument(fixture(), original, 'en')!
  const { seo, ...page } = mapped
  assert.deepEqual(page, original)
  assert.equal(seo?.title, undefined)
  assert.equal(mapped.accentEdge, original.accentEdge)
  assert.equal(mapped.heroImage, original.heroImage)
})

test('Marathi resolves per field with English fallback, including nested arrays', () => {
  const doc = fixture()
  doc.fullName.mr = 'मराठी शीर्षक'
  doc.heroDescription.mr = '   '
  doc.quickFacts[0].label.mr = 'कालावधी'
  doc.process[0].title.mr = 'पहिला टप्पा'
  doc.faqs[0].q.mr = 'प्रश्न'
  const mapped = mapProcedureDocument(doc, original, 'mr')!
  assert.equal(mapped.fullName, doc.fullName.mr)
  assert.equal(mapped.heroDescription, original.heroDescription)
  assert.equal(mapped.quickFacts[0].label, doc.quickFacts[0].label.mr)
  assert.equal(mapped.quickFacts[0].value, original.quickFacts[0].value)
  assert.equal(mapped.process[0].title, doc.process[0].title.mr)
  assert.equal(mapped.process[0].detail, original.process[0].detail)
  assert.equal(mapped.faqs[0].q, doc.faqs[0].q.mr)
  assert.equal(mapped.faqs[0].a, original.faqs[0].a)
  assert.equal(mapProcedureDocument(doc, original, 'en')?.fullName, original.fullName)
})

test('rejects incomplete, unapproved, draft, release and incorrect-route content as a whole', () => {
  for (const invalid of [
    { ...fixture(), name: { mr: 'शीर्षक' } },
    { ...fixture(), heroDescription: { en: ' ' } },
    { ...fixture(), quickFacts: [] },
    { ...fixture(), process: [{ title: { en: 'A' } }] },
    { ...fixture(), faqs: null },
    { ...fixture(), reviewStatus: 'pendingReview' },
    { ...fixture(), _id: 'drafts.test-ivf' },
    { ...fixture(), _id: 'versions.release.test-ivf' },
    { ...fixture(), slug: 'iui' },
  ]) assert.equal(mapProcedureDocument(invalid, original, 'mr'), null)
})

test('missing, malformed and duplicate results retain the complete existing list', () => {
  for (const [input, status] of [[[], 'missing'], [null, 'invalid'], [[{}], 'invalid'], [[fixture(), fixture()], 'ambiguous']] as const) {
    const result = resolveProcedures(input, PROCEDURES, 'mr')
    assert.equal(result.status, status)
    assert.equal(result.procedures, PROCEDURES)
  }
})

test('only IVF is replaced; other procedures keep their identities and list position', () => {
  const doc = fixture()
  doc.oneLiner.en = 'Edited procedure summary'
  const result = resolveProcedures([doc], PROCEDURES, 'en')
  assert.equal(result.status, 'sanity')
  assert.equal(result.procedures[0].oneLiner, doc.oneLiner.en)
  assert.deepEqual(result.procedures.map((p) => p.slug), PROCEDURES.map((p) => p.slug))
  for (let i = 1; i < PROCEDURES.length; i++) assert.equal(result.procedures[i], PROCEDURES[i])
})

test('SEO overrides preserve canonical, hreflang and social image architecture', () => {
  const doc = fixture()
  doc.seo = { metaTitle: { en: 'English SEO title', mr: 'मराठी शीर्षक' }, metaDescription: { en: 'English SEO description' } }
  const mapped = mapProcedureDocument(doc, original, 'mr')!
  const metadata = buildPageMetadata({ locale: 'mr', path: '/procedures/ivf', title: mapped.seo!.title!, description: mapped.seo!.description! })
  assert.equal(metadata.alternates?.canonical, 'https://www.ivfmaster.in/procedures/ivf')
  assert.deepEqual(metadata.alternates?.languages, {
    mr: 'https://www.ivfmaster.in/procedures/ivf', en: 'https://www.ivfmaster.in/en/procedures/ivf', 'x-default': 'https://www.ivfmaster.in/procedures/ivf',
  })
  assert.equal(metadata.description, 'English SEO description')
  assert.deepEqual(metadata.openGraph?.images, [{ url: 'https://www.ivfmaster.in/hero-bg-desktop.png', width: 1672, height: 941, alt: 'IVF Master' }])
})

test('the live collection projection selects approved procedures and retains array keys/locales', async () => {
  const doc = fixture()
  const stored = { ...doc, _type: 'procedure', slug: { current: 'ivf' } }
  const dataset = [stored, { ...stored, _id: 'drafts.other' }, { ...stored, _id: 'versions.release.other' }, { ...stored, _id: 'unapproved', reviewStatus: 'pendingReview' }, { ...stored, _id: 'other', slug: { current: 'iui' } }]
  const result = await (await groq.evaluate(groq.parse(allProceduresQuery), { dataset, params: { slug: 'ivf' } })).get()
  assert.ok(Array.isArray(result))
  assert.equal(result.length, 2)
  assert.deepEqual(result.map((record) => record._id), [doc._id, 'other'])
  assert.ok(mapProcedureDocument(result[0], original, 'en'))
  const duplicate = await (await groq.evaluate(groq.parse(allProceduresQuery), { dataset: [...dataset, { ...stored, _id: 'duplicate' }], params: { slug: 'ivf' } })).get()
  assert.equal(resolveProcedures(duplicate, PROCEDURES, 'en').status, 'ambiguous')
})

