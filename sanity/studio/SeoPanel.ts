import { createElement as h } from 'react'
import { useFormValue, type ObjectInputProps } from 'sanity'

import { siteConfig } from '../../config/site'
import { runSeoChecks, truncateForPreview, SEO_DESCRIPTION_RANGE, SEO_TITLE_RANGE } from '../lib/seo-checks'

// Written with createElement rather than JSX so schema modules that import it stay
// loadable by the Node test runner, which strips types but does not compile JSX.
// Plain elements inherit the Studio theme through CSS variables; no UI package needed.

const muted = { color: 'var(--card-muted-fg-color, #6e7683)', fontSize: 12, margin: 0 }
const text = { fontSize: 13, margin: 0, lineHeight: 1.5 }
const box = { border: '1px solid var(--card-border-color, #e3e4e8)', borderRadius: 6, padding: 12, display: 'grid', gap: 8 }

type Localized = { en?: string; mr?: string } | undefined
type SeoValue = {
  metaTitle?: Localized; metaDescription?: Localized; focusKeyword?: string
  noIndex?: boolean; noFollow?: boolean; canonicalUrl?: string; structuredData?: boolean
}
type DocumentValue = Record<string, unknown> & { _type?: string; slug?: { current?: string } }

const ROUTES: Record<string, (slug?: string) => string | null> = {
  procedure: (slug) => slug ? `/procedures/${slug}` : null,
  article: (slug) => slug ? `/educate-ivf/${slug}` : null,
  doctor: (slug) => slug ? `/team/${slug}` : null,
  homePage: () => '/', aboutPage: () => '/about', teamPage: () => '/team', proceduresPage: () => '/procedures', contactPage: () => '/contact',
}

const pick = (value: unknown, locale: 'en' | 'mr'): string => {
  if (typeof value === 'string') return value
  const localized = value as Localized
  return (locale === 'mr' ? localized?.mr || localized?.en : localized?.en || localized?.mr) ?? ''
}

/** The website's own title/description used when the SEO fields are left empty. */
function fallbacks(doc: DocumentValue, locale: 'en' | 'mr') {
  const name = pick(doc.name, locale), fullName = pick(doc.fullName, locale)
  return {
    title: doc._type === 'procedure' && name ? `${name} — ${fullName}` : pick(doc.title, locale) || name,
    description: pick(doc.oneLiner, locale) || pick(doc.excerpt, locale) || pick(doc.metaDescription, locale),
    body: pick(doc.heroDescription, locale) || pick(doc.excerpt, locale) || pick(doc.intro, locale),
  }
}

function preview(key: string, label: string, url: string, title: string, description: string) {
  return h('div', { key, style: { display: 'grid', gap: 6 } },
    h('p', { style: muted }, label),
    h('div', { style: box },
      h('p', { style: muted }, url),
      h('p', { style: { ...text, fontSize: 17, color: 'var(--card-link-fg-color, #1a0dab)' } }, truncateForPreview(title || 'No title — the website default is used', SEO_TITLE_RANGE.max)),
      h('p', { style: text }, truncateForPreview(description || 'No description — the website default is used', SEO_DESCRIPTION_RANGE.max))))
}

export function SeoPanel(props: ObjectInputProps) {
  const doc = (useFormValue([]) ?? {}) as DocumentValue
  const seo = (props.value ?? {}) as SeoValue
  const routeFor = doc._type ? ROUTES[doc._type] : undefined
  const route = routeFor ? routeFor(doc.slug?.current) : null
  const brand = (title: string) => !title || title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`
  const host = siteConfig.url.replace(/^https?:\/\//, '')

  const previews = (['en', 'mr'] as const).map((locale) => {
    const fallback = fallbacks(doc, locale)
    const path = route === null ? '' : locale === 'mr' ? (route === '/' ? '' : route) : route === '/' ? '/en' : `/en${route}`
    return {
      locale,
      title: brand(pick(seo.metaTitle, locale) || fallback.title),
      description: pick(seo.metaDescription, locale) || fallback.description,
      url: host + path,
      body: fallback.body,
    }
  })
  const english = previews[0]
  const checks = runSeoChecks({
    keyword: seo.focusKeyword,
    title: english.title,
    description: english.description,
    ...(doc.slug ? { slug: doc.slug.current ?? '' } : {}),
    ...(english.body ? { body: english.body } : {}),
  })
  const excluded = Boolean(seo.noIndex || seo.canonicalUrl)
  const visibility = route === null ? null : h('p', { style: muted },
    `Visibility: ${seo.noIndex ? 'hidden from search engines' : 'listed in search'}${seo.noFollow ? ', links not followed' : ''}${seo.canonicalUrl ? `, points to ${seo.canonicalUrl}` : ''}; sitemap: ${excluded ? 'excluded' : 'included'}; schema markup: ${seo.structuredData === false ? 'off' : 'on'}. Applies after approval and publishing.`)

  return h('div', { style: { display: 'grid', gap: 16 } },
    h('section', { style: box, 'aria-label': 'Search preview and checks' },
      h('p', { style: { ...text, fontWeight: 600 } }, route === null ? 'Preview of the site-wide default listing' : 'Google preview'),
      ...previews.map((item) => preview(item.locale, item.locale === 'mr' ? 'Marathi (मराठी)' : 'English', item.url, item.title, item.description)),
      h('p', { style: { ...text, fontWeight: 600 } }, `Checks${seo.focusKeyword ? ` for “${seo.focusKeyword}”` : ''} (English)`),
      h('ul', { style: { listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 } }, ...checks.map((check) =>
        h('li', { key: check.id, style: { ...text, display: 'flex', gap: 8, alignItems: 'baseline' } },
          h('span', { style: { fontSize: 11, fontWeight: 600, padding: '1px 6px', borderRadius: 4, whiteSpace: 'nowrap', background: check.status === 'good' ? 'rgba(61,170,107,0.18)' : 'rgba(230,160,40,0.22)' } }, check.status === 'good' ? 'Good' : 'Improve'),
          h('span', null, check.message)))),
      visibility),
    props.renderDefault(props))
}
