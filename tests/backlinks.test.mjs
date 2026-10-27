import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import ts from 'typescript'

const require = createRequire(import.meta.url)
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, file) => module._compile(ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, file)
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'ae09qs5c'
process.env.NEXT_PUBLIC_SANITY_DATASET = 'production'
const ivf = existsSync(new URL('../config/site.ts', import.meta.url))
const siteUrl = ivf ? 'https://www.ivfmaster.in' : 'https://www.aesthedentpune.com'
const { backlinkIssues, resolveBacklinks } = require('../sanity/lib/backlinks.ts')
const { BacklinksInput } = require('../sanity/studio/BacklinksInput.ts')
const { backlinksField } = require('../sanity/schemaTypes/backlinks.ts')
const { createSchema, validateDocument } = require('sanity')
const { Mutation } = createRequire(require.resolve('sanity'))('@sanity/mutator')
const { parse, evaluate } = createRequire(require.resolve('sanity'))('groq-js')
const { renderToStaticMarkup } = require('react-dom/server')
const { createElement: h } = require('react')
const { BacklinkReferences } = require(ivf ? '../components/SEO/BacklinkReferences.tsx' : '../components/seo/BacklinkReferences.tsx')
const raw = [{ _type: 'backlink', _key: 'one', url: 'https://example.org/profile?ref=clinic#mention' }, { _type: 'backlink', _key: 'two', url: 'https://example.org/another' }]
const execute = (file, dependencies = {}) => {
  const path = new URL('../' + file, import.meta.url), local = createRequire(path), exports = {}
  const js = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText
  new Function('require', 'exports', js)(id => id === 'server-only' ? {} : dependencies[id] ?? local(id), exports)
  return exports
}

test('native Studio input preserves editing, reorder/remove callbacks, keys and read-only permissions', async () => {
  let input, doc = { _id: 'page', _type: 'testPage', seo: { metaTitle: 'Keep title' } }
  const apply = patch => { doc = new Mutation({ mutations: [{ patch: { id: 'page', ...patch } }] }).apply(doc) }
  const props = {
    renderDefault: value => { input = value; return null },
    onItemAppend: item => { apply({ setIfMissing: { 'seo.backlinks': [] } }); apply({ insert: { after: 'seo.backlinks[-1]', items: [item] } }) },
    onItemRemove: key => apply({ unset: ['seo.backlinks[_key=="' + key + '"]'] }),
    onItemMove: () => {},
  }
  BacklinksInput(props)
  assert.equal(input.onItemRemove, props.onItemRemove); assert.equal(input.onItemMove, props.onItemMove)
  const button = input.arrayFunctions()
  assert.equal(button.props.children, '+ Add backlink')
  button.props.onClick()
  const first = doc.seo.backlinks[0]._key
  apply({ set: { ['seo.backlinks[_key=="' + first + '"].url']: raw[0].url } })
  button.props.onClick()
  const second = doc.seo.backlinks[1]._key
  apply({ set: { ['seo.backlinks[_key=="' + second + '"].url']: raw[1].url } })
  // Sanity represents an item move as an unset and keyed insert.
  const moving = doc.seo.backlinks[1]
  input.onItemRemove(second); apply({ insert: { before: 'seo.backlinks[0]', items: [moving] } })
  assert.deepEqual(doc.seo.backlinks.map(item => item._key), [second, first])
  input.onItemRemove(first)
  assert.equal(doc.seo.metaTitle, 'Keep title')
  assert.equal(JSON.parse(JSON.stringify(doc)).seo.backlinks[0].url, raw[1].url)
  BacklinksInput({ ...props, readOnly: true })
  assert.equal(input.arrayFunctions().props.disabled, true)
  input.arrayFunctions().props.onClick()
  assert.equal(doc.seo.backlinks.length, 1)
})

test('native validation targets malformed and duplicate URLs while optional fields stay optional', async () => {
  const schema = createSchema({ name: 'backlinks', types: [{ name: 'testPage', type: 'document', fields: [backlinksField(siteUrl)] }] })
  const validate = backlinks => validateDocument({ document: { _id: 'page', _type: 'testPage', backlinks }, workspace: { schema }, getClient: () => { throw Error('No remote access') }, getDocumentExists: async () => true })
  for (const value of [undefined, null, [], raw]) assert.equal((await validate(value)).length, 0)
  for (const url of ['', '/about', '//external.org', 'javascript:alert(1)', 'data:text/html,hello', 'mailto:test@example.org', 'https://name:secret@example.org/', siteUrl + '/about', siteUrl.replace('www.', '') + '/', 'https://broken host/', 'https://example.org/\\evil']) {
    const markers = await validate([{ _key: 'bad', _type: 'backlink', url }])
    assert.ok(markers.some(marker => marker.level === 'error' && marker.path.at(-1) === 'url'), url)
  }
  const markers = await validate([raw[0], { ...raw[0], _key: 'duplicate', url: 'https://EXAMPLE.org:443/profile?ref=clinic#mention' }])
  assert.ok(markers.some(marker => marker.path.some(part => part?._key === 'duplicate') && marker.path.at(-1) === 'url'))
})

test('defensive mapping isolates malformed records, keeps meaningful URLs and renders localized safe links', () => {
  const errors = [], original = console.error; console.error = message => errors.push(message)
  let entries
  try { entries = resolveBacklinks([raw[0], null, { _key: 'bad', url: 'javascript:alert(1)' }, { ...raw[0], _key: 'repeat' }, raw[1]], siteUrl) }
  finally { console.error = original }
  assert.equal(errors.length, 1)
  assert.deepEqual(entries.map(item => item.url), raw.map(item => item.url))
  const html = renderToStaticMarkup(h('div', null, h(BacklinkReferences, { entries, locale: 'mr' }), h('footer', null, 'Footer')))
  assert.equal((html.match(/<a /g) ?? []).length, 2)
  assert.ok(html.includes('example.org/profile?ref=clinic#mention'))
  assert.ok(html.indexOf('backlink-references-heading') < html.indexOf('<footer'))
  assert.ok(html.includes('sm:grid-cols-2') && html.includes('lg:grid-cols-3'))
  assert.ok(html.includes('बॅकलिंक संदर्भ'))
  assert.ok(!html.includes('target=') && !html.includes('application/ld+json'))
  assert.equal(renderToStaticMarkup(h(BacklinkReferences, { entries: [] })), '')
  assert.equal(backlinkIssues([{ _key: 'x', url: 'https://external.org/?q=<script>' }], siteUrl).length, 0)
  assert.ok(!renderToStaticMarkup(h(BacklinkReferences, { entries: resolveBacklinks([{ _key: 'x', url: 'https://external.org/?q=<script>' }], siteUrl) })).includes('<script>'))
})

test('every page schema has backlinks, site-wide defaults cannot supply public links', () => {
  const { schemaTypes } = require('../sanity/schemaTypes/index.ts')
  const schema = createSchema({ name: 'coverage', types: schemaTypes })
  const pages = ivf ? ['homePage','aboutPage','teamPage','contactPage','proceduresPage','educationPage','procedure','article','doctor'] : ['homePage','aboutPage','experiencePage','servicesPage','teamPage','insightsPage','contactPage','localLandingPage','service','insight']
  for (const name of pages) {
    const seo = schema.get(name).fields.find(field => field.name === 'seo').type
    assert.ok(seo.fields.some(field => field.name === 'backlinks'), name)
  }
  if (!ivf) {
    assert.ok(!schema.get('seoSettings').fields[0].type.fields.some(field => field.name === 'backlinks'))
    const { resolveSeoInventory } = require('../sanity/lib/seo-mapping.ts')
    assert.equal(resolveSeoInventory([{ _id: 'seoSettings', _type: 'seoSettings', defaults: { backlinks: raw } }]).value.defaults.backlinks, undefined)
  }
})



test('published singleton and collection queries carry backlinks through readers in both locales and refresh without static fallback', async () => {
  const initial = require('../sanity/reference/initial-content.json')
  const calls = [], { client: actualClient } = execute('sanity/lib/client.ts')
  assert.equal(actualClient.config().perspective, 'published')
  const singletonTypes = ['homePage','aboutPage','teamPage','contactPage','proceduresPage','educationPage']
  const singletons = singletonTypes.map(_type => ({ ...(initial.singletons[_type] ?? {}), _id: _type, _type, reviewStatus: 'approved', seo: { backlinks: raw, metaTitle: { en: 'SEO title', mr: 'एसईओ शीर्षक' } } }))
  const collections = ['procedures','doctors','articles'].flatMap(kind => initial[kind].map((entry, i) => ({ ...structuredClone(entry.value), _id: kind + i, _type: kind === 'procedures' ? 'procedure' : kind === 'doctors' ? 'doctor' : 'article', reviewStatus: 'approved', seo: { ...entry.value.seo, backlinks: raw } })))
  let dataset = [...singletons, ...collections]
  dataset.push(...dataset.map(doc => ({ ...doc, _id: 'drafts.' + doc._id, seo: { backlinks: [{ ...raw[0], url: 'https://draft.example.org' }] } })))
  const client = { fetch: async (query, params, options) => {
    calls.push(options)
    const published = dataset.filter(doc => !doc._id.startsWith('drafts.') && !doc._id.startsWith('versions.'))
    return (await evaluate(parse(query), { dataset: published, params })).get()
  } }
  const site = execute('sanity/lib/site-content.ts', { './client': { client } })
  const procedures = execute('sanity/lib/procedures.ts', { './client': { client } })
  const clinic = execute('sanity/lib/clinic.ts', { '../../lib/team': { doctors: initial.doctors.map(entry => ({ slug: entry.slug })) }, './client': { client }, 'next-intl/server': { getTranslations: async () => () => 'Translation fixture' } })
  const fallbackArticles = execute('lib/articles.ts', new Proxy({}, { get: (_, name) => ({ src: String(name), width: 1200, height: 800 }) })).ARTICLES
  const articles = execute('sanity/lib/articles.ts', { '../../lib/articles': { ARTICLES: fallbackArticles }, './client': { client }, 'next-intl/server': { getMessages: async () => ({}) } })
  const original = console.error; console.error = () => {}
  try {
    for (const locale of ['en','mr']) {
      for (const page of ['home','about','team','contact','procedures','education']) {
        const seo = (await site.getSeoContext(locale, page)).seo
        assert.deepEqual(seo.backlinks.map(entry => entry.url), raw.map(entry => entry.url), page)
        assert.equal(seo.title, locale === 'en' ? 'SEO title' : 'एसईओ शीर्षक')
      }
      const procs = await procedures.getProcedures(locale), doctors = await clinic.getDoctorContent(locale), items = (await articles.getArticles(locale)).articles
      for (const [name, list] of [['procedures',procs],['doctors',doctors],['articles',items]]) {
        assert.ok(list.some(item => item.pageSeo?.backlinks?.length === 2), name)
        assert.ok(list.every(item => !item.pageSeo?.backlinks?.some(link => link.url.includes('draft.example'))))
      }
    }
    dataset[0].seo.backlinks = [{ ...raw[0], url: 'https://published-change.example.org/new' }]
    assert.equal((await site.getSeoContext('en', 'home')).seo.backlinks[0].url, 'https://published-change.example.org/new')
    dataset[0].seo.backlinks = []
    assert.deepEqual((await site.getSeoContext('en', 'home')).seo.backlinks, [])
    assert.ok(calls.every(options => options.cache === 'force-cache' && options.next.revalidate === 60 && options.next.tags.length > 0))
  } finally { console.error = original }
})
