import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import { createSchema, validateDocument, PatchEvent, unset, set } from 'sanity'
import { siteConfig } from '../config/site.ts'
import { buildRootJsonLd } from '../lib/seo/jsonLd.ts'
import { resolveDoctors, resolveClinicSettings } from '../sanity/lib/clinic-mapping.ts'
import { doctorsQuery, clinicSettingsQuery, availabilityQuery } from '../sanity/lib/clinic-queries.ts'
import { clinicAvailability } from '../sanity/schemaTypes/clinic-availability.ts'
import { hoursConfirmationState } from '../sanity/studio/RecordHoursConfirmationAction.ts'
import { availabilityContent, availabilitySnapshot, resolveAvailability } from '../sanity/lib/availability-mapping.ts'
import { availabilityClosuresJsonLd, formatAvailability, getAvailabilityStatus } from '../lib/clinic-availability.ts'
import { getClinicStatus } from '../lib/clinicHours.ts'
import { localizedString, localizedText } from '../sanity/schemaTypes/procedure.ts'
import { doctor, DoctorPortraitInput } from '../sanity/schemaTypes/doctor.ts'
import { clinicSettings } from '../sanity/schemaTypes/clinic-settings.ts'
// SEO social text and image alt use the shared Studio localized types, registered alongside in the real Studio.
import { localizedString as sharedLocalizedString } from '../sanity/reference/schemaTypes/locale/localizedString.ts'
import { localizedText as sharedLocalizedText } from '../sanity/reference/schemaTypes/locale/localizedText.ts'

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

test('homepage qualifications can be added, removed and cleared without a fixed line count', () => {
  const doc = profile()
  doc.home.credentials.pop()
  assert.equal(resolveDoctors([doc], 'en').status, 'sanity')
  doc.home.credentials = []
  assert.deepEqual(resolveDoctors([doc], 'en').doctors[0].home.credentials, [])
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

const schema = createSchema({ name: 'phase-three-test', types: [localizedString, localizedText, sharedLocalizedString, sharedLocalizedText, doctor, clinicSettings, clinicAvailability] })
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
  let asset = { _id: 'image-testasset-1200x800-jpg', url: 'https://cdn.sanity.io/images/4k9zwr7s/production/testasset-1200x800.jpg', mimeType: 'image/jpeg', metadata: { dimensions: { width: 1200, height: 800 } } }
  const errors = async (value) => (await Promise.all((field.validation ?? []).map((rule) => rule.validate(value, { document, path: ['portrait'], type: field, schema, getClient: () => ({ fetch: async () => asset }), i18n: { t: (key) => key } })))).flat()
  assert.deepEqual(await errors(undefined), [])
  assert.ok((await errors({ _type: 'image', alt: { en: 'Existing portrait' } })).length > 0)
  assert.deepEqual(await errors({ _type: 'image', asset: { _type: 'reference', _ref: 'image-testasset-1200x800-jpg' }, alt: { en: 'Existing portrait' } }), [])
  asset = null
  assert.deepEqual((await errors({ asset: { _ref: 'image-missing-1200x800-jpg' } }))[0].path, ['portrait', 'asset'])
})

test('doctor qualifications preserve legacy content, optional details, language and display order through the actual query', async () => {
  const doc = { ...profile(), _type: 'doctor', slug: { current: 'gorakh-mandrupkar' } }
  doc.credentials = [
    { _key: 'first', _type: 'doctorCredential', text: { en: 'Local qualification fixture', mr: 'स्थानिक चाचणी' }, institution: 'Local institution fixture', awardingBody: null, year: 2020 },
    { _key: 'second', _type: 'procedureLocalizedText', en: 'Legacy fixture' },
  ]
  const input = await query(doctorsQuery, [doc], { slugs })
  assert.deepEqual(resolveDoctors(input, 'en').doctors[0].credentials, ['Local qualification fixture · Local institution fixture · 2020', 'Legacy fixture'])
  assert.equal(resolveDoctors(input, 'mr').doctors[0].credentials[0], 'स्थानिक चाचणी · Local institution fixture · 2020')
  doc.credentials.reverse()
  const reversed = await query(doctorsQuery, [doc], { slugs })
  assert.equal(resolveDoctors(reversed, 'en').doctors[0].credentials[0], 'Legacy fixture')
  doc.credentials = []
  assert.deepEqual(resolveDoctors(await query(doctorsQuery, [doc], { slugs }), 'en').doctors[0].credentials, [])
  const withPortrait = profile()
  withPortrait.portrait = { alt: { en: 'Local portrait fixture' }, asset: { _id: 'image-fixture-800x1000-jpg', url: 'https://cdn.sanity.io/images/4k9zwr7s/production/fixture-800x1000.jpg', metadata: { dimensions: { width: 800, height: 1000 } } } }
  assert.ok(resolveDoctors([withPortrait], 'en').doctors[0].portrait, 'LQIP is optional asset metadata')
  withPortrait.portrait = null
  assert.equal(resolveDoctors([withPortrait], 'en').doctors[0].portrait, undefined)
})

test('Doctor publishing requires a qualification while the shorter Home list stays optional', async () => {
  const type = schema.get('doctor'), document = { _id: 'drafts.local-doctor', _type: 'doctor' }
  const qualifications = type.fields.find(field => field.name === 'credentials').type
  for (const value of [undefined, null, []]) {
    const errors = await validate(qualifications, value, document)
    assert.equal(errors.length, 1, JSON.stringify({ value, errors }))
    assert.match(errors[0].message, /at least one clinic-verified qualification/)
  }
  assert.deepEqual(await validate(qualifications, [{ _key: 'verified', _type: 'doctorCredential', text: { en: 'Local qualification fixture' } }], document), [])
  const home = type.fields.find(field => field.name === 'home').type.fields.find(field => field.name === 'credentials').type
  assert.deepEqual(await validate(home, undefined, document), [])
  const member = qualifications.of.find(type => type.name === 'doctorCredential')
  const text = member.fields.find(field => field.name === 'text').type
  assert.deepEqual(await validate(text, { en: 'Local qualification fixture' }, document), [], 'Marathi is optional for Doctor qualifications')
  const errors = await validate(text, { mr: 'स्थानिक चाचणी' }, document)
  assert.deepEqual(errors[0].path, ['en']); assert.match(errors[0].message, /English/)
})

test('Doctor specializations preserve keys, order and Marathi fallback through the actual published query', async () => {
  const doc = { ...profile(), _type: 'doctor', slug: { current: 'gorakh-mandrupkar' }, specializations: [
    { _key: 'first', _type: 'procedureLocalizedText', en: 'Local practice fixture', mr: 'स्थानिक चाचणी' },
    { _key: 'second', _type: 'procedureLocalizedText', en: 'Second practice fixture' },
  ] }
  const map = async locale => resolveDoctors(await query(doctorsQuery, [doc], { slugs }), locale).doctors[0]
  assert.deepEqual((await map('mr')).specializations, [{ _key: 'first', text: 'स्थानिक चाचणी' }, { _key: 'second', text: 'Second practice fixture' }])
  doc.specializations.reverse()
  assert.deepEqual((await map('en')).specializations.map(item => item._key), ['second', 'first'])
  doc.specializations[0].en = ' '
  assert.equal(resolveDoctors(await query(doctorsQuery, [doc], { slugs }), 'en').status, 'invalid')
  doc.specializations = []
  assert.deepEqual((await map('en')).specializations, [])
  delete doc.specializations
  assert.deepEqual((await map('en')).specializations, [])
})

test('Doctor photo Remove clears retained alt text, passes replacement edits and respects read-only', () => {
  let patches, change
  const props = { value: { asset: { _ref: 'old' }, alt: { en: 'Old photo description' } }, onChange: event => { patches = PatchEvent.from(event).patches }, renderDefault: input => { change = input.onChange; return null } }
  DoctorPortraitInput(props); change([unset(['asset']), unset(['crop'])])
  assert.deepEqual(patches.map(patch => ({ type: patch.type, path: patch.path })), [{ type: 'unset', path: [] }])
  change(set({ _ref: 'replacement' }, ['asset']))
  assert.equal(patches[0].value._ref, 'replacement')
  patches = undefined; DoctorPortraitInput({ ...props, readOnly: true }); change(unset(['asset']))
  assert.equal(patches, undefined)
})

function hoursFixture() {
  const doc = { ...clinicAvailability.initialValue(), _id: 'clinicAvailability', _type: 'clinicAvailability', reviewStatus: 'approved', confirmationNote: 'Test-only clinic confirmation fixture', confirmedAt: '2026-10-18T06:00:00.000Z' }
  doc.confirmedSnapshot = availabilitySnapshot(doc)
  return doc
}

test('hours publishing errors point to the editable input and distinguish confirmation from approval', async () => {
  const validateHours = document => validateDocument({ document, workspace: { schema }, getClient: () => { throw new Error('No remote requests in local hours validation') }, getDocumentExists: async () => false })
  const valid = hoursFixture()
  assert.deepEqual(await validateHours(valid), [])
  const pending = await validateHours({ ...valid, reviewStatus: 'pendingReview' })
  assert(pending.some(error => error.path.join('.') === 'reviewStatus'))
  assert(!pending.some(error => error.path.join('.') === 'confirmedAt'))
  const unconfirmed = { ...valid, confirmedAt: undefined, confirmedSnapshot: undefined }
  assert((await validateHours(unconfirmed)).some(error => error.path.join('.') === 'confirmedAt' && error.message.includes('Record hours confirmation')))
  const changed = structuredClone(valid)
  changed.weeklyHours[0].close = '17:00'
  assert((await validateHours(changed)).some(error => error.path.join('.') === 'confirmedAt'))
  changed.weeklyHours[0].close = '09:00'
  const errors = await validateHours(changed)
  assert(errors.some(error => JSON.stringify(error.path) === JSON.stringify(['weeklyHours', { _key: 'mon' }, 'close'])))
  assert(!errors.some(error => error.path.length === 0), 'editors must not receive an unlocated schedule error')
  const closure = { ...valid, closures: [{ _type: 'clinicAvailabilityClosure', _key: 'holiday', date: '2026-02-30', reason: 'Local fixture' }] }
  assert((await validateHours(closure)).some(error => JSON.stringify(error.path) === JSON.stringify(['closures', { _key: 'holiday' }, 'date'])))
})

test('confirmation control can repair a malformed timestamp and never treats changed hours as confirmed', () => {
  const valid = hoursFixture()
  assert.equal(hoursConfirmationState(valid).confirmed, true)
  const badTimestamp = { ...valid, confirmedAt: 'invalid-date' }
  assert.ok(hoursConfirmationState(badTimestamp).snapshot)
  assert.equal(hoursConfirmationState(badTimestamp).confirmed, false)
  assert.equal(hoursConfirmationState({ ...valid, confirmationNote: 'Changed local reference' }).confirmed, false)
  assert.equal(hoursConfirmationState({ ...valid, confirmationNote: '' }).snapshot, null)
  assert.equal(hoursConfirmationState({ ...valid, reviewStatus: 'pendingReview' }).confirmed, true, 'confirmation does not grant editorial approval')
  assert.equal(resolveAvailability([{ ...valid, reviewStatus: 'pendingReview' }], true).value, null)
})

test('hours form prefills all seven current website days without approval or invented confirmation', () => {
  const initial = clinicAvailability.initialValue()
  assert.equal(initial.weeklyHours.length, 7)
  assert.ok(initial.weeklyHours.every(row => row._type === 'clinicAvailabilityDay' && row._key === row.day), 'native Sanity array members carry their declared type and stable keys')
  assert.equal(initial.weeklyHours.find(row => row.day === 'mon').close, '18:00')
  assert.equal(initial.weeklyHours.find(row => row.day === 'sun').closed, true)
  assert.equal(initial.confirmedAt, undefined)
  assert.equal(initial.confirmedSnapshot, undefined)
  assert.equal(availabilitySnapshot(initial), null)
})

test('availability validates clock ranges, dates, weekday identity and renewed confirmation', () => {
  const doc = hoursFixture()
  assert.equal(resolveAvailability([doc], true).status, 'sanity')
  for (const input of [null, [], [doc, doc], [{ ...doc, _id: 'drafts.clinicAvailability' }], [{ ...doc, _id: 'versions.release.clinicAvailability' }], [{ ...doc, timezone: 'UTC' }], [{ ...doc, confirmedAt: null }], [{ ...doc, confirmedSnapshot: 'stale' }]]) assert.equal(resolveAvailability(input, true).value, null)
  for (const mutate of [
    value => { value.weeklyHours[0].open = '24:00' },
    value => { value.weeklyHours[0].close = value.weeklyHours[0].open },
    value => { value.weeklyHours[0].close = '09:00' },
    value => { value.weeklyHours[1].day = value.weeklyHours[0].day },
    value => { value.weeklyHours.pop() },
    value => { value.weeklyHours.forEach(row => row.closed = true) },
    value => { value.closures = [{ date: '2026-02-30', reason: 'Invalid date fixture' }] },
    value => { value.closures = [{ date: '2026-10-20', reason: 'One' }, { date: '2026-10-20', reason: 'Duplicate' }] },
  ]) {
    const invalid = structuredClone(doc); mutate(invalid)
    assert.equal(availabilityContent.safeParse(invalid).success, false)
    assert.equal(resolveAvailability([invalid], true).value, null)
  }
  const changed = structuredClone(doc); changed.weeklyHours[0].close = '17:00'
  assert.equal(resolveAvailability([changed], true).value, null, 'old confirmation never approves edited hours')
  changed.confirmedSnapshot = availabilitySnapshot(changed)
  assert.equal(resolveAvailability([changed], true).status, 'sanity')
})

test('open indicator uses IST boundaries, weekly closures and extended holidays from the same schedule', () => {
  const doc = hoursFixture(), schedule = resolveAvailability([doc], true).value
  assert.equal(getAvailabilityStatus(new Date('2026-10-19T04:29:59Z'), schedule).state, 'closed_today')
  assert.equal(getAvailabilityStatus(new Date('2026-10-19T04:30:00Z'), schedule).state, 'open')
  assert.equal(getAvailabilityStatus(new Date('2026-10-19T12:30:00Z'), schedule).state, 'closed_today')
  assert.equal(getAvailabilityStatus(new Date('2026-10-18T06:00:00Z'), schedule).state, 'closed_weekly')
  schedule.holidays = Array.from({ length: 14 }, (_, i) => ({ date: new Date(Date.UTC(2026, 9, 19 + i)).toISOString().slice(0, 10), name: 'Test closure' }))
  const holiday = getAvailabilityStatus(new Date('2026-10-19T06:00:00Z'), schedule)
  assert.equal(holiday.state, 'holiday')
  assert.equal(holiday.nextOpenDisplay, 'Monday at 10:00 AM')
  assert.equal(availabilityClosuresJsonLd(schedule).length, 14)
  assert.notEqual(formatAvailability(schedule, 'mr'), formatAvailability(schedule, 'en'))
  const previous = process.env.TZ
  try {
    for (const zone of ['UTC', 'America/New_York', 'Pacific/Honolulu']) {
      process.env.TZ = zone
      assert.equal(getAvailabilityStatus(new Date('2026-10-19T06:00:00Z'), { ...schedule, holidays: [] }).state, 'open')
    }
  } finally { if (previous === undefined) delete process.env.TZ; else process.env.TZ = previous }
})

test('published hours query excludes drafts/releases/unapproved records and structured data shares the confirmed schedule', async () => {
  const doc = hoursFixture()
  const rows = await query(availabilityQuery, [doc, { ...doc, _id: 'drafts.clinicAvailability' }, { ...doc, _id: 'versions.release.clinicAvailability' }, { ...doc, _id: 'pending', reviewStatus: 'pendingReview' }])
  assert.equal(rows.length, 1)
  const schedule = resolveAvailability(rows, true).value
  assert.ok(schedule)
  assert.equal(buildRootJsonLd(null, schedule)['@graph'][1].openingHoursSpecification[0].closes, '18:00')
  assert.equal(buildRootJsonLd()['@graph'][1].openingHoursSpecification[0].closes, '18:00', 'clinic-confirmed 6 PM also corrects the previous 8 PM fallback')
  assert.equal(getClinicStatus(new Date('2026-10-19T12:30:00Z'), schedule).state, 'closed_today')
  assert.equal(resolveAvailability(await query(availabilityQuery, [doc, { ...doc, _id: 'duplicate' }]), true).value, null)
  const type = schema.get('clinicAvailability')
  assert.deepEqual(await validate(type, doc, doc), [])
  const changed = structuredClone(doc); changed.weeklyHours[0].close = '17:00'
  assert.ok((await validate(type, changed, changed)).length > 0, 'Studio blocks stale confirmation')
})
