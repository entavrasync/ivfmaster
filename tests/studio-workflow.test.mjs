import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire, registerHooks } from 'node:module'
import test from 'node:test'
import { createSchema, defaultTemplatesForSchema, getTemplatePermissions } from 'sanity'
import { createStructureBuilder } from 'sanity/structure'
import initialContent from '../sanity/reference/initial-content.json' with { type: 'json' }
import { mergeSiteMessages, resolveSiteChrome, resolveHomePageFaq, resolveSiteImage, mergeAboutPage } from '../sanity/lib/site-content-mapping.ts'
import { homePageQuery } from '../sanity/reference/queries/home.ts'
import { aboutPageQuery } from '../sanity/reference/queries/about.ts'
import { teamPageQuery } from '../sanity/reference/queries/team.ts'
import { proceduresHubQuery } from '../sanity/reference/queries/procedures.ts'
import { globalsQuery } from '../sanity/reference/queries/globals.ts'
import en from '../messages/en.json' with { type: 'json' }
import mr from '../messages/mr.json' with { type: 'json' }

// Match Next's extensionless local TypeScript resolution without changing app imports.
const root = new URL('../', import.meta.url).href
const hook = registerHooks({
  resolve(specifier, context, nextResolve) {
    try { return nextResolve(specifier, context) }
    catch (error) {
      if (!specifier.startsWith('.') || !context.parentURL?.startsWith(root) || context.parentURL.includes('/node_modules/')) throw error
      for (const suffix of ['.ts', '/index.ts']) {
        const url = new URL(specifier + suffix, context.parentURL)
        if (existsSync(url)) return nextResolve(url.href, context)
      }
      throw error
    }
  },
})
const { default: config, procedureWebsiteValues, missingWebsiteFields } = await import('../sanity.config.ts')
hook.deregister()
const schema = createSchema({ name: 'studio-workflow', types: config.schema.types })
const defaults = defaultTemplatesForSchema(schema)
const templates = config.schema.templates?.(defaults, { schema }) ?? defaults
const require = createRequire(import.meta.url)
const { firstValueFrom, of } = createRequire(require.resolve('sanity'))('rxjs')
const groq = createRequire(require.resolve('sanity'))('groq-js')

test('the actual Studio template pipeline initializes a pending-review canonical singleton', async (t) => {
  // Studio's initial-value scheduler uses a browser host even for synchronous values.
  const previousWindow = globalThis.window
  globalThis.window = {}
  t.after(() => { if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow })
  assert.equal(templates.find((template) => template.id === 'clinicSettings')?.schemaType, 'clinicSettings')
  assert.equal(config.projectId, '4k9zwr7s')
  assert.equal(config.dataset, 'production')
  assert.equal(config.basePath, '/ivfmaster-studio')
  let checkedDocument
  const options = {
    schema, templates,
    templateItems: [{ id: 'settings', type: 'initialValueTemplateItem', templateId: 'clinicSettings', initialDocumentId: 'clinicSettings' }],
    context: { projectId: config.projectId, dataset: config.dataset, schema, currentUser: null },
    // Only the remote authorization boundary is mocked; no document is written.
    grantsStore: { checkDocumentPermission(permission, document) {
      assert.equal(permission, 'create')
      checkedDocument = document
      return of({ granted: true })
    } },
  }
  const [result] = await firstValueFrom(getTemplatePermissions(options))
  assert.equal(result.resolvedInitialValue.reviewStatus, 'pendingReview')
  assert.equal(checkedDocument._id, 'drafts.clinicSettings')
  assert.equal(checkedDocument._type, 'clinicSettings')
  await assert.rejects(firstValueFrom(getTemplatePermissions({ ...options, templates: templates.filter((template) => template.id !== 'clinicSettings') })), /template not found/)
})

test('creation menus exclude arbitrary clinic settings documents while retaining ordinary types', () => {
  const options = templates.map((template) => ({ id: template.id, templateId: template.id }))
  const result = config.document.newDocumentOptions?.(options, { creationContext: { type: 'global' } }) ?? options
  assert.equal(result.some((option) => option.templateId === 'clinicSettings'), false)
  assert.equal(result.some((option) => option.templateId === 'procedure'), true)
})

test('singleton destructive actions remain excluded without changing publishing actions', () => {
  const actions = ['publish', 'unpublish', 'duplicate', 'delete'].map((action) => ({ action }))
  // Singletons also gain the non-destructive fill-from-website action.
  assert.deepEqual(config.document.actions(actions, { schemaType: 'clinicSettings' }).map((item) => item.action ?? item.name), ['publish', 'unpublish', 'FillFromWebsiteAction'])
  const procedureActions = config.document.actions(actions, { schemaType: 'procedure' })
  assert.deepEqual(procedureActions.slice(0, actions.length), actions)
  assert.equal(procedureActions.at(-1).name, 'FillFromWebsiteAction')
  assert.deepEqual(config.document.actions(actions, { schemaType: 'doctor' }), actions)
})

test('each existing procedure resolves its own complete body for editor fill without granting approval', () => {
  for (const entry of initialContent.procedures) {
    const current = { _id: 'drafts.existing-id', slug: { current: entry.slug }, reviewStatus: 'pendingReview' }
    const values = procedureWebsiteValues(current)
    const patch = missingWebsiteFields(current, values)
    for (const field of ['name', 'fullName', 'oneLiner', 'heroDescription', 'quickFacts', 'whoItsFor', 'process', 'whatToExpect', 'faqs']) assert.deepEqual(patch[field], entry.value[field], `${entry.slug}/${field}`)
    assert.equal(patch.slug, undefined)
    assert.equal(patch.reviewStatus, undefined)
    assert.equal(patch._id, undefined)
    assert.deepEqual(missingWebsiteFields({ ...values, ...current }, values), {})
  }
  assert.equal(procedureWebsiteValues({}), undefined)
  assert.equal(procedureWebsiteValues({ slug: { current: 'unsupported-route' } }), undefined)
})

test('editor fill preserves saved copy, blanks, nulls, arrays, keys and identity while filling missing localized fields', () => {
  const values = procedureWebsiteValues({ slug: { current: 'ivf' } })
  const current = { _id: 'existing-id', _rev: 'existing-revision', slug: { current: 'ivf' }, reviewStatus: 'approved',
    name: { en: 'My saved title', mr: '' }, fullName: null, oneLiner: '', quickFacts: [],
    process: [{ _key: 'existing-key', title: { en: 'My saved step' } }], heroDescription: { mr: 'Existing translation' },
  }
  const before = structuredClone(current), patch = missingWebsiteFields(current, values)
  assert.deepEqual(current, before)
  for (const field of ['name', 'name.en', 'name.mr', 'fullName', 'oneLiner', 'quickFacts', 'process', 'slug', '_id', '_rev', 'reviewStatus']) assert.equal(patch[field], undefined, field)
  assert.equal(patch['heroDescription.en'], values.heroDescription.en)
  assert.deepEqual(patch.faqs, values.faqs)
})

test('the real Studio structure exposes all four procedures with matching stored-record filters and creation templates', async () => {
  const source = { schema, templates, projectId: config.projectId, dataset: config.dataset, name: config.name, currentUser: null,
    i18n: { t: (key) => key },
    document: { resolveNewDocumentOptions: ({ schemaType }) => templates.filter((template) => template.schemaType === schemaType).map((template) => ({ id: template.id, templateId: template.id })) },
  }
  const S = createStructureBuilder({ source, perspectiveStack: ['drafts'] })
  const root = config.plugins[0].tools[0].options.structure(S, {})
  const procedures = root.getItems().find((item) => item.getId?.() === 'procedure').getChild()
  const items = procedures.getItems()
  assert.equal(items[0].getId(), 'all-procedures')
  assert.deepEqual(items.slice(1).map((item) => item.getId()), initialContent.procedures.map((entry) => entry.slug))
  for (const entry of initialContent.procedures) {
    const child = items.find((item) => item.getId() === entry.slug).getChild().serialize()
    assert.equal(child.options.params.slug, entry.slug)
    assert.equal(child.initialValueTemplates[0].templateId, `procedure-${entry.slug}`)
    const dataset = [
      { _id: 'existing-record', _type: 'procedure', slug: { current: entry.slug } },
      { _id: 'drafts.existing-record', _type: 'procedure', slug: { current: entry.slug } },
      { _id: 'unrelated-record', _type: 'procedure', slug: { current: 'different-route' } },
    ]
    const records = await (await groq.evaluate(groq.parse(`*[${child.options.filter}]`), { dataset, params: child.options.params })).get()
    assert.deepEqual(records.map((doc) => doc._id), ['existing-record', 'drafts.existing-record'])
  }
})

test('all reference page models are registered without replacing established target contracts', () => {
  assert.deepEqual(schema._validation, [])
  assert.equal(config.schema.types.filter((type) => type.type === 'document').length, 18)
  for (const type of Object.keys(initialContent.singletons)) {
    const definition = config.schema.types.find((entry) => entry.name === type)
    const value = definition.initialValue()
    assert.equal(value.reviewStatus, 'pendingReview')
    assert.equal(value._id, undefined)
    assert(!JSON.stringify(value).includes('_sanityAsset'))
    assert(!JSON.stringify(value).includes('"_ref"'))
  }
  for (const [type, entries] of [['procedure', initialContent.procedures], ['doctor', initialContent.doctors], ['article', initialContent.articles]]) {
    for (const entry of entries) {
      const template = templates.find((item) => item.id === `${type}-${entry.slug}`)
      assert.equal(template.value().slug.current, entry.slug)
      assert.equal(template.value().reviewStatus, 'pendingReview')
      assert.equal(template.value()._id, undefined)
    }
  }
})

async function projected(locale, approved = true) {
  const dataset = Object.entries(initialContent.singletons).map(([type, value]) => ({ ...structuredClone(value), _id: type, _type: type, reviewStatus: approved ? 'approved' : 'pendingReview' }))
  // Deliberately include competing draft/release families. Published readers must ignore them.
  dataset.push(...dataset.map((doc) => ({ ...doc, _id: `drafts.${doc._id}` })), ...dataset.map((doc) => ({ ...doc, _id: `versions.test.${doc._id}` })))
  const query = async (value) => (await groq.evaluate(groq.parse(value), { dataset, params: { locale } })).get()
  const [home, about, team, procedures, globals] = await Promise.all([homePageQuery, aboutPageQuery, teamPageQuery, proceduresHubQuery, globalsQuery].map(query))
  return { home, about, team: team.page, procedures: procedures.page, globals }
}

test('actual reference projections preserve target source copy and per-language fallback', async () => {
  for (const [locale, original] of [['en', en], ['mr', mr]]) {
    const source = await projected(locale)
    assert.equal(source.home.hero.headline, original.Hero.headline)
    assert.equal(source.home.meetTheDoctors.doctors.length, 2)
    assert.deepEqual(mergeSiteMessages(original, source, locale), original)
    assert.equal(resolveHomePageFaq(source.home).faqs.length, 7)
    assert.equal(source.about.hero.title, initialContent.singletons.aboutPage.hero.title.en)
    const chrome = resolveSiteChrome(source.globals, source.home, source)
    assert(chrome.navigation.length > 0)
    assert.equal(chrome.footer.length, 2)
    assert.equal(chrome.actions['nav.primary'], '/contact')
    const pending = await projected(locale, false)
    assert.deepEqual(mergeSiteMessages(original, pending, locale), original)
    assert.equal(pending.home, null)
    assert.equal(resolveSiteChrome(pending.globals).navigation, null)
  }
})

test('malformed menu, rich copy, shared FAQ and foreign image data preserve safe fallbacks', async () => {
  const source = await projected('en')
  source.home.hero.headline = '<script>bad</script>'
  assert.equal(mergeSiteMessages(en, source, 'en').Hero.headline, en.Hero.headline)
  source.globals.navigation.items[0].link.internalPath = '/en/missing'
  assert.equal(resolveSiteChrome(source.globals).navigation, null)
  source.home.mythsFacts.referencedItems = [{ _id: 'drafts.question', question: 'hidden', answer: 'hidden' }]
  assert.equal(resolveHomePageFaq(source.home), null)
  assert.equal(resolveSiteImage({ assetId: 'image-abc-100x100-jpg', url: 'https://cdn.sanity.io/images/kj9188w7/production/abc-100x100.jpg', dimensions: { width: 100, height: 100 }, alt: 'Foreign image' }), null)
})

test('Studio hero fields require a native asset before publishing', () => {
  const hero = schema.get('homePage').fields.find((field) => field.name === 'hero').type
  for (const name of ['desktopImage', 'mobileImage']) {
    const field = hero.fields.find((entry) => entry.name === name).type
    assert.equal(field.options.hotspot, true)
    const rules = field.validation.flatMap((rule) => rule._rules)
    assert(rules.some((rule) => rule.flag === 'presence' && rule.constraint === 'required'))
    assert(rules.some((rule) => rule.flag === 'assetRequired'))
  }
})

test('actual published GROQ resolves both hero assets, crops, locale alt and replacements', async () => {
  const asset = (name) => ({ _id: `image-${name}-2400x1350-png`, _type: 'sanity.imageAsset', url: `https://cdn.sanity.io/images/4k9zwr7s/production/${name}-2400x1350.png`, metadata: { dimensions: { width: 2400, height: 1350 } } })
  const image = (name) => ({ _type: 'image', asset: { _type: 'reference', _ref: asset(name)._id }, alt: { en: `${name} banner`, mr: `${name} मराठी` }, crop: { left: 0.1, right: 0, top: 0, bottom: 0 }, hotspot: { x: 0.7, y: 0.5, width: 0.2, height: 0.4 } })
  const doc = { _id: 'homePage', _type: 'homePage', reviewStatus: 'approved', hero: { desktopImage: image('desktop'), mobileImage: image('mobile') } }
  const dataset = [doc, asset('desktop'), asset('mobile'), asset('replacement'), { ...doc, _id: 'drafts.homePage', hero: { desktopImage: image('replacement') } }]
  const query = async (locale) => (await groq.evaluate(groq.parse(homePageQuery), { dataset, params: { locale } })).get()
  for (const locale of ['en', 'mr']) {
    const projected = await query(locale)
    const banner = resolveSiteChrome(null, projected).hero
    assert.match(banner.desktop.image.src, /\/desktop-2400x1350.png\?/)
    assert.match(banner.mobile.image.src, /\/mobile-2400x1350.png\?/)
    assert.equal(banner.desktop.image.width, 2160)
    assert.equal(banner.desktop.alt, locale === 'mr' ? 'desktop मराठी' : 'desktop banner')
    assert(banner.desktop.position)
    assert(!JSON.stringify(banner).includes('replacement'))
  }
  doc.hero.desktopImage = image('replacement')
  assert.match(resolveSiteChrome(null, await query('en')).hero.desktop.image.src, /replacement-2400x1350/)
  doc.reviewStatus = 'pendingReview'
  assert.equal(await query('en'), null)
  assert.equal(resolveSiteChrome(null, null).hero, undefined)
})

test('CMS blanks, headline numbers and variable-length Home credentials beat code defaults', () => {
  const source = { home: { hero: { body: '' }, meetTheDoctors: { doctors: [{ slug: 'gorakh-mandrupkar', intro: 'CMS introduction', credentials: Array.from({ length: 6 }, (_, i) => ({ text: `CMS credential ${i}`, accent: i === 5 })) }] } }, globals: { settings: { stats: Array.from({ length: 4 }, (_, i) => ({ value: i, suffix: '+', label: `CMS stat ${i}` })) } } }
  const messages = mergeSiteMessages(en, source, 'en')
  assert.equal(messages.Hero.body, '')
  const chrome = resolveSiteChrome(source.globals, source.home)
  assert.equal(chrome.stats[2].value, 2)
  assert.equal(chrome.homeDoctors['gorakh-mandrupkar'].credentials.length, 6)
  assert.equal(mergeAboutPage({ name: 'Old name', role: 'Old role', title: 'Old title' }, { name: 'CMS name', role: 'CMS role', title: '' }).title, '')
  assert.equal(mergeAboutPage({ name: 'Old name' }, { name: 'CMS name' }).name, 'CMS name')
})

test('the actual Hero renderer uses CMS URLs and never emits local banner assets', async (t) => {
  // Compile TSX at Node's existing bundler boundary; render the real components.
  const ts = require('typescript')
  const appRoot = new URL('../', import.meta.url)
  const jsx = registerHooks({
    resolve(specifier, context, nextResolve) {
      if (/^next\/(image|navigation|link|headers|server)$/.test(specifier)) return nextResolve(specifier + '.js', context)
      if (context.parentURL?.startsWith(appRoot.href) && !context.parentURL.includes('/node_modules/') && (specifier.startsWith('@/') || specifier.startsWith('.'))) {
        for (const suffix of ['', '.ts', '.tsx', '/index.ts', '/index.tsx']) {
          const url = specifier.startsWith('@/') ? new URL(specifier.slice(2) + suffix, appRoot) : new URL(specifier + suffix, context.parentURL)
          if (/\.(tsx?|m?js)$/.test(url.pathname) && existsSync(url)) return { url: url.href, shortCircuit: true }
        }
      }
      try { return nextResolve(specifier, context) }
      catch (error) {
        if (!context.parentURL?.startsWith(appRoot.href) || context.parentURL.includes('/node_modules/')) throw error
        for (const suffix of ['.tsx', '/index.tsx']) {
          const url = specifier.startsWith('@/') ? new URL(specifier.slice(2) + suffix, appRoot) : specifier.startsWith('.') ? new URL(specifier + suffix, context.parentURL) : null
          if (url && existsSync(url)) return nextResolve(url.href, context)
        }
        throw error
      }
    },
    load(url, context, nextLoad) {
      if (url.startsWith(appRoot.href) && url.endsWith('.tsx')) return { format: 'commonjs', shortCircuit: true, source: ts.transpileModule(readFileSync(new URL(url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText }
      return nextLoad(url, context)
    },
  })
  t.after(() => jsx.deregister())
  const { createElement } = require('react')
  const { renderToStaticMarkup } = require('react-dom/server')
  const { NextIntlClientProvider } = require('next-intl')
  const { SiteContentProvider } = require('../components/providers/SiteContentContext.tsx')
  const { Hero } = require('../components/sections/Hero.tsx')
  const { ImageConfigContext } = require('next/dist/shared/lib/image-config-context.shared-runtime.js')
  const { imageConfigDefault } = require('next/dist/shared/lib/image-config.js')
  const { default: nextConfig } = await import('../next.config.mjs')
  const img = (name) => resolveSiteImage({ assetId: `image-${name}-2400x1350-png`, url: `https://cdn.sanity.io/images/4k9zwr7s/production/${name}-2400x1350.png`, dimensions: { width: 2400, height: 1350 }, alt: name })
  const render = (hero) => renderToStaticMarkup(createElement(ImageConfigContext.Provider, { value: { ...imageConfigDefault, ...nextConfig.images } }, createElement(NextIntlClientProvider, { locale: 'en', timeZone: 'Asia/Kolkata', messages: en }, createElement(SiteContentProvider, { content: { navigation: null, footer: null, hero } }, createElement(Hero)))))
  const html = render({ desktop: img('desktop'), mobile: img('mobile') })
  assert.match(html, /cdn.sanity.io\/images\/4k9zwr7s\/production\/desktop-/)
  assert.match(html, /cdn.sanity.io\/images\/4k9zwr7s\/production\/mobile-/)
  assert(!html.includes('hero-bg-'))
  const missing = render(undefined)
  assert(!missing.includes('hero-bg-'))
  assert(!missing.includes('<img'))
  assert.match(missing, /100svh/)
})
