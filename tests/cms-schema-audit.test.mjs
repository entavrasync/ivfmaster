import assert from 'node:assert/strict'
import test from 'node:test'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { createSchema, validateDocument } from 'sanity'
import config from '../sanity.config.ts'
import initial from '../sanity/reference/initial-content.json' with { type: 'json' }
import en from '../messages/en.json' with { type: 'json' }
import { PROCEDURES } from '../lib/procedures.ts'
import { aboutContent } from '../lib/content/about.ts'
import { mapProcedureDocument } from '../sanity/lib/procedure-mapping.ts'
import { resolveArticles } from '../sanity/lib/article-mapping.ts'
import { resolvePageSeo } from '../sanity/lib/seo-mapping.ts'
import { availabilitySnapshot, resolveAvailability } from '../sanity/lib/availability-mapping.ts'
import { teamValuesFromTrust } from '../sanity/lib/team-values-mapping.ts'
import { mergeAboutPage, mergeSiteMessages, resolveSiteChrome } from '../sanity/lib/site-content-mapping.ts'
import { localizedValue } from '../sanity/lib/localized-query.ts'
import { homePageQuery } from '../sanity/reference/queries/home.ts'
import { aboutPageQuery } from '../sanity/reference/queries/about.ts'
import { teamPageQuery } from '../sanity/reference/queries/team.ts'
import { proceduresHubQuery } from '../sanity/reference/queries/procedures.ts'
import { globalsQuery } from '../sanity/reference/queries/globals.ts'
import { contactPageQuery } from '../sanity/reference/queries/contact.ts'
import { articlesQuery } from '../sanity/lib/article-query.ts'

const require = createRequire(import.meta.url)
const groq = createRequire(require.resolve('sanity'))('groq-js')
const query = async (source, dataset, locale = 'en') => (await groq.evaluate(groq.parse(source), { dataset, params: { locale } })).get()
const schema = createSchema({ name: 'whole-cms-audit', types: config.schema.types })
const photo = { _type: 'image', asset: { _type: 'reference', _ref: 'image-audit-1800x1200-jpg' }, alt: { en: 'Local image fixture' }, crop: { left: .1, right: .1, top: .1, bottom: .1 }, hotspot: { x: .7, y: .4, width: .2, height: .2 } }
const asset = { _id: photo.asset._ref, _type: 'sanity.imageAsset', url: 'https://cdn.sanity.io/images/4k9zwr7s/production/audit-1800x1200.jpg', metadata: { dimensions: { width: 1800, height: 1200 } } }
const client = { withConfig() { return this }, fetch: async (source, params) => source.includes('sanity.imageAsset') ? { ...asset, _id: params.id } : source.trim().startsWith('!defined') ? true : null }
const validate = async document => (await validateDocument({ document, workspace: { schema }, getClient: () => client, getDocumentExists: async () => true })).filter(marker => marker.level === 'error')
const approved = (type, value, id = type) => ({ ...structuredClone(value), _id: id, _type: type, reviewStatus: 'approved' })

test('every registered document type has a native valid fixture and retains its approval gate', async () => {
  assert.deepEqual(schema._validation, [])
  const documents = []
  for (const definition of config.schema.types.filter(type => type.type === 'document')) {
    const type = definition.name
    if (['procedure', 'doctor', 'article'].includes(type)) {
      documents.push(...initial[{ procedure: 'procedures', doctor: 'doctors', article: 'articles' }[type]].map((entry, index) => approved(type, entry.value, `local-${type}-${index}`)))
    } else if (type === 'teamValues') documents.push(approved(type, teamValuesFromTrust(initial.singletons.aboutPage.trust)))
    else if (type === 'faq') documents.push(approved(type, { question: { en: 'Local question fixture?' }, answer: { en: 'Local answer fixture.' }, order: 0, isPublished: true }))
    else if (type === 'testimonial') documents.push(approved(type, { quote: 'Local test quotation; no patient content or publication.', quoteLanguage: 'en', order: 0, consentOnFile: false, isPublished: false }))
    else {
      const value = typeof definition.initialValue === 'function' ? await definition.initialValue() : definition.initialValue
      const doc = approved(type, value)
      if (type === 'homePage') Object.assign(doc.hero, { desktopImage: photo, mobileImage: photo })
      if (type === 'clinicAvailability') {
        doc.confirmationNote = 'Local automated fixture only; no actual clinic confirmation.'
        doc.confirmedAt = '2026-10-26T06:00:00.000Z'
        doc.confirmedSnapshot = availabilitySnapshot(doc)
      }
      documents.push(doc)
    }
  }
  assert.equal(new Set(documents.map(doc => doc._type)).size, 20)
  for (const doc of documents) {
    assert.deepEqual(await validate(doc), [], `${doc._type}: ${doc._id}`)
    assert((await validate({ ...doc, reviewStatus: 'pendingReview' })).some(marker => marker.path[0] === 'reviewStatus'), `${doc._type} approval must remain required`)
  }
  assert((await validate(approved('testimonial', { quote: 'Local test quotation without patient content.', quoteLanguage: 'en', order: 0, consentOnFile: false, isPublished: true }))).some(marker => marker.path[0] === 'isPublished'))
})

test('all active image fields reject unsupported, unavailable and invalidly cropped assets', async () => {
  const fields = []
  function walk(type, path, ancestors = []) {
    if (ancestors.includes(type)) return
    if (type.name === 'image') { fields.push({ type, path }); return }
    for (const field of type.fields ?? []) if (field.type.hidden !== true && field.type.readOnly !== true) walk(field.type, [...path, field.name], [...ancestors, type])
    for (const member of type.of ?? []) walk(member, [...path, 0], [...ancestors, type])
  }
  for (const definition of config.schema.types.filter(type => type.type === 'document')) walk(schema.get(definition.name), [definition.name])
  assert(fields.length >= 20)
  for (const { type, path } of fields) {
    const errors = async (value, fetched = asset) => (await Promise.all(type.validation.map(rule => rule.validate(value, { type, schema, path, document: { _type: path[0] }, getClient: () => ({ fetch: async () => fetched }), i18n: { t: key => key } })))).flat()
    assert.deepEqual(await errors(photo), [], path.join('.'))
    assert((await errors({ ...photo, asset: { _ref: 'image-test-100x100-gif' } })).length, path.join('.'))
    assert((await errors(photo, null)).length, path.join('.'))
    assert((await errors({ ...photo, crop: { left: .6, right: .6, top: 0, bottom: 0 } })).length, path.join('.'))
  }
})

test('blank optional translations fall back in every page query, including references and nested arrays', async () => {
  const blankMarathi = value => {
    if (Array.isArray(value)) return value.map(blankMarathi)
    if (!value || typeof value !== 'object') return value
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, key === 'mr' ? ' \t\u00a0' : blankMarathi(item)]))
  }
  const dataset = Object.entries(initial.singletons).map(([type, value]) => approved(type, blankMarathi(value)))
  dataset.push(approved('contactPage', blankMarathi(config.schema.types.find(type => type.name === 'contactPage').initialValue())))
  for (const source of [homePageQuery, aboutPageQuery, teamPageQuery, proceduresHubQuery, globalsQuery, contactPageQuery]) assert.deepEqual(await query(source, dataset, 'mr'), await query(source, dataset, 'en'))
  for (const text of ['', ' \t\u00a0', '!!!', '🦷', 'मराठी']) {
    const result = await query(`*[_type == 'fixture'][0]{"value": ${localizedValue('text')}}`, [{ _type: 'fixture', text: { en: 'English fixture', mr: text } }], 'mr')
    assert.equal(result.value, text.trim() ? text : 'English fixture')
  }
  const home = approved('homePage', initial.singletons.homePage)
  home.mythsFacts.faqReferences = [{ _type: 'reference', _ref: 'local-faq' }]
  const faq = approved('faq', { isPublished: true, question: { en: 'Reference fixture?', mr: '' }, answer: { en: 'Reference answer.', mr: ' ' } }, 'local-faq')
  assert.equal((await query(homePageQuery, [home, faq], 'mr')).mythsFacts.referencedItems[0].answer, 'Reference answer.')
  faq.reviewStatus = 'pendingReview'
  assert.equal((await query(homePageQuery, [home, faq], 'mr')).mythsFacts.referencedItems[0].answer, null)
})

test('clearing optional SEO preserves procedure and article content and native publication', async () => {
  const proc = approved('procedure', initial.procedures[0].value, 'local-procedure')
  proc.seo = { metaTitle: { en: '', mr: ' ' }, metaDescription: {} }
  assert.deepEqual(await validate(proc), [])
  const mapped = mapProcedureDocument({ ...proc, slug: proc.slug.current }, PROCEDURES.find(item => item.slug === proc.slug.current), 'mr')
  assert(mapped)
  assert.equal(mapped.seo.title, undefined)
  const doc = approved('article', { ...initial.articles[0].value, seo: proc.seo }, 'local-article')
  assert.deepEqual(await validate(doc), [])
  const rows = await query(articlesQuery, [doc])
  // A minimal fallback retains the original article's category and identity.
  assert.equal(resolveArticles(rows, [{ slug: doc.slug.current, category: doc.category }], 'en').status, 'sanity')
  const home = approved('homePage', initial.singletons.homePage)
  Object.assign(home.hero, { desktopImage: photo, mobileImage: photo })
  home.seo = proc.seo
  assert.deepEqual(await validate(home), [])
  const doctor = approved('doctor', initial.doctors[0].value, 'local-doctor')
  doctor.seo = { metaTitle: {} }
  assert.deepEqual(await validate(doctor), [])
})

test('closed days ignore hidden stale times without changing confirmation or open-day validation', async () => {
  const doc = approved('clinicAvailability', config.schema.types.find(type => type.name === 'clinicAvailability').initialValue())
  Object.assign(doc, { confirmationNote: 'Local fixture only.', confirmedAt: '2026-10-26T06:00:00.000Z' })
  const closed = doc.weeklyHours.find(day => day.closed)
  closed.open = ''; closed.close = 'old hidden input'
  doc.confirmedSnapshot = availabilitySnapshot(doc)
  assert(doc.confirmedSnapshot)
  assert.deepEqual(await validate(doc), [])
  assert.equal(resolveAvailability([doc], true).status, 'sanity')
  closed.closed = false
  const errors = await validate(doc)
  assert(errors.some(marker => marker.path.at(-1) === 'open'))
  assert.equal(resolveAvailability([doc], true).value, null)
})

test('CMS mappings apply citation destinations, empty prose halves, trust-point counts and social-image crops', async () => {
  const home = approved('homePage', initial.singletons.homePage)
  Object.assign(home.whyTrust.credentialCitation, { textBefore: { en: '' }, textAfter: { en: '' }, link: { label: { en: 'Edited source fixture' }, link: { kind: 'external', externalUrl: 'https://example.com/source', opensInNewTab: true } } })
  const projected = await query(homePageQuery, [home])
  assert.equal(mergeSiteMessages(en, { home: projected }, 'en').WhyTrust.gestosisLink, '<link>Edited source fixture</link>')
  assert.deepEqual(resolveSiteChrome(null, projected).citation, { href: 'https://example.com/source', opensInNewTab: true })
  const about = approved('aboutPage', initial.singletons.aboutPage)
  about.trust.points = about.trust.points.slice(0, 2)
  const content = await query(aboutPageQuery, [about])
  assert.equal(mergeAboutPage(aboutContent, content).trust.points.length, 2)
  about.seo.ogImage = photo
  const seo = resolvePageSeo((await query(aboutPageQuery, [about, asset])).seo, 'en')
  assert.equal(seo.ogImage.width, 1440)
  assert.equal(seo.ogImage.height, 960)
  assert.match(seo.ogImage.url, /rect=/)
})

test('Studio suppresses layout slots that have no public output and validates active destinations', async () => {
  const block = schema.get('ctaBlock')
  const secondary = block.fields.find(field => field.name === 'secondary').type
  assert.equal(secondary.hidden({ document: { _type: 'teamPage' }, path: ['closing', 'secondary'] }), true)
  const heading = block.fields.find(field => field.name === 'heading').type
  assert.equal(heading.hidden({ document: { _type: 'teamPage' }, path: ['closing', 'heading'] }), false)
  const home = approved('homePage', initial.singletons.homePage)
  Object.assign(home.hero, { desktopImage: photo, mobileImage: photo })
  home.hero.primaryCta.link = { kind: 'phone' }
  assert((await validate(home)).some(marker => marker.path.join('.') === 'hero.primaryCta.link.kind'))
  home.hero.primaryCta.link = { kind: 'internal', internalPath: '/contact', externalUrl: 'stale hidden URL' }
  assert.deepEqual(await validate(home), [])
  home.whyTrust.closing.secondary = { label: {}, link: { kind: 'internal', internalPath: '' } }
  assert.deepEqual(await validate(home), [])
})

test('plain-copy validation identifies editable locale inputs and preserves supported copyright and biography syntax', async () => {
  const home = approved('homePage', initial.singletons.homePage)
  Object.assign(home.hero, { desktopImage: photo, mobileImage: photo })
  for (const text of ['Unknown {variable}', '<script>Unsupported markup</script>']) {
    home.hero.headline.en = text
    assert((await validate(home)).some(marker => marker.path.join('.') === 'hero.headline.en' && marker.message.includes('plain text')))
  }
  const footer = approved('footer', initial.singletons.footer)
  footer.copyright.en = '© {year} Local fixture'
  assert.deepEqual(await validate(footer), [])
  footer.copyright.en = '© {unknown} Local fixture'
  assert((await validate(footer)).some(marker => marker.path.join('.') === 'copyright.en'))
})

test('canonical validation accepts published destinations and identifies missing or incorrectly localized URLs', async () => {
  const type = schema.get('seo').fields.find(field => field.name === 'canonicalUrl').type
  const errors = async (value, exists = false) => (await Promise.all(type.validation.map(rule => rule.validate(value, { type, schema, path: ['seo', 'canonicalUrl'], document: { _type: 'procedure' }, getClient: () => ({ withConfig() { return this }, fetch: async () => exists }), i18n: { t: key => key } })))).flat()
  assert.deepEqual(await errors('https://www.ivfmaster.in/procedures/ivf'), [])
  assert((await errors('https://www.ivfmaster.in/en/contact')).length)
  assert((await errors('https://www.ivfmaster.in/procedures/missing-page')).length)
  assert.deepEqual(await errors('https://www.ivfmaster.in/procedures/published-fixture', true), [])
  assert((await errors('https://example.com/contact')).length)
})

test('localized paragraph arrays identify the exact stable item and English field', async () => {
  const about = approved('aboutPage', initial.singletons.aboutPage)
  about.origin.paragraphs.push({ _type: 'localizedText', _key: 'incomplete-paragraph', en: ' ', mr: 'स्थानिक चाचणी' })
  let errors = await validate(about)
  assert(errors.some(marker => JSON.stringify(marker.path) === JSON.stringify(['origin', 'paragraphs', { _key: 'incomplete-paragraph' }, 'en'])))
  about.origin.paragraphs.reverse()
  errors = await validate(about)
  assert(errors.some(marker => JSON.stringify(marker.path) === JSON.stringify(['origin', 'paragraphs', { _key: 'incomplete-paragraph' }, 'en'])))
})

test('procedure publication guidance opens approval and keyed headings without changing the article editor or review status', () => {
  const React = require('react'), { renderToStaticMarkup } = require('react-dom/server'), ts = require('typescript')
  const filename = new URL('../sanity/studio/ProcedurePublicationInput.ts', import.meta.url), localRequire = createRequire(filename), exports = {}
  const doc = { _id: 'drafts.local-procedure', _type: 'procedure', _rev: 'current', reviewStatus: 'pendingReview' }
  const path = ['process', { _key: 'first-step' }, 'title', 'en'], calls = []
  let status = { isValidating: false, revision: 'current', validation: [{ level: 'error', path, message: 'Enter this heading in English.' }] }
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText
  new Function('require', 'exports', code)(id => id === 'sanity' ? {
    useValidationStatus: () => status,
    useFormCallbacks: () => ({ onFieldGroupSelect: (...args) => calls.push(['group', ...args]), onPathOpen: path => calls.push(['open', path]), onPathFocus: path => calls.push(['focus', path]) }),
  } : localRequire(id), exports)
  const props = { value: doc, renderDefault: () => React.createElement('div', {}, 'Native procedure fields') }
  const view = exports.ProcedurePublicationInput(props), buttons = []
  function walk(element) { if (!React.isValidElement(element)) return; if (element.type === 'button') buttons.push(element); React.Children.forEach(element.props.children, walk) }
  walk(view)
  assert.equal(buttons[0].props.children, 'Open clinical approval')
  assert.equal(buttons[0].props.style.border, '1px solid currentColor')
  buttons[0].props.onClick()
  assert.deepEqual(calls.splice(0), [['group', [], 'identity'], ['open', ['reviewStatus']], ['focus', ['reviewStatus']]])
  buttons[1].props.onClick()
  assert.deepEqual(calls, [['group', [], 'content'], ['open', path], ['focus', path]])
  const html = renderToStaticMarkup(view)
  assert.match(html, /Steps.*Step heading.*English/)
  assert.match(html, /saves in the draft automatically/)
  assert.match(html, /Native procedure fields/)
  assert.equal(doc.reviewStatus, 'pendingReview')
  status = { ...status, revision: 'older' }
  assert.match(renderToStaticMarkup(exports.ProcedurePublicationInput(props)), /Checking procedure fields/)
  assert.equal(schema.get('article').components?.input, undefined, 'additional article editor changes were skipped')
})
