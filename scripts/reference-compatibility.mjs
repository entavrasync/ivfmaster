import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { procedureDocument } from '../sanity/lib/procedure-mapping.ts'
import { doctorDocument, settingsDocument } from '../sanity/lib/clinic-mapping.ts'
import { homeFaqDocument, aboutInformationDocument, facilityGalleryDocument } from '../sanity/lib/editorial-mapping.ts'

const contracts = {
  procedure: procedureDocument, doctor: doctorDocument, clinicSettings: settingsDocument,
  homeFaq: homeFaqDocument, aboutInformation: aboutInformationDocument, facilityGallery: facilityGalleryDocument,
}
const fields = (document, names) => Object.fromEntries(names.filter((name) => Object.hasOwn(document, name)).map((name) => [name, document[name]]))
const ordered = (value) => value && typeof value === 'object'
  ? Array.isArray(value) ? value.map(ordered)
    : Object.fromEntries(Object.keys(value).sort().map((key) => [key, ordered(value[key])])) : value
const stable = (value) => JSON.stringify(ordered(value))

/** A review aid, never a mutation builder: present values (including blanks and arrays) win. */
export function reconcileMissingFields(existing, candidate, prefix = '') {
  const missing = [], conflicts = []
  for (const [key, value] of Object.entries(candidate)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (!Object.hasOwn(existing, key)) missing.push({ path, value: structuredClone(value) })
    else if (value && existing[key] && typeof value === 'object' && typeof existing[key] === 'object' && !Array.isArray(value) && !Array.isArray(existing[key])) {
      const nested = reconcileMissingFields(existing[key], value, path)
      missing.push(...nested.missing); conflicts.push(...nested.conflicts)
    } else if (stable(existing[key]) !== stable(value)) conflicts.push(path)
  }
  return { missing, conflicts }
}

function candidateFor(source) {
  const identity = fields(source, ['_id', 'reviewStatus'])
  if (source._type === 'procedure') return {
    type: 'procedure', id: source._id,
    document: { ...fields(source, ['_id', 'reviewStatus', 'name', 'fullName', 'oneLiner', 'heroDescription', 'quickFacts', 'whoItsFor', 'process', 'whatToExpect', 'seo']),
      slug: source.slug?.current,
      faqs: source.faqs?.map((faq) => ({ ...fields(faq, ['_key']), q: faq.question, a: faq.answer })) },
    mappings: ['slug.current → slug', 'faqs[].question → faqs[].q', 'faqs[].answer → faqs[].a'],
    omitted: ['isPublished', 'order'],
  }
  if (source._type === 'doctor') return {
    type: 'doctor', id: source._id,
    document: { ...fields(source, ['_id', 'reviewStatus', 'name', 'title', 'essence', 'intro', 'biography', 'credentials', 'order', 'portrait', 'home', 'about']), slug: source.slug?.current, metaDescription: source.seo?.metaDescription },
    mappings: ['slug.current → slug', 'seo.metaDescription → metaDescription'], omitted: ['isPublished', 'seo.noIndex'],
  }
  if (source._type === 'siteSettings') return {
    type: 'clinicSettings', id: 'clinicSettings',
    document: { ...identity, _id: 'clinicSettings', ...fields(source.contact ?? {}, ['telephone', 'whatsappNumber', 'email']),
      ...fields(source, ['displayAddress', 'address']), mapUrl: source.geo?.placeUrl, latitude: source.geo?.latitude, longitude: source.geo?.longitude,
      instagram: source.social?.find((item) => item.platform === 'instagram')?.url },
    mappings: ['siteSettings → clinicSettings (fixed singleton)', 'contact → telephone/whatsappNumber/email', 'geo → mapUrl/latitude/longitude', 'social[instagram].url → instagram'],
    omitted: ['hours', 'hoursSummary', 'holidays', 'stats', 'defaultSeo', 'name', 'legalName', 'description', 'siteUrl', 'timezone', 'contact.whatsappPrefill', 'social (other platforms)'],
  }
  if (source._type === 'aboutPage') return {
    type: 'aboutInformation', id: null, document: { ...identity, ...fields(source, ['origin', 'care', 'trust']) },
    mappings: ['aboutPage.origin/care/trust → aboutInformation (ordinary document; identity unresolved)'],
    omitted: ['hero', 'closing', 'doctorsSection', 'team', 'seo'],
  }
  if (source._type === 'teamPage') return {
    type: 'facilityGallery', id: null, document: { ...identity, ...fields(source.facilitySection ?? {}, ['eyebrow', 'heading', 'lead', 'areas']) },
    mappings: ['teamPage.facilitySection → facilityGallery (ordinary document; identity unresolved)'],
    omitted: ['hero', 'careTeamSection', 'closing', 'doctorsSection', 'seo'],
  }
  if (source._type === 'homePage') return {
    type: 'homeFaq', id: null,
    document: { ...identity, ...fields(source.mythsFacts ?? {}, ['eyebrow', 'heading', 'body']), closeBody: source.mythsFacts?.closing?.body },
    mappings: ['homePage.mythsFacts introduction → homeFaq; myth/fact rows are not automatically questions/answers'],
    omitted: Object.keys(source).filter((key) => !key.startsWith('_') && key !== 'mythsFacts'),
  }
  return null
}

function leaves(value, prefix = '', result = []) {
  if (value && typeof value === 'object') for (const [key, item] of Object.entries(value)) leaves(item, prefix ? `${prefix}.${key}` : key, result)
  else result.push(prefix)
  return result
}

function assetReferences(value, prefix = '', result = []) {
  if (!value || typeof value !== 'object') return result
  for (const [key, item] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof item === 'string' && (key === '_sanityAsset' || key === '_ref' && /^(image|file)-/.test(item) || /^(images|files)\//.test(item))) result.push({ path, value: item })
    else assetReferences(item, path, result)
  }
  return result
}

/** Uses the unchanged website validators; it neither grants approval nor emits write operations. */
export function analyzeReference(records, targetInventory = null) {
  if (!Array.isArray(records) || records.some((record) => !record || typeof record._id !== 'string' || typeof record._type !== 'string')) throw new Error('Expected an exported document array with IDs and types.')
  if (targetInventory !== null && !Array.isArray(targetInventory)) throw new Error('Target inventory must be complete or null.')
  const duplicateIds = [...new Set(records.filter((record, index) => records.findIndex((other) => other._id === record._id) !== index).map((record) => record._id))].sort()
  const proposals = records.map((source) => ({ source, candidate: candidateFor(source) }))
  const rows = proposals.map(({ source, candidate }) => {
    const base = { sourceId: source._id, sourceType: source._type, sourceRevision: source._rev ?? null,
      targetType: candidate?.type ?? null, targetId: candidate?.id ?? null,
      fieldMappings: candidate?.mappings ?? [], deliberatelyUnmapped: candidate?.omitted ?? [],
      sourceFieldPaths: leaves(source), assetReferences: assetReferences(source),
      assetPolicy: 'Source assets remain in the backup. Existing target readers require 4k9zwr7s/production assets; no upload or fabricated target reference is proposed.',
      localization: 'English required; Marathi optional per target field. Portable Text is not coerced into ICU strings.',
      approval: { source: source.reviewStatus ?? null, targetApprovalGranted: false }, targetInventory: targetInventory === null ? 'unavailable' : 'supplied' }
    if (!candidate) return { ...base, disposition: 'unsupported-type', validationFailures: [], candidate: null, reconciliation: null }
    const parsed = contracts[candidate.type].safeParse(candidate.document)
    const failures = parsed.success ? [] : parsed.error.issues.map((issue) => ({ path: issue.path.join('.'), code: issue.code, reason: issue.message }))
    const duplicateMapping = candidate.id && proposals.some((other) => other.source !== source && other.candidate?.type === candidate.type && other.candidate.id === candidate.id)
    if (duplicateIds.includes(source._id) || duplicateMapping) failures.push({ path: '_id', code: 'conflict', reason: 'Duplicate source identity or conflicting target mapping; no operation permitted.' })
    const existing = targetInventory?.filter((record) =>
      candidate.id && (record._id === candidate.id || record._id === `drafts.${candidate.id}` || record._id.startsWith('versions.') && record._id.endsWith(`.${candidate.id}`))
      || record._type === candidate.type && (candidate.type === 'clinicSettings' || candidate.id === null || candidate.document.slug && (record.slug?.current ?? record.slug) === candidate.document.slug)) ?? []
    if (candidate.id && existing.some((record) => ![candidate.id, `drafts.${candidate.id}`].includes(record._id) && !record._id.startsWith('versions.'))) failures.push({ path: '_id', code: 'conflict', reason: 'Existing target record has the same content identity under a different ID; preserve it and review explicitly.' })
    const reconciliation = existing.length === 1 ? reconcileMissingFields(existing[0], candidate.document) : null
    if (existing.length > 1) failures.push({ path: '_id', code: 'conflict', reason: 'Multiple target document family members require explicit review.' })
    return { ...base, candidate: candidate.document, validationFailures: failures, reconciliation,
      disposition: failures.some((failure) => failure.path !== 'reviewStatus') ? 'incompatible' : 'requires-human-review' }
  }).sort((a, b) => a.sourceId.localeCompare(b.sourceId) || a.sourceType.localeCompare(b.sourceType))
  return { sourceProject: 'kj9188w7', sourceDataset: 'production', targetProject: '4k9zwr7s', targetDataset: 'production',
    dryRunOnly: true, targetInventoryComplete: targetInventory !== null, duplicateIds,
    counts: rows.reduce((counts, row) => ({ ...counts, [row.disposition]: (counts[row.disposition] ?? 0) + 1 }), {}),
    operations: [], records: rows,
    gate: 'No import or writes. Candidate validation is not clinical approval. Require authenticated target inventory, backup, exact conflicts/assets/IDs review and separate operation approval.' }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [input, output] = process.argv.slice(2)
  if (!input || !output) throw new Error('Usage: node --experimental-strip-types scripts/reference-compatibility.mjs <data.ndjson> <new-report.json>')
  const records = readFileSync(input, 'utf8').split(/\r?\n/).filter((line) => line.trim()).map((line) => JSON.parse(line))
  const report = analyzeReference(records)
  writeFileSync(output, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' })
  console.info(JSON.stringify({ records: records.length, counts: report.counts, operations: 0, targetInventoryComplete: false }))
}
