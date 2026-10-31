import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire, registerHooks } from 'node:module'
import test from 'node:test'
import { createSchema, defaultTemplatesForSchema, getTemplatePermissions, validateDocument } from 'sanity'
import { createStructureBuilder } from 'sanity/structure'
import initialContent from '../sanity/reference/initial-content.json' with { type: 'json' }
import { mergeSiteMessages, resolveSiteChrome, resolveHomePageFaq, resolveSiteImage, mergeAboutPage } from '../sanity/lib/site-content-mapping.ts'
import { homePageQuery } from '../sanity/reference/queries/home.ts'
import { aboutPageQuery } from '../sanity/reference/queries/about.ts'
import { teamPageQuery } from '../sanity/reference/queries/team.ts'
import { proceduresHubQuery } from '../sanity/reference/queries/procedures.ts'
import { globalsQuery } from '../sanity/reference/queries/globals.ts'
import { contactPageQuery } from '../sanity/reference/queries/contact.ts'
import { clinicSettingsQuery } from '../sanity/lib/clinic-queries.ts'
import { resolveClinicSettings } from '../sanity/lib/clinic-mapping.ts'
import { buildWhatsappMessage, buildWhatsappUrl } from '../lib/buildWhatsappMessage.ts'
import { initialTeamValues, teamValuesFromTrust, teamValuesContent, teamValuesQuery, resolveTeamValues } from '../sanity/lib/team-values-mapping.ts'
import { buildPageMetadata } from '../lib/seo/metadata.ts'
import { buildRootJsonLd } from '../lib/seo/jsonLd.ts'
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
const { default: config, procedureWebsiteValues, doctorWebsiteValues, missingWebsiteFields } = await import('../sanity.config.ts')
hook.deregister()
const schema = createSchema({ name: 'studio-workflow', types: config.schema.types })
const defaults = defaultTemplatesForSchema(schema)
const templates = config.schema.templates?.(defaults, { schema }) ?? defaults
const require = createRequire(import.meta.url)
const { firstValueFrom, of } = createRequire(require.resolve('sanity'))('rxjs')
const groq = createRequire(require.resolve('sanity'))('groq-js')

test('Cost of Waiting line popups expose independent desktop/mobile uploads and preserve existing text', async () => {
  const frame = schema.get('costOfWaitingLine')
  assert.deepEqual(schema._validation, [])
  const { PatchEvent, unset } = require('sanity')
  const removedPreview = config.schema.types.find(type => type.name === 'costOfWaitingLine').preview.prepare({ en: 'Existing line' })
  assert.equal(removedPreview.title, 'Existing line'); assert.equal(removedPreview.media, undefined)
  assert.equal(frame.fields.find(field => field.name === 'imageType').type.hidden, true)
  assert.deepEqual(frame.fields.filter(field => field.type.hidden !== true).map(field => field.name).sort(), ['desktop', 'en', 'mobile', 'mr'])
  const originalLine = initialContent.singletons.homePage.costOfWaiting.narrativeLines[0]
  const validate = async item => {
    const home = structuredClone(initialContent.singletons.homePage)
    if (item) home.costOfWaiting.narrativeLines[0] = item
    return (await validateDocument({ document: { ...home, _id: 'drafts.homePage', _type: 'homePage', reviewStatus: 'approved' }, workspace: { schema }, getClient: () => ({ fetch: async (_query, { id }) => ({ _id: id, url: `https://cdn.sanity.io/images/4k9zwr7s/production/${id.slice(6).replace(/-jpg$/, '.jpg')}`, metadata: { dimensions: { width: 1800, height: 1200 } } }) }), getDocumentExists: async () => true })).filter(marker => marker.path[0] === 'costOfWaiting' && marker.path[1] === 'narrativeLines')
  }
  const image = { _type: 'image', asset: { _type: 'reference', _ref: 'image-waiting1-1800x1200-jpg' }, alt: { _type: 'localizedString', en: 'Clinic-approved slide photo', mr: 'क्लिनिकने मान्य केलेला फोटो' } }
  const item = { ...originalLine, _type: 'costOfWaitingLine', _key: 'first-slide', desktop: image, mobile: image }
  assert.deepEqual(await validate(undefined), [])
  assert.deepEqual(await validate(item), [])
  assert.deepEqual(await validate({ ...item, desktop: undefined, mobile: undefined }), [])
  assert.deepEqual(await validate(originalLine), [])
  for (const target of ['desktop', 'mobile']) {
    const photo = frame.fields.find(field => field.name === target).type
    assert.equal(photo.options.hotspot, true); assert.equal(photo.name, 'image')
    assert.deepEqual(await validate({ ...item, [target]: undefined }), [])
    const missingAsset = await validate({ ...item, [target]: { ...image, asset: undefined } })
    assert(missingAsset.some(marker => marker.path[2]?._key === 'first-slide' && marker.path[3] === target))
    const noDescription = await validate({ ...item, [target]: { ...image, alt: undefined } })
    assert(noDescription.some(marker => marker.path[2]?._key === 'first-slide' && marker.path[3] === target && marker.path[4] === 'alt'))
    const unsupported = await validate({ ...item, [target]: { ...image, asset: { _type: 'reference', _ref: 'image-waiting1-1800x1200-svg' } } })
    assert(unsupported.some(marker => marker.path[3] === target && marker.message.includes('JPEG, PNG, WebP or AVIF')))
    let cleared
    const props = photo.components.input({ value: image, readOnly: false, onChange: event => { cleared = PatchEvent.from(event).patches }, renderDefault: input => input })
    props.onChange(unset(['asset']))
    assert.deepEqual(cleared.map(patch => ({ type: patch.type, path: patch.path })), [{ type: 'unset', path: [] }])
  }
  const cost = schema.get('homePage').fields.find(field => field.name === 'costOfWaiting').type
  assert.equal(cost.fields.find(field => field.name === 'frames').type.hidden, true)
  for (const field of ['narrativeLines', 'hopeLines']) {
    const choices = cost.fields.find(item => item.name === field).type.of
    assert(choices.some(choice => choice.name === 'costOfWaitingLine' && ['desktop', 'mobile'].every(name => choice.fields.some(input => input.name === name))))
    const legacy = choices.find(choice => choice.name === 'localizedString')
    let changes
    const view = legacy.components.input({ value: originalLine, readOnly: false, onChange: event => { changes = PatchEvent.from(event).patches }, renderDefault: () => null })
    view.props.children[1].props.onClick()
    const converted = structuredClone(originalLine)
    for (const patch of changes) if (patch.type === 'set' || patch.type === 'setIfMissing' && converted[patch.path[0]] == null) converted[patch.path[0]] = patch.value
    assert.equal(converted._type, 'costOfWaitingLine'); assert.equal(converted.imageType, originalLine.imageType)
    for (const field of ['_key', 'en', 'mr']) assert.equal(converted[field], originalLine[field])
    assert.deepEqual(await validate(converted), [])
    changes = undefined
    const locked = legacy.components.input({ value: originalLine, readOnly: true, onChange: event => { changes = PatchEvent.from(event).patches }, renderDefault: () => null })
    assert.equal(locked.props.children[1].props.disabled, true); locked.props.children[1].props.onClick(); assert.equal(changes, undefined)
  }
})

test('Cost of Waiting query, mapper and renderer preserve sparse slide positions and both viewport photos', async () => {
  const ts = require('typescript'), React = require('react'), { renderToStaticMarkup } = require('react-dom/server'), { createTranslator } = require('next-intl')
  const asset = name => ({ _id: `image-${name}-1800x1200-jpg`, _type: 'sanity.imageAsset', url: `https://cdn.sanity.io/images/4k9zwr7s/production/${name}-1800x1200.jpg`, metadata: { dimensions: { width: 1800, height: 1200 } } })
  const image = name => ({ _type: 'image', asset: { _type: 'reference', _ref: asset(name)._id }, alt: { en: `${name} slide photo`, mr: `${name} फोटो` }, hotspot: { x: 0.7, y: 0.4, width: 0.2, height: 0.2 }, crop: { top: 0.1, bottom: 0.1, left: 0.1, right: 0.1 } })
  const home = { ...structuredClone(initialContent.singletons.homePage), _id: 'homePage', _type: 'homePage', reviewStatus: 'approved' }
  Object.assign(home.costOfWaiting.narrativeLines[0], { _type: 'costOfWaitingLine', desktop: image('waiting1'), mobile: image('waiting2') })
  Object.assign(home.costOfWaiting.narrativeLines[1], { _type: 'costOfWaitingLine' })
  Object.assign(home.costOfWaiting.narrativeLines[2], { _type: 'costOfWaitingLine', mobile: image('waiting2') })
  Object.assign(home.costOfWaiting.narrativeLines[3], { _type: 'costOfWaitingLine', desktop: image('waiting1') })
  Object.assign(home.costOfWaiting.hopeLines[1], { _type: 'costOfWaitingLine', desktop: image('waiting2'), mobile: image('waiting1') })
  const evaluate = async (doc, locale) => (await groq.evaluate(groq.parse(homePageQuery), { dataset: [doc, { ...doc, _id: 'drafts.homePage' }, asset('waiting1'), asset('waiting2')], params: { locale } })).get()
  for (const [locale, messages] of [['en', en], ['mr', mr]]) {
    let source = await evaluate(home, locale), frames = resolveSiteChrome(null, source).frames
    assert.equal(frames.length, 7); assert.deepEqual(frames.slice(0, 5).map(frame => frame.key), home.costOfWaiting.narrativeLines.map(line => line._key))
    assert.equal(frames[6].key, home.costOfWaiting.hopeLines[1]._key)
    assert.equal(frames[1].desktop, null); assert.equal(frames[1].mobile, null)
    assert.equal(frames[2].desktop, null); assert(frames[2].mobile.image.src.includes('waiting2'))
    assert(frames[3].desktop); assert.equal(frames[3].mobile, null)
    assert.equal(frames[0].desktop.alt, image('waiting1').alt[locale]); assert.notEqual(frames[0].desktop.position, 'center')
    assert(frames[0].desktop.image.src.includes('waiting1')); assert(frames[0].mobile.image.src.includes('waiting2'))
    const reordered = structuredClone(home)
    ;[reordered.costOfWaiting.narrativeLines[0], reordered.costOfWaiting.narrativeLines[2]] = [reordered.costOfWaiting.narrativeLines[2], reordered.costOfWaiting.narrativeLines[0]]
    const reorderedSource = await evaluate(reordered, locale), reorderedFrames = resolveSiteChrome(null, reorderedSource).frames
    assert.equal(reorderedFrames[0].key, home.costOfWaiting.narrativeLines[2]._key); assert(reorderedFrames[0].mobile.image.src.includes('waiting2'))
    assert.equal(mergeSiteMessages(messages, { home: reorderedSource, about: null, team: null, procedures: null, globals: null }, locale).CostOfWaiting.line1, home.costOfWaiting.narrativeLines[2][locale])
    const exports = {}, wrapper = ({ children }) => React.createElement('div', null, children)
    let reduced = false
    const dependencies = {
      react: { ...React, useRef: value => ({ current: value }), useEffect() {} },
      'next-intl': { useTranslations: () => createTranslator({ locale, messages: mergeSiteMessages(messages, { home: source, about: null, team: null, procedures: null, globals: null }, locale), namespace: 'CostOfWaiting' }) },
      '@/components/providers/SiteContentContext': { useSiteContent: () => ({ frames }), useSiteAction: () => '/contact' },
      '@/hooks/useReducedMotion': { useReducedMotion: () => reduced },
      '@/components/motion/Pressable': { Pressable: wrapper },
      '@/i18n/navigation': { Link: 'a' },
      gsap: { registerPlugin() {} }, 'gsap/ScrollTrigger': { ScrollTrigger: {} }, 'motion/react': { motion: { p: ({ initial, whileInView, viewport, transition, ...props }) => React.createElement('p', props) } },
    }
    const compiled = ts.transpileModule(readFileSync(new URL('../components/sections/CostOfWaiting.tsx', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText
    new Function('require', 'exports', compiled)(id => dependencies[id] ?? require(id), exports)
    const tree = exports.CostOfWaiting(), layers = tree.props.children.flat().filter(node => node?.key != null && node.props.style?.inset === 0)
    assert.equal(layers.length, 7, 'blank slots keep their timeline layer instead of shifting later photos')
    assert.equal(layers[1].props.children, null)
    assert.equal(layers[2].props.children.props.className, 'block md:hidden')
    assert.equal(layers[3].props.children.props.className, 'hidden md:block')
    let html = renderToStaticMarkup(tree)
    assert.equal((html.match(/<img /g) ?? []).length, 4); assert(html.includes('waiting1-1800x1200')); assert(html.includes('waiting2-1800x1200'))
    assert(html.includes('--cost-photo-desktop:')); assert(!html.includes('cost-desktop-')); assert(!html.includes('cost-mobile-'))
    assert(html.includes(messages.CostOfWaiting.line1.replaceAll('&', '&amp;')))
    const replaced = structuredClone(home); replaced.costOfWaiting.narrativeLines[0].desktop = image('waiting2')
    frames = resolveSiteChrome(null, await evaluate(replaced, locale)).frames
    assert(frames[0].desktop.image.src.includes('waiting2'))
    assert(frames[0].mobile.image.src.includes('waiting2'))
    replaced.costOfWaiting.narrativeLines[0].mobile = image('waiting1')
    frames = resolveSiteChrome(null, await evaluate(replaced, locale)).frames
    assert(frames[0].desktop.image.src.includes('waiting2')); assert(frames[0].mobile.image.src.includes('waiting1'))
    const removed = structuredClone(home); delete removed.costOfWaiting.narrativeLines[0].desktop; removed.costOfWaiting.frames = [{ _key: 'legacy', desktop: image('waiting1'), mobile: image('waiting1') }]
    frames = resolveSiteChrome(null, await evaluate(removed, locale)).frames
    assert.equal(frames[0].desktop, null); assert(frames[0].mobile.image.src.includes('waiting2'))
    delete removed.costOfWaiting.narrativeLines[0].mobile
    frames = resolveSiteChrome(null, await evaluate(removed, locale)).frames
    assert.equal(frames[0].desktop, null); assert.equal(frames[0].mobile, null)
    const legacy = structuredClone(home); legacy.costOfWaiting.narrativeLines = structuredClone(initialContent.singletons.homePage.costOfWaiting.narrativeLines); legacy.costOfWaiting.hopeLines = structuredClone(initialContent.singletons.homePage.costOfWaiting.hopeLines); legacy.costOfWaiting.frames = [{ _key: 'legacy', desktop: image('waiting1'), mobile: image('waiting2') }]
    const legacyFrames = resolveSiteChrome(null, await evaluate(legacy, locale)).frames
    assert(legacyFrames[0].desktop.image.src.includes('waiting1')); assert(legacyFrames[0].mobile.image.src.includes('waiting2'))
    const missing = structuredClone(home); missing.costOfWaiting.frames = []
    for (const line of [...missing.costOfWaiting.narrativeLines, ...missing.costOfWaiting.hopeLines]) { delete line.desktop; delete line.mobile }
    missing.costOfWaiting.narrativeLines[0].image = image('waiting1'); missing.costOfWaiting.narrativeLines[0].imageType = 'both'
    frames = resolveSiteChrome(null, await evaluate(missing, locale)).frames
    html = renderToStaticMarkup(exports.CostOfWaiting()); assert(!html.includes('<img ')); assert(html.includes('linear-gradient'))
    reduced = true; frames = legacyFrames
    assert(!renderToStaticMarkup(exports.CostOfWaiting()).includes('<img '), 'the existing reduced-motion text layout is preserved')
    assert.equal(await evaluate({ ...home, reviewStatus: 'pendingReview' }, locale), null)
  }
})

test('WhatsApp URLs preserve messages exactly and reject unavailable or malformed recipients', () => {
  for (const number of [undefined, null, '', '+919876543210', '91 9876543210', '0001234567', '123456', '1'.repeat(16), 919876543210, 'https://example.com']) assert.equal(buildWhatsappUrl(number, 'Enquiry'), null)
  assert.equal(buildWhatsappUrl('919876543210'), 'https://wa.me/919876543210')
  const data = { name: 'नाव & + % #', reachingAs: 'Couple', duration: '6–12 months', reason: 'IVF', preferredContact: 'WhatsApp', preferredDay: 'Monday', bestTime: 'Morning', openMessage: 'मराठी & + % #\nSecond line\rThird line\r\nFourth line' }
  const message = buildWhatsappMessage(data)
  const url = new URL(buildWhatsappUrl('919876543210', message))
  assert.equal(url.origin, 'https://wa.me'); assert.equal(url.pathname, '/919876543210')
  assert.deepEqual([...url.searchParams.keys()], ['text']); assert.equal(url.searchParams.get('text'), message)
  for (const value of Object.values(data).slice(0, -1)) assert(message.includes(value))
  assert(message.includes('मराठी & + % #\r\nSecond line\r\nThird line\r\nFourth line'))
  assert(!/(?<!\r)\n|\r(?!\n)/.test(message), 'native GET forms and retry links use identical line endings')
  const minimal = buildWhatsappMessage({ ...Object.fromEntries(Object.keys(data).map(key => [key, ''])), name: 'Name' })
  assert.equal(minimal, '*New enquiry — IVF Master*\r\n\r\n*Name:* Name')
})

test('the actual Contact form submits published settings natively and offers an up-to-date retry without a legacy recipient', async () => {
  const ts = require('typescript'), React = require('react'), { createTranslator } = require('next-intl'), { renderToStaticMarkup } = require('react-dom/server')
  const evaluate = async (query, dataset, locale) => (await groq.evaluate(groq.parse(query), { dataset, params: { locale } })).get()
  for (const [locale, base] of [['en', en], ['mr', mr]]) {
    const contact = { ...config.schema.types.find(type => type.name === 'contactPage').initialValue(), _id: 'contactPage', _type: 'contactPage', reviewStatus: 'approved' }
    contact.form.formSubmit = { en: 'CMS send enquiry', mr: 'CMS संदेश पाठवा' }
    contact.form.formReasonIVF = { en: 'CMS treatment & planning', mr: 'CMS उपचार & नियोजन' }
    const record = { ...structuredClone(initialContent.legacy.clinicSettings), _id: 'clinicSettings', _type: 'clinicSettings', reviewStatus: 'approved', whatsappNumber: '919876543210' }
    const dataset = [contact, record, { ...contact, _id: 'drafts.contactPage' }, { ...record, _id: 'drafts.clinicSettings', whatsappNumber: '919111111111' }]
    const published = await evaluate(contactPageQuery, dataset, locale)
    let settings = resolveClinicSettings(await evaluate(clinicSettingsQuery, dataset, locale), locale).settings
    assert(settings)
    const copy = mergeSiteMessages(base, { home: null, about: null, team: null, procedures: null, globals: null, contact: published }, locale)
    const translate = createTranslator({ locale, messages: copy, namespace: 'Contact' })
    const state = []; let cursor = 0, focused = 0
    const exports = {}, dependencies = {
      react: { ...React, useState: initial => { const index = cursor++; if (!(index in state)) state[index] = initial; return [state[index], value => { state[index] = typeof value === 'function' ? value(state[index]) : value }] }, useRef: () => ({ current: { focus: () => focused++ } }), useEffect() {} },
      'next-intl': { useLocale: () => locale, useTranslations: () => translate },
      '@/components/providers/ClinicSettingsContext': { useClinicSettings: () => settings },
      '@/components/providers/ClinicAvailabilityProvider': { useClinicAvailability: () => null },
      '@/lib/buildWhatsappMessage': { buildWhatsappMessage, buildWhatsappUrl },
      '@/lib/clinicHours': require('../lib/clinicHours.ts'),
      '@/lib/clinic-availability': require('../lib/clinic-availability.ts'),
      '@/config/site': require('../config/site.ts'),
    }
    const source = readFileSync(new URL('../components/sections/ContactPage.tsx', import.meta.url), 'utf8')
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText
    new Function('require', 'exports', compiled)(id => dependencies[id] ?? require(id), exports)
    const render = () => { cursor = 0; return exports.ContactPage() }
    const nodes = element => Array.isArray(element) ? element.flatMap(nodes) : element && typeof element === 'object' && element.props ? [element, ...nodes(element.props.children)] : []
    let tree = render(), elements = nodes(tree), form = elements.find(node => node.type === 'form')
    let prevented = false
    form.props.onSubmit({ preventDefault: () => { prevented = true } })
    assert(prevented); assert.equal(focused, 1)
    tree = render(); elements = nodes(tree)
    const name = elements.find(node => node.type === 'input' && node.props.type === 'text')
    assert.equal(name.props['aria-invalid'], true)
    name.props.onChange({ target: { value: '  Local नाव & + % #  ' } })
    const answers = elements.filter(node => Array.isArray(node.props.options)).map(node => { node.props.onChange(node.props.options[0]); return node.props.options[0] })
    elements.find(node => node.type === 'textarea').props.onChange({ target: { value: '  More & + % # मराठी\nSecond line  ' } })
    tree = render(); elements = nodes(tree); form = elements.find(node => node.type === 'form')
    assert.equal(form.props.action, 'https://wa.me/919876543210'); assert.equal(form.props.method, 'get'); assert.equal(form.props.target, '_blank'); assert.equal(form.props.rel, 'noopener noreferrer')
    const fields = elements.filter(node => node.props.name)
    assert.equal(fields.length, 1); assert.equal(fields[0].props.name, 'text'); assert.equal(fields[0].props.type, 'hidden')
    const message = fields[0].props.value
    for (const answer of answers) assert(message.includes(answer))
    assert(message.includes('Local नाव & + % #')); assert(message.includes('More & + % # मराठी\r\nSecond line'))
    prevented = false; form.props.onSubmit({ preventDefault: () => { prevented = true } }); assert.equal(prevented, false)
    tree = render(); elements = nodes(tree)
    const retry = elements.find(node => node.type === 'a' && node.props.children === translate('formWhatsappRetry'))
    assert(retry); assert.equal(retry.props.target, '_blank'); assert.equal(retry.props.rel, 'noopener noreferrer')
    const nativeUrl = new URL(form.props.action); nativeUrl.search = new URLSearchParams({ text: message }).toString()
    assert.equal(retry.props.href, nativeUrl.href); assert.equal(new URL(retry.props.href).searchParams.get('text'), message)
    assert(renderToStaticMarkup(tree).includes(translate('formSubmit')))
    elements.find(node => node.type === 'textarea').props.onChange({ target: { value: 'Updated answer' } })
    settings = { ...settings, whatsappNumber: '919876543211' }
    elements = nodes(render())
    const updated = elements.find(node => node.type === 'a' && node.props.children === translate('formWhatsappRetry'))
    assert.equal(new URL(updated.props.href).pathname, '/919876543211'); assert(new URL(updated.props.href).searchParams.get('text').includes('Updated answer'))
    for (const unavailable of [null, { ...settings, whatsappNumber: '+919876543210' }]) {
      settings = unavailable; tree = render(); elements = nodes(tree); form = elements.find(node => node.type === 'form')
      assert.equal(form.props.action, undefined); assert.equal(elements.find(node => node.type === 'button' && node.props.type === 'submit').props.disabled, true)
      prevented = false; form.props.onSubmit({ preventDefault: () => { prevented = true } }); assert(prevented)
      const html = renderToStaticMarkup(tree)
      assert(html.includes(translate('formWhatsappUnavailable'))); assert(!html.includes('https://wa.me/')); assert(!html.includes(translate('formWhatsappRetry')))
      assert(!elements.find(node => node.type.name === 'ContactRow' && node.props.label === translate('panelWhatsapp')).props.href)
    }
    assert(!source.includes('window.open')); assert(!source.includes('CLINIC_CONTACT.whatsappNumber'))
  }
})

test('Team Values fixed editor and initial template preserve saved sources and existing singleton edits', async () => {
  const source = { schema, templates, projectId: config.projectId, dataset: config.dataset, name: config.name, currentUser: null, i18n: { t: key => key }, document: { resolveNewDocumentOptions: () => [] } }
  const S = createStructureBuilder({ source, perspectiveStack: ['drafts'] })
  const root = config.plugins[0].tools[0].options.structure(S, {})
  const entry = root.getItems().find(item => item.getId?.() === 'teamValues')
  assert.equal(entry.getTitle(), 'Team Values')
  const editor = entry.getChild().serialize(); assert.equal(editor.options.id, 'teamValues'); assert.equal(editor.options.type, 'teamValues')
  assert(templates.some(template => template.id === 'teamValues' && template.schemaType === 'teamValues'))
  assert(!config.document.newDocumentOptions(templates.map(template => ({ templateId: template.id })), {}).some(option => option.templateId === 'teamValues'))
  assert.deepEqual(config.document.actions(['publish', 'unpublish', 'duplicate', 'delete'].map(action => ({ action })), { schemaType: 'teamValues' }).map(action => action.action), ['publish', 'unpublish'])
  const init = records => initialTeamValues({ fetch: async () => records })
  const defaults = await init([])
  assert.equal(defaults.cards.length, 5); assert(defaults.cards.every(card => card.icon === 'heart'))
  assert.equal(defaults.reviewStatus, 'pendingReview')
  const published = { _id: 'aboutPage', _type: 'aboutPage', trust: structuredClone(initialContent.singletons.aboutPage.trust) }
  const draft = { ...structuredClone(published), _id: 'drafts.aboutPage' }; draft.trust.title.en = 'Saved source draft'
  assert.equal((await init([published, draft])).heading.en, 'Saved source draft')
  assert.equal((await init([published])).heading.en, published.trust.title.en)
  for (const id of ['teamValues', 'drafts.teamValues']) assert.deepEqual(await init([{ _id: id, _type: 'teamValues' }, draft]), {})
  assert.equal((await init([{ _id: 'aboutPage', _type: 'aboutPage', trust: {} }])).cards.length, 0)
  await assert.rejects(initialTeamValues({ fetch: async () => { throw Error('offline') } }))
  await assert.rejects(init(null)); await assert.rejects(init([{ ...published, trust: { title: 1 } }]))
})

test('Team Values native validation targets keyed localized fields without weakening approval', async () => {
  const validate = document => validateDocument({ document, workspace: { schema }, getClient: () => { throw Error('Unexpected network') }, getDocumentExists: async () => false })
  const doc = { _id: 'drafts.teamValues', _type: 'teamValues', ...await initialTeamValues({ fetch: async () => [] }), reviewStatus: 'approved' }
  assert.deepEqual(await validate(doc), [])
  assert((await validate({ ...doc, reviewStatus: 'pendingReview' })).some(marker => marker.path[0] === 'reviewStatus'))
  const partial = structuredClone(doc); partial.heading = {}; partial.cards[2].title.en = ''; delete partial.cards[2].description; partial.cards[2].icon = 'unknown'
  let errors = await validate(partial)
  assert(errors.some(marker => JSON.stringify(marker.path) === JSON.stringify(['heading', 'en'])))
  for (const path of [['title', 'en'], ['description', 'en'], ['icon']]) assert.equal(errors.filter(marker => JSON.stringify(marker.path) === JSON.stringify(['cards', { _key: partial.cards[2]._key }, ...path])).length, 1)
  partial.cards.reverse(); errors = await validate(partial)
  assert(errors.some(marker => marker.path[1]?._key === doc.cards[2]._key && marker.path.at(-1) === 'icon'))
  assert.deepEqual(await validate({ _id: doc._id, _type: doc._type, reviewStatus: 'approved', cards: [] }), [])
  assert.deepEqual(await validate({ _id: doc._id, _type: doc._type, reviewStatus: 'approved' }), [])
  assert.equal(teamValuesContent.safeParse({ ...doc, cards: [...doc.cards, { ...doc.cards[0] }] }).success, false)
  assert((await validate({ ...doc, cards: Array.from({ length: 21 }, (_, index) => ({ ...doc.cards[0], _key: 'card-' + index })) })).some(marker => marker.path[0] === 'cards'))
})

test('Team Values real query, mapper and section preserve card order, optional text and published-only localization', async () => {
  const doc = { _id: 'teamValues', _type: 'teamValues', ...teamValuesFromTrust(initialContent.singletons.aboutPage.trust), reviewStatus: 'approved' }
  doc.cards = [doc.cards[4], doc.cards[1]]; doc.cards[0].title.mr = 'मराठी मूल्य'; doc.eyebrow = { en: '' }; doc.subheading = { en: '' }
  const dataset = [doc, { ...doc, _id: 'drafts.teamValues', heading: { en: 'Private draft' } }, { ...doc, _id: 'versions.release.teamValues' }]
  const result = await (await groq.evaluate(groq.parse(teamValuesQuery), { dataset })).get()
  const english = resolveTeamValues(result, 'en').value, marathi = resolveTeamValues(result, 'mr').value
  assert.equal(marathi.cards[0].title, 'मराठी मूल्य'); assert.equal(marathi.cards[1].title, english.cards[1].title)
  assert.equal(english.eyebrow, ''); assert.equal(english.subheading, '')
  assert.equal(resolveTeamValues(await (await groq.evaluate(groq.parse(teamValuesQuery), { dataset: dataset.slice(1) })).get(), 'en').value, null)
  assert.equal(resolveTeamValues([{ ...doc, reviewStatus: 'pendingReview' }], 'en').value, null)
  assert.equal(resolveTeamValues([{ ...doc, cards: [{ ...doc.cards[0], icon: 'invalid' }] }], 'en').value, null)
  const ts = require('typescript'), React = require('react'), { renderToStaticMarkup } = require('react-dom/server')
  let options
  const reader = {}
  const readerJs = ts.transpileModule(readFileSync(new URL('../sanity/lib/clinic.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
  new Function('require', 'exports', readerJs)(id => id === 'server-only' ? {} : id === './client' ? { client: { fetch: async (query, params, request) => { options = request; return (await groq.evaluate(groq.parse(query), { dataset, params })).get() } } } : id === './team-values-mapping' ? { teamValuesQuery, resolveTeamValues } : {}, reader)
  assert.deepEqual(await reader.getTeamValues('en'), english)
  assert.deepEqual(options, { cache: 'force-cache', next: { revalidate: 60, tags: ['teamValues'] } })
  const exports = {}, wrapper = ({ children }) => React.createElement('div', null, children)
  const js = ts.transpileModule(readFileSync(new URL('../components/team/TeamValuesSection.tsx', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText
  new Function('require', 'exports', js)(id => id === '@/components/layout/Container' ? { Container: wrapper } : id === '@/components/motion/Reveal' ? { Reveal: wrapper } : require(id), exports)
  const render = values => renderToStaticMarkup(React.createElement(exports.TeamValuesSection, { values }))
  const html = render(english)
  assert(html.indexOf(doc.cards[0].title.en) < html.indexOf(doc.cards[1].title.en)); assert.equal((html.match(/<article/g) ?? []).length, 2)
  assert(!html.includes('Trust built through practice')); assert(!html.includes('Private draft'))
  assert(render(marathi).includes('मराठी मूल्य')); assert.equal(render(null), '')
  assert.equal(render(resolveTeamValues([{ ...doc, cards: [] }], 'en').value), '')
})

test('published clinic identity drives presentation, metadata and structured data in both locales', async () => {
  const settings = { ...structuredClone(initialContent.singletons.siteSettings), _id: 'siteSettings', reviewStatus: 'approved', name: 'CMS clinic name', legalName: 'CMS registered clinic' }
  for (const locale of ['en', 'mr']) {
    const globals = await (await groq.evaluate(groq.parse(globalsQuery), { dataset: [settings], params: { locale } })).get()
    const { identity } = resolveSiteChrome(globals)
    assert.equal(identity.name, settings.name)
    assert.equal(identity.legalName, settings.legalName)
    assert.equal(identity.description, settings.description[locale])
    const metadata = buildPageMetadata({ locale, path: '/contact', title: 'Contact', description: 'Page description', siteName: identity.name })
    assert.equal(metadata.title.absolute, 'Contact | CMS clinic name')
    assert.equal(metadata.openGraph.siteName, settings.name)
    const clinic = buildRootJsonLd(null, null, identity)['@graph'].find(node => node['@type'] === 'MedicalClinic')
    assert.equal(clinic.name, settings.legalName)
    assert.equal(clinic.description, settings.description[locale])
  }
  const fields = config.schema.types.find(type => type.name === 'siteSettings').fields
  for (const name of ['name', 'legalName']) {
    assert.notEqual(fields.find(field => field.name === name).hidden, true)
    assert.notEqual(fields.find(field => field.name === name).readOnly, true)
  }
  const legacy = { ...settings, _id: 'drafts.siteSettings' }
  delete legacy.name; delete legacy.legalName
  const validate = (document) => validateDocument({ document, workspace: { schema }, getClient: () => { throw new Error('Unexpected remote request') }, getDocumentExists: async () => false })
  assert.deepEqual(await validate(legacy), [], 'existing records without identity fields remain publishable')
  assert((await validate({ ...legacy, name: ' ' })).some(marker => marker.path[0] === 'name' && marker.level === 'error'))
})

test('hidden legacy Site Settings addresses do not block publication; active address and approval rules still apply', async () => {
  const validate = (document, workspaceSchema = schema) => validateDocument({
    document, workspace: { schema: workspaceSchema },
    getClient: () => { throw new Error('This validation must not make remote requests') },
    getDocumentExists: async () => false,
  })
  const emptyAddress = { _type: 'postalAddress', streetAddress: '', addressLocality: '', addressRegion: '', postalCode: '', addressCountry: 'IN' }
  const approved = { ...structuredClone(initialContent.singletons.siteSettings), _id: 'drafts.siteSettings', reviewStatus: 'approved', address: emptyAddress }
  assert.deepEqual(await validate(approved), [])
  const pending = await validate({ ...approved, reviewStatus: 'pendingReview' })
  assert(pending.some((marker) => marker.path[0] === 'reviewStatus' && marker.level === 'error'))
  const invalidStats = await validate({ ...approved, stats: approved.stats.slice(0, 3) })
  assert(invalidStats.some((marker) => marker.path[0] === 'stats' && marker.level === 'error'))
  const clinic = await validate({ ...structuredClone(initialContent.legacy.clinicSettings), _id: 'drafts.clinicSettings', reviewStatus: 'approved', address: emptyAddress })
  assert(clinic.some((marker) => marker.path.join('.') === 'address.streetAddress' && marker.level === 'error'))
  // The reusable postalAddress contract must also stay strict outside its retired Site Settings field.
  const addressSchema = createSchema({ name: 'active-address', types: [
    ...config.schema.types,
    { name: 'activeAddress', type: 'document', fields: [{ name: 'address', type: 'postalAddress' }] },
  ] })
  const active = await validate({ _id: 'test-address', _type: 'activeAddress', address: emptyAddress }, addressSchema)
  assert(active.some((marker) => marker.path.join('.') === 'address.postalCode' && marker.message.includes('six-digit')))
  const visibleSchema = createSchema({ name: 'editable-site-address', types: config.schema.types.map((type) =>
    type.name === 'siteSettings' ? { ...type, fields: type.fields.map((field) => field.name === 'address' ? { ...field, hidden: false } : field) } : type) })
  const visible = await validate(approved, visibleSchema)
  assert(visible.some((marker) => marker.path.join('.') === 'address.streetAddress' && marker.level === 'error'))
})

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
  assert.deepEqual(procedureActions.slice(0, actions.length - 1), actions.slice(0, -1))
  assert.equal(procedureActions[3].action, 'delete')
  assert.equal(procedureActions.at(-1).name, 'FillFromWebsiteAction')
  const doctorActions = config.document.actions(actions, { schemaType: 'doctor' })
  assert.deepEqual(doctorActions.slice(0, actions.length), actions)
  assert.equal(doctorActions.at(-1).name, 'FillFromWebsiteAction')
})

test('Article and Procedure Delete appears in both menus without bypassing native safeguards', () => {
  const dialog = { type: 'confirm', message: 'Native confirmation fixture' }
  const onHandle = () => { throw new Error('Do not execute deletion in this test') }
  let state = { label: 'Delete', tone: 'critical', disabled: true, title: 'Native permission or reference restriction', dialog, onHandle }
  let received
  const nativeDelete = Object.assign(props => { received = props; return state }, { action: 'delete' })
  const publish = Object.assign(() => ({ label: 'Publish' }), { action: 'publish' })
  for (const [type, label] of [['procedure', 'Delete procedure'], ['article', 'Delete article']]) {
    const actions = config.document.actions([publish, nativeDelete], { schemaType: type })
    assert.equal(actions[0], publish)
    const action = actions.find(action => action.action === 'delete')
    const props = { id: 'local-fixture', type }
    assert.deepEqual(action(props), { ...state, label, group: ['default', 'paneActions'] })
    assert.equal(received, props)
    assert.equal(action, config.document.actions([publish, nativeDelete], { schemaType: type }).find(action => action.action === 'delete'))
    assert(!config.document.actions([publish], { schemaType: type }).some(action => action.action === 'delete'), 'do not fabricate a Delete action removed by the native configuration')
  }
  const action = config.document.actions([nativeDelete], { schemaType: 'article' })[0]
  state = { ...state, label: 'Deleting…' }
  assert.equal(action({ type: 'article' }).label, 'Deleting…')
  state = null
  assert.equal(action({ type: 'article' }), null)
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
  const articles = root.getItems().find((item) => item.getId?.() === 'article').getChild().serialize()
  const add = articles.menuItems.find((item) => item.title === 'Add new article')
  assert.equal(add.showAsAction, true, 'the Add action must appear in the pane header')
  assert.ok(add.icon, 'the Add action must have a visible plus icon')
  assert.deepEqual(add.intent, { type: 'create', params: { type: 'article', template: 'new-article' } })
  assert.equal(articles.initialValueTemplates[0].templateId, 'new-article')
  const fresh = templates.find((item) => item.id === 'new-article').value()
  assert.deepEqual(fresh, { reviewStatus: 'pendingReview' }, 'new articles start empty and require clinic approval')
  const procedures = root.getItems().find((item) => item.getId?.() === 'procedure').getChild()
  const addProcedure = procedures.serialize().menuItems.find((item) => item.title === 'Add new procedure')
  assert.equal(addProcedure.showAsAction, true, 'Add new procedure must be visible in the Procedures folder header')
  assert.ok(addProcedure.icon)
  assert.deepEqual(addProcedure.intent, { type: 'create', params: { type: 'procedure', template: 'procedure' } })
  assert.equal(templates.find((item) => item.id === addProcedure.intent.params.template).schemaType, 'procedure')
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
  assert.deepEqual(config.schema.types.filter((type) => type.type === 'document').map(type => type.name).sort(), ['procedure', 'doctor', 'clinicSettings', 'clinicAvailability', 'article', 'teamValues', 'educationPage', 'homeFaq', 'aboutInformation', 'facilityGallery', 'siteSettings', 'navigation', 'footer', 'homePage', 'proceduresPage', 'teamPage', 'aboutPage', 'contactPage', 'faq', 'testimonial', 'news', 'event', 'publicationCategory'].sort())
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

test('named Doctor entries open prefilled drafts or existing records without overwriting or duplicating them', async () => {
  const source = { schema, templates, projectId: config.projectId, dataset: config.dataset, name: config.name, currentUser: null,
    i18n: { t: key => key }, document: { resolveNewDocumentOptions: () => [] },
  }
  const S = createStructureBuilder({ source, perspectiveStack: ['drafts'] })
  const root = config.plugins[0].tools[0].options.structure(S, {})
  assert.equal(root.getItems().filter(item => item.getId?.() === 'doctor').length, 1)
  const items = root.getItems().find(item => item.getId?.() === 'doctor').getChild().getItems()
  assert.equal(items[0].getId(), 'all-doctors')
  assert.deepEqual(items.slice(1).map(item => item.getTitle()), initialContent.doctors.map(entry => entry.title))
  let rows = [], unavailable = false
  const client = { withConfig(options) { assert.deepEqual(options, { perspective: 'raw', useCdn: false }); return this }, fetch: async (query, params) => {
    if (unavailable) throw new Error('Local simulated network failure')
    const dataset = rows.map(_id => ({ _id, _type: 'doctor', slug: { current: params.slug } }))
    dataset.push({ _id: 'versions.release.hidden', _type: 'doctor', slug: { current: params.slug } }, { _id: 'unrelated', _type: 'doctor', slug: { current: 'different-doctor' } })
    return (await groq.evaluate(groq.parse(query), { dataset, params })).get()
  } }
  const options = { structureContext: { getClient: () => client } }
  for (const entry of initialContent.doctors) {
    const resolve = items.find(item => item.getId() === entry.slug).getChild()
    rows = []
    const fresh = (await resolve(entry.slug, options)).serialize()
    assert.equal(fresh.type, 'document'); assert.equal(fresh.options.type, 'doctor')
    assert.equal(fresh.options.template, `doctor-${entry.slug}`)
    assert.match(fresh.options.id, /^[a-f0-9]{8}-[a-f0-9-]{27}$/i)
    assert.equal((await resolve(entry.slug, options)).serialize().options.id, fresh.options.id, 'pane re-resolution must not start another draft')
    const template = templates.find(template => template.id === fresh.options.template)
    const value = template.value()
    assert.deepEqual(value, entry.value)
    assert.equal(value.name.en, entry.title); assert.equal(value.reviewStatus, 'pendingReview')
    assert.equal(value._id, undefined); assert.equal(value.portrait, undefined)
    assert(value.credentials.length > 0, 'copy the existing website qualification wording')
    assert.equal(value.specializations[0].en, value.title.en)
    value.name.en = 'Local edit'; assert.equal(template.value().name.en, entry.title, 'draft initialization uses a copy')
    rows = ['saved-profile', 'drafts.saved-profile']
    const saved = (await resolve(entry.slug, options)).serialize()
    assert.equal(saved.options.id, 'saved-profile'); assert.equal(saved.options.template, undefined)
    rows = ['drafts.existing-unpublished']
    assert.equal((await resolve(entry.slug, options)).serialize().options.id, 'existing-unpublished')
    rows = ['saved-profile', 'another-profile']
    const duplicate = (await resolve(entry.slug, options)).serialize()
    assert.equal(duplicate.type, 'documentList'); assert.deepEqual(duplicate.initialValueTemplates, [])
    unavailable = true
    await assert.rejects(resolve(entry.slug, options), /Could not check saved doctor profiles/)
    unavailable = false
  }
})

test('Doctor copy action fills only empty qualification/practice lists from existing website sources', async () => {
  const { doctorsQuery } = require('../sanity/lib/clinic-queries.ts')
  const { resolveDoctors } = require('../sanity/lib/clinic-mapping.ts')
  const dataset = initialContent.doctors.map((entry, index) => ({ ...structuredClone(entry.value), _id: `local-${index}`, reviewStatus: 'approved' }))
  const client = { withConfig() { return this }, fetch: async query => query.trim().startsWith('!defined') ? true : null }
  for (const document of dataset) {
    const errors = await validateDocument({ document, workspace: { schema }, getClient: () => client, getDocumentExists: async () => false })
    assert.deepEqual(errors.filter(error => error.level === 'error'), [], 'the complete copied profile must satisfy native Studio validation after local fixture approval')
  }
  const input = await (await groq.evaluate(groq.parse(doctorsQuery), { dataset, params: { slugs: initialContent.doctors.map(entry => entry.slug) } })).get()
  for (const locale of ['en', 'mr']) {
    const result = resolveDoctors(input, locale)
    assert.equal(result.status, 'sanity')
    assert.equal(result.doctors.length, 2)
    for (const profile of result.doctors) {
      assert(profile.credentials[0].includes('Pune University'))
      assert(profile.specializations[0].text.length > 0)
    }
  }
  for (const entry of initialContent.doctors) {
    const document = { _id: 'saved-id', slug: entry.value.slug, reviewStatus: 'approved', credentials: [], specializations: [] }
    const fields = doctorWebsiteValues(document)
    assert.deepEqual(missingWebsiteFields(document, fields), {}, 'empty lists change only when the explicit Doctor copy action is chosen')
    assert.deepEqual(missingWebsiteFields(document, fields, '', ['credentials', 'specializations']), fields)
    const edited = { ...document, credentials: [{ _key: 'saved', en: 'Saved clinic qualification' }], specializations: [{ _key: 'saved', en: 'Saved practice area' }] }
    assert.deepEqual(missingWebsiteFields(edited, fields, '', ['credentials', 'specializations']), {})
    assert.equal(fields.reviewStatus, undefined); assert.equal(fields._id, undefined)
  }
  assert.equal(doctorWebsiteValues({ slug: { current: 'unknown' } }), undefined)
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
    assert.deepEqual(chrome.stats.map((stat) => stat.value), [2000, 67, 20, 3000])
    assert.deepEqual(chrome.stats.map((stat) => stat.label), Object.values(original.Stats))
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
  assert.ok(resolveSiteChrome(source.globals).navigation.every(item => item.href !== '/en/missing' && item.href !== '//example.com'))
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

test('the actual Hero and Footer renderers use mapped CMS media and links', async (t) => {
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
  const { ArticleDetail } = require('../components/sections/ArticleDetail.tsx')
  const { MeetTheDoctors } = require('../components/sections/MeetTheDoctors.tsx')
  const { Footer } = require('../components/shared/Footer.tsx')
  const { AppRouterContext } = require('next/dist/shared/lib/app-router-context.shared-runtime.js')
  const { PathnameContext } = require('next/dist/shared/lib/hooks-client-context.shared-runtime.js')
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
  const { resolveArticles } = await import('../sanity/lib/article-mapping.ts')
  const { ARTICLES } = await import('../lib/articles.ts')
  const article = resolveArticles([{ _id: 'local-only', reviewStatus: 'approved', slug: 'new-local-fixture', title: { en: 'CMS article title' }, excerpt: { en: 'CMS excerpt' }, category: 'Conditions', date: '2026-10-22', readTime: 3, content: { intro: { en: 'CMS opening paragraph' }, sections: { en: [{ _key: 'section', heading: 'CMS section heading', body: 'CMS section body' }] } } }], ARTICLES, 'en').articles.at(-1)
  const articleHtml = renderToStaticMarkup(createElement(NextIntlClientProvider, { locale: 'en', timeZone: 'Asia/Kolkata', messages: en }, createElement(ArticleDetail, { article, allArticles: [article] })))
  for (const copy of ['CMS article title', 'CMS opening paragraph', 'CMS section heading', 'CMS section body']) assert(articleHtml.includes(copy), `${copy} must reach the actual website renderer`)
  const portrait = img('doctor')
  const profile = { slug: 'gorakh-mandrupkar', order: 0, name: 'Local doctor fixture', home: { intro: 'CMS homepage summary fixture' }, specializations: [{ _key: 'practice', text: 'CMS practice fixture' }], credentials: ['Local qualification fixture · Institution · 2020'], portrait: { photo: portrait.image, alt: 'CMS doctor photo' } }
  const renderDoctors = () => renderToStaticMarkup(createElement(ImageConfigContext.Provider, { value: { ...imageConfigDefault, ...nextConfig.images } }, createElement(NextIntlClientProvider, { locale: 'en', timeZone: 'Asia/Kolkata', messages: en }, createElement(MeetTheDoctors, { profiles: [profile] }))))
  assert(renderDoctors().includes('CMS homepage summary fixture'))
  assert(!renderDoctors().includes('Local qualification fixture · Institution · 2020'))
  assert(!renderDoctors().includes('CMS practice fixture'))
  assert(renderDoctors().includes('alt="CMS doctor photo"'))
  profile.portrait = undefined
  const withoutPortrait = renderDoctors()
  assert(!withoutPortrait.includes('<img'))
  assert(!withoutPortrait.includes('gorakh-mandrupkar.jpeg'))
  const fallbackSource = await projected('en')
  fallbackSource.home.meetTheDoctors.doctors[0].credentials = []
  const fallbackHome = resolveSiteChrome(fallbackSource.globals, fallbackSource.home)
  assert.deepEqual(fallbackHome.homeDoctors['gorakh-mandrupkar'].credentials, [])
  for (const [locale, messages] of [['en', en], ['mr', mr]]) {
    const source = await projected(locale)
    const external = { label: `Policy ${locale}`, link: { kind: 'external', externalUrl: 'https://example.com/policy', opensInNewTab: true } }
    source.globals.footer.legalLinks = [external, { label: `Contact ${locale}`, link: { kind: 'internal', internalPath: '/contact' } }]
    source.globals.footer.linkGroups.forEach(group => group.items.push(external))
    source.globals.footer.copyright = 'CMS copyright {year}'
    const renderFooter = () => renderToStaticMarkup(createElement(AppRouterContext.Provider, { value: { replace() {} } },
      createElement(PathnameContext.Provider, { value: locale === 'en' ? '/en' : '/' },
        createElement(NextIntlClientProvider, { locale, timeZone: 'Asia/Kolkata', messages },
          createElement(SiteContentProvider, { content: resolveSiteChrome(source.globals) }, createElement(Footer))))))
    const footerHtml = renderFooter()
    const policyAnchors = [...footerHtml.matchAll(/<a\b[^>]*href="https:\/\/example.com\/policy"[^>]*>/g)].map(match => match[0])
    assert.equal(policyAnchors.length, 3)
    assert(policyAnchors.every(anchor => anchor.includes('target="_blank"') && anchor.includes('rel="noopener noreferrer"')))
    assert(footerHtml.includes(`href="${locale === 'en' ? '/en' : ''}/contact"`))
    assert(footerHtml.includes(`Policy ${locale}`))
    assert(footerHtml.includes(`CMS copyright ${new Date().getFullYear()}`))
    source.globals.footer.legalLinks = []
    const emptyHtml = renderFooter()
    assert(!/href="(?:\/en)?\/(?:privacy|terms)"/.test(emptyHtml))
    assert.equal((emptyHtml.match(/href="https:\/\/example.com\/policy"/g) ?? []).length, 2, 'only column links remain')
  }
  // Exercise the same menu hook used by the desktop dropdown and mobile accordion.
  // Fixtures stay local: no invented procedure is saved or published to Sanity.
  const { useNavProcedures } = require('../components/nav/procedures-data.tsx')
  const { resolveProcedures } = await import('../sanity/lib/procedure-mapping.ts')
  const { allProceduresQuery } = await import('../sanity/lib/procedure-query.ts')
  const { PROCEDURES } = await import('../lib/procedures.ts')
  const fresh = { ...structuredClone(initialContent.procedures[0].value), _type: 'procedure', _id: 'local-fixture-only', reviewStatus: 'approved', slug: { current: 'new-cms-procedure' }, name: { en: 'CMS new procedure', mr: 'नवीन प्रक्रिया' }, oneLiner: { en: 'CMS menu description', mr: 'नवीन प्रक्रियेची माहिती' } }
  const stored = [fresh, { ...fresh, _id: 'drafts.hidden', slug: { current: 'draft-procedure' } }, { ...fresh, _id: 'pending', reviewStatus: 'pendingReview', slug: { current: 'pending-procedure' } }]
  const data = await (await groq.evaluate(groq.parse(allProceduresQuery), { dataset: stored })).get()
  function MenuData() {
    return createElement('nav', {}, useNavProcedures().map((item) => createElement('a', { key: item.id, href: item.href }, item.label, item.description)))
  }
  for (const locale of ['en', 'mr']) {
    const mapped = resolveProcedures(data, PROCEDURES, locale)
    assert.equal(mapped.status, 'sanity')
    const procedures = mapped.procedures.map((item) => ({ id: item.slug, label: item.name, description: item.oneLiner, href: `/procedures/${item.slug}` }))
    const menu = renderToStaticMarkup(createElement(SiteContentProvider, { content: { navigation: null, footer: null, procedures } }, createElement(MenuData)))
    assert(menu.includes('href="/procedures/new-cms-procedure"'))
    assert(menu.includes(fresh.name[locale]))
    assert(menu.includes(fresh.oneLiner[locale]))
    assert(!menu.includes('draft-procedure'))
    assert(!menu.includes('pending-procedure'))
    assert.equal(mapped.procedures.at(-1).slug, 'new-cms-procedure')

  }
})

test('Footer validation identifies the exact keyed field and preserves approval and language requirements', async () => {
  const validate = document => validateDocument({ document, workspace: { schema }, getClient: () => { throw new Error('Unexpected remote request') }, getDocumentExists: async () => false })
  const footer = { ...structuredClone(initialContent.singletons.footer), _id: 'drafts.footer', reviewStatus: 'approved' }
  assert.deepEqual(footer.legalLinks, [])
  assert.notEqual(config.schema.types.find(type => type.name === 'footer').fields.find(field => field.name === 'legalLinks').readOnly, true)
  assert.deepEqual(await validate(footer), [])
  delete footer.legalLinks
  assert.deepEqual(await validate(footer), [], 'legal links are optional')
  const item = (key, path) => ({ _type: 'navItem', _key: key, label: { _type: 'localizedString', en: 'Policy', mr: 'धोरण' }, link: { _type: 'link', kind: 'internal', internalPath: path } })
  footer.legalLinks = [item('privacy', '/privacy'), item('contact', '/contact')]
  let errors = (await validate(footer)).filter(marker => marker.level === 'error')
  assert.equal(errors.length, 1)
  assert.deepEqual(errors[0].path, ['legalLinks', { _key: 'privacy' }, 'link', 'internalPath'])
  assert.match(errors[0].message, /No page exists at "\/privacy"/)
  footer.legalLinks.reverse()
  errors = (await validate(footer)).filter(marker => marker.level === 'error')
  assert.deepEqual(errors[0].path, ['legalLinks', { _key: 'privacy' }, 'link', 'internalPath'])
  footer.legalLinks[1].link = { _type: 'link', kind: 'external', externalUrl: 'https://example.com/policy', opensInNewTab: true }
  assert.deepEqual(await validate(footer), [])
  delete footer.legalLinks[1].label.mr
  errors = await validate(footer)
  assert.deepEqual(errors[0].path, ['legalLinks', { _key: 'privacy' }, 'label', 'mr'])
  assert.match(errors[0].message, /Marathi/)
  footer.legalLinks[1].label.mr = 'धोरण'
  delete footer.legalLinks[1].label.en
  assert((await validate(footer)).some(marker => marker.path.at(-1) === 'en'))
  footer.legalLinks[1].label.en = 'Policy'
  footer.legalLinks[1].link.externalUrl = 'javascript:alert(1)'
  errors = await validate(footer)
  assert(errors.some(marker => marker.path.at(-1) === 'externalUrl' && marker.message.includes('https://')))
  footer.legalLinks[1].link.externalUrl = 'https:example.com'
  assert((await validate(footer)).some(marker => marker.path.at(-1) === 'externalUrl'))
  footer.legalLinks[1].link.kind = 'internal'
  footer.legalLinks[1].link.internalPath = '/contact'
  assert.deepEqual(await validate(footer), [], 'unused external URL does not block an internal destination')
  delete footer.legalLinks[1].link.kind
  assert((await validate(footer)).some(marker => marker.path.at(-1) === 'kind'))
  footer.legalLinks = []
  footer.reviewStatus = 'pendingReview'
  assert((await validate(footer)).some(marker => marker.path[0] === 'reviewStatus' && marker.level === 'error'))
  footer.reviewStatus = 'approved'
  footer.linkGroups[0].items = Array.from({ length: 8 }, (_, index) => item(`item-${index}`, `/procedures/treatment-${index}`))
  assert.deepEqual(await validate(footer), [])
  footer.linkGroups[0].items.push(item('ninth', '/contact'))
  assert((await validate(footer)).some(marker => marker.path.at(-1) === 'items'))
  footer.linkGroups.pop()
  assert((await validate(footer)).some(marker => marker.path[0] === 'linkGroups' && marker.path.length === 1))
  footer.legalLinks = Array.from({ length: 5 }, (_, index) => item(`legal-${index}`, '/contact'))
  assert((await validate(footer)).some(marker => marker.path[0] === 'legalLinks' && marker.path.length === 1))
})

test('Footer mapper applies its own limits, retains valid siblings and never invents legal links', async () => {
  const source = await projected('en')
  const item = index => ({ label: `Link ${index}`, link: { kind: 'internal', internalPath: `/procedures/treatment-${index}` } })
  source.globals.footer.linkGroups[0].items = Array.from({ length: 8 }, (_, index) => item(index))
  assert.equal(resolveSiteChrome(source.globals).footer[0].items.length, 8)
  source.globals.footer.legalLinks = [item(1), item(2), { label: 'Invalid', link: { kind: 'internal', internalPath: '/privacy' } }, { label: 'Policy', link: { kind: 'external', externalUrl: 'https://example.com/policy', opensInNewTab: true } }]
  const chrome = resolveSiteChrome(source.globals)
  assert.equal(chrome.legalLinks.length, 3)
  assert.equal(chrome.legalLinks.at(-1).opensInNewTab, true)
  assert.match(chrome.footerCopyright, /\{year\}/)
  source.globals.footer.legalLinks.push(item(4))
  assert.deepEqual(resolveSiteChrome(source.globals).legalLinks, [], 'over-limit arrays are rejected')
  assert.deepEqual(resolveSiteChrome(null).legalLinks, [])
})

test('new procedure and article menu paths map in both languages without replacing CMS labels', async () => {
  for (const locale of ['en', 'mr']) {
    const source = await projected(locale);
    source.globals.navigation.items = [
      { label: 'CMS treatment link', link: { kind: 'internal', internalPath: '/procedures/new-procedure' } },
      { label: 'CMS article link', link: { kind: 'internal', internalPath: '/educate-ivf/new-article' } },
      { label: 'CMS treatments menu', link: { kind: 'internal', internalPath: '/procedures' } },
      { label: 'CMS contact', link: { kind: 'internal', internalPath: '/contact' } },
    ];
    const navigation = resolveSiteChrome(source.globals).navigation;
    assert.equal(navigation.length, 4);
    assert.equal(navigation[0].href, '/procedures/new-procedure');
    assert.equal(navigation[1].href, '/educate-ivf/new-article');
    assert.equal(navigation[2].key, 'procedures');
    assert.equal(navigation[0].label, 'CMS treatment link');
    source.globals.navigation.items[0].link.internalPath = '//example.com';
    assert.ok(resolveSiteChrome(source.globals).navigation.every(item => item.href !== '/en/missing' && item.href !== '//example.com'));
  }
});

test('an invalid page cannot replace valid CMS navigation and external links retain new-tab choice', () => {
  const navigation = resolveSiteChrome({ navigation: { items: [
    { label: 'Contact', link: { kind: 'internal', internalPath: '/contact' } },
    { label: 'Shop', link: { kind: 'internal', internalPath: '/shop' } },
    { label: 'External shop', link: { kind: 'external', externalUrl: 'https://example.com/shop', opensInNewTab: true } },
    { label: 'Unsafe', link: { kind: 'external', externalUrl: 'javascript:alert(1)' } },
  ] } }).navigation;
  assert.deepEqual(navigation.map(item => item.href), ['/contact', 'https://example.com/shop']);
  assert.equal(navigation[1].opensInNewTab, true);
});
