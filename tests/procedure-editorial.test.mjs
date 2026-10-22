import assert from 'node:assert/strict'
import test from 'node:test'
import { createSchema } from 'sanity'
import { localizedString, localizedText, procedure } from '../sanity/schemaTypes/procedure.ts'
// Card/banner image alt text uses the shared Studio localized type, registered alongside in the real Studio.
import { localizedString as sharedLocalizedString } from '../sanity/reference/schemaTypes/locale/localizedString.ts'
import { localizedText as sharedLocalizedText } from '../sanity/reference/schemaTypes/locale/localizedText.ts'

// Compile and execute the real Studio rules; the only mock is its remote client.
const schema = createSchema({ name: 'procedure-editorial-test', types: [localizedString, localizedText, sharedLocalizedString, sharedLocalizedText, procedure] })
const documentType = schema.get('procedure')

async function validateField(field, value, { publishedSlug = null, publishedId = null, unavailable = false, document = {} } = {}) {
  const client = {
    withConfig() { return this },
    async fetch(query, params) {
      if (unavailable) throw new Error('Simulated unavailable API')
      if (publishedId && params.id !== publishedId) return null
      return query === '*[_id == $id][0].slug.current' ? publishedSlug : true
    },
  }
  const context = {
    document: { _id: 'drafts.editorial-test', _type: 'procedure', ...document },
    parent: document,
    path: [field.name],
    type: field.type,
    schema,
    getClient: () => client,
    i18n: { t: (key) => key },
  }
  return (await Promise.all(field.type.validation.map((rule) => rule.validate(value, context)))).flat()
}

const field = (name) => documentType.fields.find((entry) => entry.name === name)

test('the registered procedure schema compiles without schema problems', () => {
  assert.deepEqual(schema._validation, [])
})

test('actual approval rules reject missing/pending status and accept approved', async () => {
  assert.ok((await validateField(field('reviewStatus'), undefined)).length > 0)
  const pending = await validateField(field('reviewStatus'), 'pendingReview')
  assert.ok(pending.some((marker) => marker.message === 'Clinical approval is required before publishing.'))
  assert.deepEqual(await validateField(field('reviewStatus'), 'approved'), [])
})

test('English is required and nonblank while Marathi is optional in both value types', async () => {
  for (const name of ['procedureLocalizedString', 'procedureLocalizedText']) {
    const fields = schema.get(name).fields
    const en = fields.find((entry) => entry.name === 'en')
    const mr = fields.find((entry) => entry.name === 'mr')
    assert.ok((await validateField(en, undefined)).length > 0)
    assert.ok((await validateField(en, '   ')).length > 0)
    assert.deepEqual(await validateField(mr, undefined), [])
  }
})

test('actual quick-fact rules enforce one to four entries', async () => {
  assert.ok((await validateField(field('quickFacts'), [])).length > 0)
  assert.ok((await validateField(field('quickFacts'), Array.from({ length: 5 }, () => ({})))).length > 0)
})

test('actual slug rule preserves the published URL and fails closed on lookup errors', async () => {
  assert.equal(field('slug').type.options.source, 'name.en')
  assert.deepEqual(await validateField(field('slug'), { current: 'fertility-preservation' }), [])
  assert.deepEqual(await validateField(field('slug'), { current: 'ivf' }, { publishedSlug: 'ivf' }), [])
  const renamed = await validateField(field('slug'), { current: 'new-ivf' }, { publishedSlug: 'ivf' })
  assert.ok(renamed.some((marker) => marker.message.includes('Keep the published slug')))
  const failed = await validateField(field('slug'), { current: 'ivf' }, { unavailable: true })
  assert.ok(failed.some((marker) => marker.message.includes('Could not verify the published slug')))
})

test('approval is a manual status: editing content does not itself require reapproval', async () => {
  const document = { reviewStatus: 'approved', heroDescription: { en: 'Changed draft text' } }
  assert.deepEqual(await validateField(field('reviewStatus'), 'approved', { document }), [])
})

test('release-version slug validation looks up the published document identity', async () => {
  const errors = await validateField(field('slug'), { current: 'renamed-ivf' }, {
    publishedSlug: 'ivf', publishedId: 'editorial-test', document: { _id: 'versions.review.editorial-test' },
  })
  assert.ok(errors.some((marker) => marker.message.includes('Keep the published slug')))
})
