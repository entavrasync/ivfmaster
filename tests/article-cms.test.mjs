import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import ts from 'typescript'
import { createSchema, validateDocument } from 'sanity'
import { articleModels, articleSlugs } from '../sanity/article-model.ts'
import { articleBodySchema, articleDocument, localizeArticleBody, mergeArticleMessages, resolveArticles } from '../sanity/lib/article-mapping.ts'
import { articlesQuery } from '../sanity/lib/article-query.ts'
import { article } from '../sanity/schemaTypes/article.ts'
import { localizedString, localizedText } from '../sanity/schemaTypes/procedure.ts'
// SEO social text and image alt use the shared Studio localized types, registered alongside in the real Studio.
import { localizedString as sharedLocalizedString } from '../sanity/reference/schemaTypes/locale/localizedString.ts'
import { localizedText as sharedLocalizedText } from '../sanity/reference/schemaTypes/locale/localizedText.ts'

const require = createRequire(import.meta.url)
const { parse, evaluate } = require(require.resolve('groq-js', { paths: [require.resolve('sanity')] }))
const en = JSON.parse(readFileSync(new URL('../messages/en.json', import.meta.url), 'utf8'))
const mr = JSON.parse(readFileSync(new URL('../messages/mr.json', import.meta.url), 'utf8'))
// Execute the real data module, stubbing only image imports unsupported by Node's test loader.
const exports = {}
new Function('exports', 'require', ts.transpileModule(readFileSync(new URL('../lib/articles.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText)(exports, (path) => ({ src: path, width: 1200, height: 800 }))
const fallback = exports.ARTICLES

const keyed = (value) => {
  if (Array.isArray(value)) return value.map((v, i) => typeof v === 'object' ? { _key: `key-${i}`, ...keyed(v) } : v)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, k === 'rows' ? v.map((cells, i) => ({ _key: `row-${i}`, cells })) : keyed(v)]))
  return value
}
function namespace(messages, slug) {
  const model = articleModels[slug]
  return model.namespace === 'EducateIVF' ? messages.EducateIVF.articles[slug] : messages[model.namespace]
}
function body(contract, english, marathi) {
  return Object.fromEntries(Object.entries(contract).map(([name, field]) => [name, typeof field === 'string'
    ? { en: keyed(english[name]), ...(marathi?.[name] != null ? { mr: keyed(marathi[name]) } : {}) }
    : body(field, english[name], marathi?.[name])]))
}
function document(slug = 'what-ivf-really-is', translated = true) {
  const original = fallback.find((a) => a.slug === slug), model = articleModels[slug]
  const listing = en.EducateIVF.articles[slug], translatedListing = mr.EducateIVF.articles[slug]
  return { _id: `fixture-${slug}`, _type: 'article', reviewStatus: 'approved', slug,
    title: { en: listing.title, ...(translated ? { mr: translatedListing.title } : {}) },
    excerpt: { en: listing.excerpt, ...(translated ? { mr: translatedListing.excerpt } : {}) },
    category: original.category, date: original.date, readTime: original.readTime,
    [model.field]: body(model.contract, namespace(en, slug), translated ? namespace(mr, slug) : undefined),
  }
}

function newDocument() {
  return { _id: 'local-fixture-only', _type: 'article', reviewStatus: 'approved', slug: 'preparing-for-your-first-visit',
    title: { en: 'Preparing for your first visit', mr: 'पहिल्या भेटीची तयारी' }, excerpt: { en: 'A clinic-reviewed introduction.' },
    category: 'Understanding IVF', date: '2026-10-22', readTime: 4,
    content: { intro: { en: 'CMS opening paragraph.' }, sections: { en: [{ _key: 'prepare', heading: 'Before your visit', body: 'CMS section text.\n\nAnother paragraph.' }] }, keyTakeaways: { en: ['Bring your records.'] } },
  }
}

test('a new approved article survives the real query and localized reader without a built-in slug or body', async () => {
  const doc = newDocument()
  const stored = { ...doc, slug: { current: doc.slug } }
  const data = await (await evaluate(parse(articlesQuery), { dataset: [stored, { ...stored, _id: 'drafts.hidden' }, { ...stored, _id: 'pending', reviewStatus: 'pendingReview' }] })).get()
  assert.equal(data.length, 1)
  for (const locale of ['en', 'mr']) {
    const result = resolveArticles(data, fallback, locale)
    assert.equal(result.status, 'sanity')
    assert.equal(result.articles.length, 8)
    const added = result.articles.find((item) => item.slug === doc.slug)
    assert.equal(added.title, doc.title[locale])
    assert.equal(added.intro, doc.content.intro.en)
    assert.equal(added.sections[0].body, doc.content.sections.en[0].body)
    assert.deepEqual(added.keyTakeaways, doc.content.keyTakeaways.en)
    assert.equal(added.i18nKey, undefined)
    assert.equal(added.coverImage, undefined)
    assert.deepEqual(result.articles.slice(0, 7), fallback)
  }
  doc.content.sections.mr = [{ _key: 'translated', heading: 'भेटीपूर्वी', body: 'सर्व अहवाल सोबत आणा.' }]
  assert.equal(resolveArticles([doc], fallback, 'mr').articles.at(-1).sections[0].body, doc.content.sections.mr[0].body)
  for (const invalid of [{ ...doc, content: undefined }, { ...doc, reviewStatus: 'pendingReview' }, { ...doc, slug: 'understanding-pcos' }]) assert.equal(resolveArticles([invalid], fallback, 'en').articles, fallback)
})

test('all seven real source articles map to their actual English and Marathi renderer contracts', () => {
  assert.equal(fallback.length, 7)
  assert.deepEqual(new Set(fallback.map((a) => a.slug)), new Set(articleSlugs))
  for (const locale of ['en', 'mr']) {
    const result = resolveArticles(articleSlugs.map((s) => document(s)), fallback, locale)
    assert.equal(result.status, 'sanity')
    const messages = mergeArticleMessages(locale === 'mr' ? mr : en, result.overrides)
    for (const slug of articleSlugs) {
      const model = articleModels[slug], reference = namespace(locale === 'mr' ? mr : en, slug)
      for (const key of Object.keys(model.contract)) assert.deepEqual(namespace(messages, slug)[key], reference[key], `${locale}/${slug}/${key}`)
    }
  }
})

test('localized lists retain different counts, and absent Marathi falls back without index alignment', () => {
  const translated = document(), fallbackEnglish = document('what-ivf-really-is', false)
  const model = articleModels['what-ivf-really-is']
  const translatedBody = localizeArticleBody(model.contract, articleBodySchema(model.contract).parse(translated.ivfGuide), 'mr')
  assert.equal(translatedBody.phases[2].items.length, 2)
  assert.equal(en.ArticleWhatIvf.phases[2].items.length, 3)
  fallbackEnglish.ivfGuide.intro1.mr = '   '
  const result = resolveArticles([fallbackEnglish], fallback, 'mr')
  assert.equal(result.status, 'sanity')
  assert.deepEqual(result.overrides.ArticleWhatIvf.phases, en.ArticleWhatIvf.phases)
  assert.equal(result.overrides.ArticleWhatIvf.intro1, en.ArticleWhatIvf.intro1)
})

test('age tables, definition lists, PCOS callout and myth/fact pairs retain their original data shapes', () => {
  const result = resolveArticles(articleSlugs.map((s) => document(s)), fallback, 'en')
  assert.deepEqual(result.overrides.ArticleAge.sections[2].table, en.ArticleAge.sections[2].table)
  assert.deepEqual(result.overrides.ArticleWhatIvf.phases[0].items, en.ArticleWhatIvf.phases[0].items)
  assert.equal(result.overrides.ArticlePcos.mantra, en.ArticlePcos.mantra)
  assert.deepEqual(result.overrides.ArticleMyths.items, en.ArticleMyths.items)
})

test('missing, invalid, unapproved, duplicate or unsupported documents preserve the entire static collection', () => {
  assert.equal(resolveArticles([], fallback, 'en').articles, fallback)
  const invalid = document(); delete invalid.ivfGuide.phases
  const table = document('age-and-ivf-success'); table.age.sections.en[2].table.rows[0].cells.push('extra cell')
  for (const input of [null, [invalid], [table], [{ ...document(), reviewStatus: 'pendingReview' }], [document(), document()], [{ ...document(), slug: 'new-url' }], [{ ...document(), _id: 'drafts.example' }]]) {
    const result = resolveArticles(input, fallback, 'en')
    assert.equal(result.articles, fallback)
    assert.deepEqual(result.overrides, {})
  }
})

test('partial CMS coverage preserves routes and aliases while a cleared cover stays cleared', () => {
  const doc = document('pcos')
  const result = resolveArticles([doc], fallback, 'mr')
  assert.equal(result.status, 'sanity')
  assert.equal(result.articles[0], fallback[0])
  const pcos = result.articles.find((a) => a.slug === 'pcos')
  assert.deepEqual(pcos.legacySlugs, ['understanding-pcos'])
  assert.equal(pcos.coverImage, undefined)
  assert.deepEqual(pcos.relatedSlugs, fallback.find((a) => a.slug === 'pcos').relatedSlugs)
  assert.equal(pcos.seo, undefined)
})

test('related references resolve in order; self, broken, duplicate and unapproved relationships fail closed', () => {
  const doc = document('pcos')
  doc.related = [{ _key: 'first', slug: 'male-fertility', reviewStatus: 'approved' }]
  assert.deepEqual(resolveArticles([doc], fallback, 'en').articles.find((a) => a.slug === 'pcos').relatedSlugs, ['male-fertility'])
  for (const related of [[{ _key: 'x', slug: 'pcos', reviewStatus: 'approved' }], [null], [doc.related[0], doc.related[0]], [{ ...doc.related[0], reviewStatus: 'pendingReview' }]]) {
    assert.equal(resolveArticles([{ ...doc, related }], fallback, 'en').articles, fallback)
  }
})

test('SEO overrides localize without changing the canonical slug; system copy remains untouched', () => {
  const doc = document('pcos'); doc.seo = { metaTitle: { en: en.ArticlePcos.metaTitle }, metaDescription: { en: en.ArticlePcos.metaDescription } }
  const result = resolveArticles([doc], fallback, 'mr')
  assert.equal(result.articles.find((a) => a.slug === 'pcos').pageSeo.title, en.ArticlePcos.metaTitle)
  const merged = mergeArticleMessages(mr, result.overrides)
  assert.equal(merged.EducateIVF.backLink, mr.EducateIVF.backLink)
  assert.equal(merged.Footer, mr.Footer)
  assert.equal(merged.ArticlePcos.category, mr.ArticlePcos.category)
})

test('invalid translated copy, ICU variables and changed category cannot break existing renderer expectations', () => {
  for (const value of ['Hello {unapprovedVariable}', '<script>unsafe</script>', 42]) {
    const doc = document('pcos'); doc.pcos.intro.mr = value
    assert.equal(resolveArticles([doc], fallback, 'mr').status, 'invalid', String(value))
  }
  assert.equal(resolveArticles([{ ...document('pcos'), category: 'Myths' }], fallback, 'en').articles, fallback)
})

test('native article cover mapping preserves crop, focus, dimensions, blur and localized alt', () => {
  const doc = document('pcos')
  doc.coverImage = { alt: { en: 'Existing cover' }, crop: { left: 0.1, right: 0.1, top: 0, bottom: 0 }, hotspot: { x: 0.7, y: 0.4, width: 0.2, height: 0.2 }, asset: {
    _id: 'image-testasset-1200x800-jpg', url: 'https://cdn.sanity.io/images/4k9zwr7s/production/testasset-1200x800.jpg', metadata: { dimensions: { width: 1200, height: 800 }, lqip: 'data:image/jpeg;base64,AAAA' },
  } }
  const article = resolveArticles([doc], fallback, 'mr').articles.find((a) => a.slug === 'pcos')
  assert.equal(article.coverImage.width, 960)
  assert.equal(article.coverImage.height, 800)
  assert.match(article.coverImage.src, /^https:\/\/cdn.sanity.io\/images\/4k9zwr7s\/production\//)
  assert.match(article.coverImage.src, /rect=/)
  assert.equal(article.coverImage.blurDataURL, doc.coverImage.asset.metadata.lqip)
  const [x, y] = article.coverPosition.split(' ').map(parseFloat)
  assert.ok(Math.abs(x - 75) < 0.00001)
  assert.equal(y, 40)
  assert.equal(article.coverImageAlt, 'Existing cover')
  delete doc.coverImage.asset.metadata.lqip
  const withoutBlur = resolveArticles([doc], fallback, 'en')
  assert.equal(withoutBlur.status, 'sanity')
  assert.ok(withoutBlur.articles.find(a => a.slug === 'pcos').coverImage)
})

test('actual GROQ excludes drafts/releases/unapproved records and dereferences related articles', async () => {
  const docs = [document('pcos'), document('male-fertility')].map((d) => ({ ...d, slug: { current: d.slug } }))
  docs[0].related = [{ _key: 'relation', _type: 'reference', _ref: docs[1]._id }]
  const dataset = [...docs, { ...docs[0], _id: 'drafts.hidden' }, { ...docs[0], _id: 'versions.release.hidden' }, { ...docs[0], _id: 'unapproved', reviewStatus: 'pendingReview' }]
  const data = await (await evaluate(parse(articlesQuery), { dataset, params: { slugs: articleSlugs } })).get()
  assert.equal(data.length, 2)
  assert.deepEqual(data.find((doc) => doc.slug === 'pcos').related, [{ _key: 'relation', slug: 'male-fertility', reviewStatus: 'approved' }])
  assert.equal(resolveArticles(data, fallback, 'mr').status, 'sanity')
  docs[1].reviewStatus = 'pendingReview'
  const broken = await (await evaluate(parse(articlesQuery), { dataset: docs, params: { slugs: articleSlugs } })).get()
  assert.equal(resolveArticles(broken, fallback, 'en').status, 'invalid')
})

const schema = createSchema({ name: 'article-test', types: [localizedString, localizedText, sharedLocalizedString, sharedLocalizedText, article] })
test('article schema compiles with native references and all existing body variants', () => assert.deepEqual(schema._validation, []))

test('new articles can publish with an independent optional SEO override while native slug uniqueness stays strict', async () => {
  const doc = newDocument(); doc._id = 'drafts.local-new-article'; doc.slug = { current: doc.slug }
  doc.content.sections.en.forEach(section => { section._type = 'object' })
  let unique = true
  const client = { withConfig() { return this }, fetch: async query => query.trim().startsWith('!defined') ? unique : null }
  const validate = () => validateDocument({ document: doc, workspace: { schema }, getClient: () => client, getDocumentExists: async () => true })
  doc.seo = { focusKeyword: 'local fixture' }
  assert.deepEqual(await validate(), [])
  doc.seo = { metaTitle: { en: 'Local SEO title' } }
  assert.deepEqual(await validate(), [])
  doc.seo = { metaDescription: { en: 'Local SEO description' } }
  assert.deepEqual(await validate(), [])
  unique = false
  assert((await validate()).some(marker => marker.level === 'error' && marker.path[0] === 'slug'))
  unique = true; delete doc.title
  assert((await validate()).some(marker => marker.level === 'error' && marker.path[0] === 'title'))
  doc.title = { en: 'Local article fixture' }
  doc.related = [{ _type: 'reference', _key: 'self', _ref: 'local-new-article' }]
  const selfReference = (await validate()).find(marker => marker.message.includes('cannot list itself'))
  assert.deepEqual(selfReference.path, ['related', { _key: 'self' }])
})

test('new article content errors point to the English input and stable section key', () => {
  const rule = schema.get('article').validation.flatMap((item) => item._rules).find((item) => item.flag === 'custom').constraint
  const doc = newDocument(); doc.slug = { current: doc.slug }
  assert.equal(rule(doc), true)
  delete doc.content.intro.en
  delete doc.content.sections.en[0].body
  const errors = rule(doc)
  assert(errors.some((error) => JSON.stringify(error.path) === JSON.stringify(['content', 'intro', 'en'])))
  assert(errors.some((error) => JSON.stringify(error.path) === JSON.stringify(['content', 'sections', 'en', { _key: 'prepare' }, 'body'])))
  assert(errors.every((error) => typeof error.message === 'string' && error.message.length > 15))
})

test('actual Studio rules keep approval, body, address format, redirects and published-address safeguards', async () => {
  const compiled = schema.get('article')
  const approval = compiled.fields.find((f) => f.name === 'reviewStatus').type.validation.flatMap((r) => r._rules).find((r) => r.flag === 'custom').constraint
  assert.notEqual(await approval('pendingReview', {}), true)
  assert.equal(await approval('approved', {}), true)
  const bodyRule = compiled.validation.flatMap((r) => r._rules).find((r) => r.flag === 'custom').constraint
  const doc = document('pcos'); doc.slug = { current: doc.slug }
  assert.equal(bodyRule(doc), true)
  assert.notEqual(bodyRule({ ...doc, pcos: undefined }), true)
  const slugRule = compiled.fields.find((f) => f.name === 'slug').type.validation.flatMap((r) => r._rules).filter((r) => r.flag === 'custom').at(-1).constraint
  assert.equal(await slugRule({ current: 'new-url' }, {}), true)
  for (const current of ['Not a URL', 'understanding-pcos', 'male-fertility-explained', 'x'.repeat(97)]) assert.notEqual(await slugRule({ current }, {}), true)
  const context = { document: { _id: 'drafts.fixture' }, getClient: () => ({ withConfig: () => ({ fetch: async () => 'pcos' }) }) }
  assert.notEqual(await slugRule({ current: 'male-fertility' }, context), true)
  context.getClient = () => ({ withConfig: () => ({ fetch: async () => { throw new Error('access denied') } }) })
  assert.notEqual(await slugRule({ current: 'pcos' }, context), true)
})

test('Studio listing and SEO copy reject the same unsupported message syntax as the published reader', async () => {
  const compiled = schema.get('article')
  for (const path of [['title'], ['excerpt'], ['seo', 'metaTitle'], ['seo', 'metaDescription']]) {
    const field = path.reduce((type, name) => type.fields.find((entry) => entry.name === name).type, compiled)
    const doc = document('pcos')
    const context = { type: field, schema, document: { ...doc, slug: { current: 'pcos' } }, path, i18n: { t: (key) => key } }
    for (const en of ['Unsupported {variable}', '<b>Unsupported markup</b>']) {
      const copy = { en }
      const invalid = structuredClone(doc)
      if (path.length === 1) invalid[path[0]] = copy
      else invalid.seo = { metaTitle: { en: 'Existing title' }, metaDescription: { en: 'Existing description' }, [path[1]]: copy }
      assert.equal(articleDocument.safeParse(invalid).success, false)
      const markers = (await Promise.all(field.validation.map((rule) => rule.validate(copy, context)))).flat()
      assert(markers.length > 0, `${path.join('.')} must show an editor error before publishing copy that the website rejects`)
    }
    const valid = { en: 'Existing plain copy', mr: ' ' }
    assert.deepEqual((await Promise.all(field.validation.map((rule) => rule.validate(valid, context)))).flat(), [])
  }
})

test('optional article cover can be omitted, but a selected replacement needs an actual asset', async () => {
  const field = schema.get('article').fields.find((entry) => entry.name === 'coverImage').type
  const context = { document: { _id: 'drafts.article', _type: 'article' }, path: ['coverImage'], type: field, schema, i18n: { t: (key) => key }, getClient: () => ({ fetch: async () => ({ _id: 'image-testasset-1200x800-jpg', url: 'https://cdn.sanity.io/images/4k9zwr7s/production/testasset-1200x800.jpg', metadata: { dimensions: { width: 1200, height: 800 } } }) }) }
  const errors = async (value) => (await Promise.all((field.validation ?? []).map((rule) => rule.validate(value, context)))).flat()
  assert.deepEqual(await errors(undefined), [])
  assert.ok((await errors({ _type: 'image', alt: { en: 'Existing cover' } })).length > 0)
  assert.deepEqual(await errors({ _type: 'image', asset: { _type: 'reference', _ref: 'image-testasset-1200x800-jpg' }, alt: { en: 'Existing cover' } }), [])
})
