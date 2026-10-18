import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import { createSchema } from 'sanity'
import { siteConfig } from '../config/site.ts'
import { buildRootJsonLd } from '../lib/seo/jsonLd.ts'
import { resolveDoctors, resolveClinicSettings } from '../sanity/lib/clinic-mapping.ts'
import { doctorsQuery, clinicSettingsQuery } from '../sanity/lib/clinic-queries.ts'
import { localizedString, localizedText } from '../sanity/schemaTypes/procedure.ts'
import { doctor } from '../sanity/schemaTypes/doctor.ts'
import { clinicSettings } from '../sanity/schemaTypes/clinic-settings.ts'

const messages = JSON.parse(readFileSync(new URL('../messages/en.json', import.meta.url), 'utf8'))
const mr = JSON.parse(readFileSync(new URL('../messages/mr.json', import.meta.url), 'utf8'))
const value = (en) => ({ en })
const items = (copy) => copy.map((en, i) => ({ _key: `item-${i}`, en }))
const slugs = ['gorakh-mandrupkar', 'saie-mandrupkar']

function profile(key = 'gorakh', order = 0) {
  const t = messages.Team.doctors[key]
  const h = messages.MeetTheDoctors
  return {
    _id: `test-${key}`, reviewStatus: 'approved', slug: `${key}-mandrupkar`, order,
    ...Object.fromEntries(['name', 'title', 'essence', 'intro', 'biography', 'metaDescription'].map((name) => [name, value(t[name])])),
    credentials: items(t.credentials),
    home: { essence: value(h[`${key}Essence`]), intro: value(h[`${key}Intro`]), credentials: items(Array.from({ length: key === 'gorakh' ? 4 : 3 }, (_, i) => h[`${key}Cred${i + 1}`])) },
  }
}

function settings() {
  return {
    _id: 'clinicSettings', reviewStatus: 'approved',
    telephone: siteConfig.contact.telephone, whatsappNumber: siteConfig.contact.whatsappNumber, email: siteConfig.contact.email,
    displayAddress: value(messages.Footer.address), address: { ...siteConfig.address },
    mapUrl: siteConfig.maps.placeUrl, latitude: siteConfig.maps.latitude, longitude: siteConfig.maps.longitude, instagram: siteConfig.social.instagram,
  }
}

test('maps real profile fields and keeps homepage copy distinct from Team copy', () => {
  const result = resolveDoctors([profile()], 'en')
  assert.equal(result.status, 'sanity')
  assert.equal(result.doctors[0].intro, messages.Team.doctors.gorakh.intro)
  assert.equal(result.doctors[0].home.intro, messages.MeetTheDoctors.gorakhIntro)
  assert.notEqual(result.doctors[0].intro, result.doctors[0].home.intro)
  assert.deepEqual(result.doctors[0].credentials, messages.Team.doctors.gorakh.credentials)
  assert.equal(result.doctors[0].portrait, undefined)
})

test('doctor localization uses existing source translations when present and English otherwise', () => {
  const doc = profile()
  doc.name.mr = mr.Team.doctors.gorakh.name
  doc.intro.mr = ' '
  const mapped = resolveDoctors([doc], 'mr').doctors[0]
  assert.equal(mapped.name, mr.Team.doctors.gorakh.name)
  assert.equal(mapped.intro, messages.Team.doctors.gorakh.intro)
  assert.equal(mapped.home.intro, messages.MeetTheDoctors.gorakhIntro)
})

test('doctor ordering is deterministic and duplicate slugs/orders fail closed', () => {
  const result = resolveDoctors([profile('saie', 1), profile()], 'en')
  assert.deepEqual(result.doctors.map((d) => d.slug), slugs)
  assert.equal(resolveDoctors([profile(), { ...profile(), _id: 'another' }], 'en').status, 'ambiguous')
  assert.equal(resolveDoctors([profile(), profile('saie', 0)], 'en').status, 'ambiguous')
})

test('missing, malformed, unapproved, draft and unsupported profiles retain static consumers', () => {
  assert.equal(resolveDoctors([], 'en').status, 'missing')
  for (const input of [null, [{}], [{ ...profile(), reviewStatus: 'pendingReview' }], [{ ...profile(), _id: 'drafts.test' }], [{ ...profile(), _id: 'versions.release.test' }], [{ ...profile(), slug: 'unknown' }], [{ ...profile(), name: { mr: ' ' } }]]) {
    assert.deepEqual(resolveDoctors(input, 'en').doctors, [])
  }
})

test('biography formatting accepts existing tags and rejects unsupported tags/variables', () => {
  assert.equal(resolveDoctors([profile()], 'en').status, 'sanity')
  for (const en of ['<script>bad</script>', 'Unknown {variable}', '<b>Unclosed']) {
    assert.equal(resolveDoctors([{ ...profile(), biography: { en } }], 'en').status, 'invalid')
  }
})

test('homepage credential counts protect the existing fixed card presentation', () => {
  const doc = profile()
  doc.home.credentials.pop()
  assert.equal(resolveDoctors([doc], 'en').status, 'invalid')
})

test('portrait mapping retains crop, focus, dimensions, blur and localized alternative text', () => {
  const doc = profile()
  doc.portrait = {
    alt: { en: messages.Team.doctors.gorakh.imageAlt, mr: mr.Team.doctors.gorakh.imageAlt },
    crop: { left: 0.1, right: 0.1, top: 0, bottom: 0 }, hotspot: { x: 0.5, y: 0.2, width: 0.3, height: 0.3 },
    asset: { _id: 'image-abc123-1000x1200-jpg', url: 'https://cdn.sanity.io/images/4k9zwr7s/production/abc123-1000x1200.jpg', metadata: { dimensions: { width: 1000, height: 1200 }, lqip: 'data:image/jpeg;base64,AA==' } },
  }
  const portrait = resolveDoctors([doc], 'mr').doctors[0].portrait
  assert.equal(portrait.photo.width, 800)
  assert.equal(portrait.photo.height, 1200)
  assert.match(portrait.photo.src, /rect=100%2C0%2C800%2C1200|rect=100,0,800,1200/)
  assert.equal(portrait.position, '50% 20%')
  assert.equal(portrait.alt, mr.Team.doctors.gorakh.imageAlt)
  assert.ok(portrait.photo.blurDataURL.startsWith('data:image/jpeg'))
  doc.portrait.asset.url = 'https://example.com/image.jpg'
  assert.equal(resolveDoctors([doc], 'en').status, 'invalid')
})

test('settings requires exactly one approved canonical singleton and validates destinations', () => {
  assert.equal(resolveClinicSettings([settings()], 'en').status, 'sanity')
  assert.equal(resolveClinicSettings([], 'en').status, 'missing')
  assert.equal(resolveClinicSettings([settings(), settings()], 'en').status, 'ambiguous')
  for (const input of [null, [{}], [{ ...settings(), _id: 'arbitrary' }], [{ ...settings(), reviewStatus: 'pendingReview' }], [{ ...settings(), email: 'bad' }], [{ ...settings(), latitude: 100 }], [{ ...settings(), mapUrl: 'javascript:alert(1)' }], [{ ...settings(), instagram: 'https://example.com' }]]) {
    assert.equal(resolveClinicSettings(input, 'en').settings, null)
  }
})

test('settings address localizes without moving system labels or hours into CMS', () => {
  const doc = settings()
  assert.equal(resolveClinicSettings([doc], 'mr').settings.displayAddress, messages.Footer.address)
  doc.displayAddress.mr = mr.Footer.address
  assert.equal(resolveClinicSettings([doc], 'mr').settings.displayAddress, mr.Footer.address)
})

test('structured data contact overrides preserve existing identity, URLs and hours', () => {
  const fallback = buildRootJsonLd()
  const doc = settings()
  doc.telephone = '+91 99999 99999'
  const result = buildRootJsonLd(resolveClinicSettings([doc], 'en').settings)
  assert.equal(result['@graph'][1].telephone, doc.telephone)
  assert.deepEqual(result['@graph'][1].openingHoursSpecification, fallback['@graph'][1].openingHoursSpecification)
  assert.equal(result['@graph'][0]['@id'], fallback['@graph'][0]['@id'])
  assert.equal(result['@graph'][1].url, fallback['@graph'][1].url)
})

const require = createRequire(import.meta.url)
const groq = createRequire(require.resolve('sanity'))('groq-js')
const query = async (q, dataset, params = {}) => (await groq.evaluate(groq.parse(q), { dataset, params })).get()

test('real doctor query filters approval/drafts and projects existing content in order', async () => {
  const stored = (key, order) => ({ ...profile(key, order), _type: 'doctor', slug: { current: `${key}-mandrupkar` } })
  const doc = stored('gorakh', 0)
  const result = await query(doctorsQuery, [stored('saie', 1), doc, { ...doc, _id: 'drafts.other' }, { ...doc, _id: 'pending', reviewStatus: 'pendingReview' }], { slugs })
  assert.equal(result.length, 2)
  assert.equal(resolveDoctors(result, 'en').status, 'sanity')
})

test('real settings query detects approved duplicates without selecting an arbitrary singleton', async () => {
  const doc = { ...settings(), _type: 'clinicSettings' }
  const one = await query(clinicSettingsQuery, [doc, { ...doc, _id: 'drafts.clinicSettings' }])
  assert.equal(resolveClinicSettings(one, 'en').status, 'sanity')
  const duplicate = await query(clinicSettingsQuery, [doc, { ...doc, _id: 'another-settings' }])
  assert.equal(resolveClinicSettings(duplicate, 'en').status, 'ambiguous')
})

const schema = createSchema({ name: 'phase-three-test', types: [localizedString, localizedText, doctor, clinicSettings] })
test('doctor and settings schemas compile without schema problems', () => assert.deepEqual(schema._validation, []))

async function validate(type, value, document) {
  const context = { document, parent: document, path: [], type, schema, i18n: { t: (key) => key } }
  return (await Promise.all(type.validation.map((rule) => rule.validate(value, context)))).flat()
}
test('actual singleton and doctor approval rules enforce canonical identity and pending review', async () => {
  const type = schema.get('clinicSettings')
  assert.ok((await validate(type, settings(), { _id: 'wrong', _type: 'clinicSettings' })).length > 0)
  assert.deepEqual(await validate(type, settings(), { _id: 'drafts.clinicSettings', _type: 'clinicSettings' }), [])
  const approval = schema.get('doctor').fields.find((f) => f.name === 'reviewStatus').type
  assert.ok((await validate(approval, 'pendingReview', { _id: 'drafts.test', _type: 'doctor' })).length > 0)
})

test('Studio contact validation rejects values that the published settings reader rejects', async () => {
  const type = schema.get('clinicSettings')
  const document = { _id: 'drafts.clinicSettings', _type: 'clinicSettings' }
  for (const [name, invalid] of [['telephone', '-------'], ['mapUrl', 'https://example.com/place'], ['instagram', 'https://example.com/profile']]) {
    const field = type.fields.find((entry) => entry.name === name).type
    assert.ok((await validate(field, invalid, document)).length > 0, `${name} must fail in Studio before publication`)
    assert.deepEqual(await validate(field, settings()[name], document), [])
  }
  const address = type.fields.find((entry) => entry.name === 'address').type
  const country = address.fields.find((entry) => entry.name === 'addressCountry').type
  assert.ok((await validate(country, 'India', document)).length > 0)
  assert.deepEqual(await validate(country, 'IN', document), [])
})

test('Studio biography validation matches the existing rich-message renderer', async () => {
  const field = schema.get('doctor').fields.find((entry) => entry.name === 'biography').type
  const document = { _id: 'drafts.doctor', _type: 'doctor' }
  assert.ok((await validate(field, { en: 'Unsupported <script>copy</script>' }, document)).length > 0)
  assert.deepEqual(await validate(field, profile().biography, document), [])
})

test('optional doctor portrait can be omitted, but an image with only alt text cannot publish', async () => {
  const field = schema.get('doctor').fields.find((entry) => entry.name === 'portrait').type
  const document = { _id: 'drafts.doctor', _type: 'doctor' }
  const errors = async (value) => (await Promise.all((field.validation ?? []).map((rule) => rule.validate(value, { document, path: ['portrait'], type: field, schema, i18n: { t: (key) => key } })))).flat()
  assert.deepEqual(await errors(undefined), [])
  assert.ok((await errors({ _type: 'image', alt: { en: 'Existing portrait' } })).length > 0)
  assert.deepEqual(await errors({ _type: 'image', asset: { _type: 'reference', _ref: 'image-testasset-1200x800-jpg' }, alt: { en: 'Existing portrait' } }), [])
})
