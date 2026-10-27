import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import ts from 'typescript'
import { createSchema } from 'sanity'
import { resolveAboutInformation, resolveFacilityGallery, resolveHomeFaq } from '../sanity/lib/editorial-mapping.ts'
import { aboutInformationQuery, facilityGalleryQuery, homeFaqQuery } from '../sanity/lib/editorial-queries.ts'
import { aboutInformation, facilityGallery, homeFaq } from '../sanity/schemaTypes/editorial.ts'
import { localizedString, localizedText } from '../sanity/schemaTypes/procedure.ts'

const require = createRequire(import.meta.url)
const groq = require(require.resolve('groq-js', { paths: [require.resolve('sanity')] }))
const en = JSON.parse(readFileSync(new URL('../messages/en.json', import.meta.url), 'utf8'))
const mr = JSON.parse(readFileSync(new URL('../messages/mr.json', import.meta.url), 'utf8'))
// Execute existing content data; Node cannot import the static image modules.
const source = {}
new Function('exports', 'require', ts.transpileModule(readFileSync(new URL('../lib/content/about.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText)(source, (path) => ({ src: path, width: 1200, height: 800 }))
const localized = (english, marathi) => ({ en: english, ...(marathi === undefined ? {} : { mr: marathi }) })
const published = (type) => ({ _id: `fixture-${type}`, _type: type, reviewStatus: 'approved' })
function faq() {
  const e = en.MythsFacts, m = mr.MythsFacts
  return { ...published('homeFaq'), ...Object.fromEntries(['eyebrow', 'heading', 'body', 'closeBody'].map((key) => [key, localized(e[key], m[key])])),
    faqs: Object.keys(e.faqs).map((key) => ({ _key: key, question: localized(e.faqs[key].q, m.faqs[key].q), answer: localized(e.faqs[key].a, m.faqs[key].a) })),
  }
}
function about() {
  const { origin, care, trust } = source.aboutContent
  const copy = (object, keys) => Object.fromEntries(keys.map((key) => [key, localized(object[key])]))
  return { ...published('aboutInformation'),
    origin: { ...copy(origin, ['eyebrow', 'title', 'quote', 'note']), paragraphs: origin.paragraphs.map((en, i) => ({ _key: `paragraph-${i}`, en })) },
    care: { ...copy(care, ['eyebrow', 'title', 'intro']), steps: care.steps.map((step, i) => ({ _key: `step-${i}`, ...copy(step, ['title', 'body']) })) },
    trust: { ...copy(trust, ['eyebrow', 'title', 'intro']), points: trust.points.map((point, i) => ({ _key: `point-${i}`, ...copy(point, ['label', 'title', 'body']) })) },
  }
}
function gallery() {
  return { ...published('facilityGallery'),
    eyebrow: localized(en.Team.facilityEyebrow, mr.Team.facilityEyebrow), heading: localized(en.Team.facilityHeading, mr.Team.facilityHeading), lead: localized(en.Team.facilityLead, mr.Team.facilityLead),
    areas: Object.keys(en.Team.facilityPhotos).map((area) => ({ _key: area, area,
      caption: localized(en.Team.facilityPhotos[area].caption, mr.Team.facilityPhotos[area].caption), imageAlt: localized(en.Team.facilityPhotos[area].imageAlt, mr.Team.facilityPhotos[area].imageAlt),
    })),
  }
}
const cases = [
  { make: faq, resolve: resolveHomeFaq, query: homeFaqQuery },
  { make: about, resolve: resolveAboutInformation, query: aboutInformationQuery },
  { make: gallery, resolve: resolveFacilityGallery, query: facilityGalleryQuery },
]

test('homepage FAQ maps all seven real source questions in order in both locales', () => {
  for (const locale of ['en', 'mr']) {
    const result = resolveHomeFaq([faq()], locale)
    const expected = locale === 'en' ? en.MythsFacts : mr.MythsFacts
    assert.equal(result.status, 'sanity')
    assert.equal(result.content.heading, expected.heading)
    assert.equal(result.content.closeBody, expected.closeBody)
    assert.deepEqual(result.content.faqs, Object.entries(expected.faqs).map(([id, copy]) => ({ id, q: copy.q, a: copy.a })))
    assert.equal('ctaButton' in result.content, false)
  }
})

test('About information preserves the actual English origin, four care steps and five trust points in both locale fallbacks', () => {
  for (const locale of ['en', 'mr']) {
    const result = resolveAboutInformation([about()], locale)
    assert.equal(result.status, 'sanity')
    for (const group of ['origin', 'care', 'trust']) assert.deepEqual(result.content[group], source.aboutContent[group])
    assert.deepEqual(result.content.care.steps.map((s) => s.number), ['01', '02', '03', '04'])
    assert.equal('doctors' in result.content, false)
  }
})

test('facility captions/alt localize while omitted images retain the caller static photo fallback', () => {
  for (const locale of ['en', 'mr']) {
    const result = resolveFacilityGallery([gallery()], locale)
    const expected = locale === 'en' ? en.Team : mr.Team
    assert.equal(result.status, 'sanity')
    assert.deepEqual(result.content.areas.map((a) => a.area), ['reception', 'consultation', 'laboratory', 'waiting'])
    for (const area of result.content.areas) {
      assert.equal(area.caption, expected.facilityPhotos[area.area].caption)
      assert.equal(area.imageAlt, expected.facilityPhotos[area.area].imageAlt)
      assert.equal(area.images, undefined)
    }
  }
})

test('missing, unavailable-shaped, duplicate, unapproved, draft and release results fail closed independently', () => {
  for (const { make, resolve } of cases) {
    assert.deepEqual(resolve([], 'mr'), { status: 'missing', content: null })
    for (const input of [null, {}, [make(), make()], [{ ...make(), reviewStatus: 'pendingReview' }], [{ ...make(), _id: 'drafts.example' }], [{ ...make(), _id: 'versions.release.example' }]]) {
      assert.equal(resolve(input, 'en').content, null)
    }
    assert.equal(resolve([make(), make()], 'en').status, 'ambiguous')
  }
})

test('Marathi fallback is per field; malformed translations and missing English reject the document', () => {
  const doc = faq()
  doc.faqs[0].question.mr = '  '
  doc.faqs[0].answer.mr = null
  const result = resolveHomeFaq([doc], 'mr')
  assert.equal(result.content.faqs[0].q, en.MythsFacts.faqs.q1.q)
  assert.equal(result.content.faqs[0].a, en.MythsFacts.faqs.q1.a)
  assert.equal(result.content.faqs[1].q, mr.MythsFacts.faqs.q2.q)
  for (const invalid of [42, '<script>unsafe</script>']) {
    const bad = faq(); bad.heading.mr = invalid
    assert.equal(resolveHomeFaq([bad], 'mr').content, null)
  }
  delete doc.faqs[0].question.en
  assert.equal(resolveHomeFaq([doc], 'mr').content, null)
})

test('blank and duplicate FAQ entries are rejected without merging partial clinical answers', () => {
  const blank = faq(); blank.faqs[0].answer.en = '  '
  const repeated = faq(); repeated.faqs[1].question.en = repeated.faqs[0].question.en.toUpperCase()
  const repeatedKey = faq(); repeatedKey.faqs[1]._key = repeatedKey.faqs[0]._key
  for (const doc of [blank, repeated, repeatedKey, { ...faq(), faqs: [] }]) assert.equal(resolveHomeFaq([doc], 'en').content, null)
})

test('About layout requires four care steps and complete paragraphs/principles', () => {
  const bad = about(); bad.care.steps.pop()
  assert.equal(resolveAboutInformation([bad], 'en').content, null)
  const missing = about(); delete missing.trust.points[1].body.en
  assert.equal(resolveAboutInformation([missing], 'en').content, null)
  const duplicate = about(); duplicate.origin.paragraphs[1]._key = duplicate.origin.paragraphs[0]._key
  assert.equal(resolveAboutInformation([duplicate], 'en').content, null)
  // The existing renderers key these rows by their visible copy, not array IDs.
  const repeatedCopy = about(); repeatedCopy.origin.paragraphs[1].en = repeatedCopy.origin.paragraphs[0].en
  assert.equal(resolveAboutInformation([repeatedCopy], 'en').status, 'invalid')
  const repeatedTranslation = about(); repeatedTranslation.trust.points[0].title.mr = 'समान'; repeatedTranslation.trust.points[1].title.mr = 'समान'
  assert.equal(resolveAboutInformation([repeatedTranslation], 'mr').status, 'invalid')
})

test('gallery fixed area order, unique identities and nonempty replacement photos protect the existing layout', () => {
  const swapped = gallery(); [swapped.areas[0], swapped.areas[1]] = [swapped.areas[1], swapped.areas[0]]
  const duplicate = gallery(); duplicate.areas[1].area = duplicate.areas[0].area
  const empty = gallery(); empty.areas[0].images = []
  for (const doc of [swapped, duplicate, empty]) assert.equal(resolveFacilityGallery([doc], 'en').content, null)
})

function image(key = 'photo') {
  return { _key: key, crop: { left: 0.1, right: 0.1, top: 0, bottom: 0 }, hotspot: { x: 0.7, y: 0.4, width: 0.2, height: 0.2 }, asset: {
    _id: 'image-fixture-1200x800-jpg', url: 'https://cdn.sanity.io/images/4k9zwr7s/production/fixture-1200x800.jpg',
    metadata: { dimensions: { width: 1200, height: 800 }, lqip: 'data:image/jpeg;base64,AAAA' },
  } }
}
test('native replacement photos keep carousel order, crop/focus and dimensions with optional blur metadata', () => {
  const doc = gallery(); doc.areas[2].images = [image('first'), image('second')]
  const result = resolveFacilityGallery([doc], 'mr')
  assert.equal(result.status, 'sanity')
  const images = result.content.areas[2].images
  assert.equal(images.length, 2)
  assert.equal(images[0].width, 960)
  assert.equal(images[0].height, 800)
  assert.match(images[0].src, /^https:\/\/cdn.sanity.io\/images\/4k9zwr7s\/production\//)
  assert.match(images[0].src, /rect=/)
  assert.ok(Math.abs(parseFloat(images[0].position) - 75) < 0.00001)
  assert.equal(images[0].blurDataURL, 'data:image/jpeg;base64,AAAA')
  delete doc.areas[2].images[0].asset.metadata.lqip
  assert.equal(resolveFacilityGallery([doc], 'en').content.areas[2].images.length, 2)
  assert.equal(resolveFacilityGallery([doc], 'en').content.areas[2].images[0].blurDataURL, undefined)
})

test('foreign assets, impossible crop and duplicate image keys retain the entire static gallery', () => {
  for (const mutate of [
    (p) => { p.asset.url = 'https://cdn.sanity.io/images/other/production/image.jpg' },
    (p) => { p.crop.left = 0.9 },
    (p) => { p.asset.metadata.dimensions.width = 0 },
  ]) {
    const doc = gallery(), photo = image(); mutate(photo); doc.areas[0].images = [photo]
    assert.equal(resolveFacilityGallery([doc], 'en').content, null)
  }
  const doc = gallery(); doc.areas[0].images = [image(), image()]
  assert.equal(resolveFacilityGallery([doc], 'en').content, null)
})

test('all three actual GROQ projections filter approval, drafts and releases and preserve localized array keys', async () => {
  for (const { make, query, resolve } of cases) {
    const doc = make()
    const dataset = [doc, { ...doc, _id: 'drafts.hidden' }, { ...doc, _id: 'versions.release.hidden' }, { ...doc, _id: 'pending', reviewStatus: 'pendingReview' }]
    const result = await (await groq.evaluate(groq.parse(query), { dataset })).get()
    assert.equal(result.length, 1)
    assert.equal(resolve(result, 'mr').status, 'sanity')
    const duplicates = await (await groq.evaluate(groq.parse(query), { dataset: [doc, { ...doc, _id: 'another' }] })).get()
    assert.equal(resolve(duplicates, 'en').status, 'ambiguous')
  }
})

test('actual gallery GROQ dereferences native assets in carousel order', async () => {
  const doc = gallery(), photo = image()
  doc.areas[2].images = [{ ...photo, asset: { _ref: photo.asset._id } }]
  const result = await (await groq.evaluate(groq.parse(facilityGalleryQuery), { dataset: [doc, { ...photo.asset, _type: 'sanity.imageAsset' }] })).get()
  assert.equal(result[0].areas[2].images[0]._key, photo._key)
  assert.equal(resolveFacilityGallery(result, 'en').status, 'sanity')
})

const schema = createSchema({ name: 'editorial-test', types: [localizedString, localizedText, homeFaq, aboutInformation, facilityGallery] })
test('new schemas compile without schema problems', () => assert.deepEqual(schema._validation, []))

test('actual Studio rules enforce complete copy, layout structure and pending approval', async () => {
  for (const { make } of cases) {
    const doc = make(), compiled = schema.get(doc._type)
    const validate = compiled.validation.flatMap((r) => r._rules).find((r) => r.flag === 'custom').constraint
    assert.equal(validate(doc), true)
    assert.notEqual(validate({}), true)
    const approval = compiled.fields.find((f) => f.name === 'reviewStatus').type.validation.flatMap((r) => r._rules).find((r) => r.flag === 'custom').constraint
    assert.notEqual(await approval('pendingReview', {}), true)
    assert.equal(await approval('approved', {}), true)
  }
  const compiled = schema.get('facilityGallery')
  const validate = compiled.validation.flatMap((r) => r._rules).find((r) => r.flag === 'custom').constraint
  const doc = gallery(); doc.areas.reverse()
  assert.notEqual(validate(doc), true)
})
