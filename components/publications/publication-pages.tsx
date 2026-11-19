import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DraftPreview } from './draft-preview'
import { ArrowLeft, Newspaper } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { buildAbsoluteUrl, buildLocalizedPath } from '@/lib/seo/routes'
import { SPEECH_PATHS, type SpeechKind } from '@/lib/speeches-availability'
import { getPublications } from '@/sanity/lib/publications'
import { getSeoContext, getSiteContent } from '@/sanity/lib/site-content'
import { resolveSiteChrome } from '@/sanity/lib/site-content-mapping'
import { BacklinkReferences } from '@/components/SEO/BacklinkReferences'
import { resolvePageSeo } from '@/sanity/lib/seo-mapping'
import { siteConfig } from '@/config/site'
import { localizePublication as localize, localizePublicationBody, publicationCopy, type PublicationDocument } from '@/sanity/lib/publication-model'
import { parsePublicationMedia } from '@/sanity/lib/publication-media'
import { JsonLdScript } from '@/components/SEO/StructuredData'
import { buildPageJsonLd } from '@/lib/seo/jsonLd'
import { getTranslations } from 'next-intl/server'
import { publicationLabels } from './copy'
import { coverImages, mediaImages, publicationDate } from './publication-data'
import { PublicationImage } from './publication-image'
import { PublicationRichText } from './rich-text'
import { MediaPreview } from './media-preview'
import { EventRefresh } from './event-refresh'
import { NewsCard } from './publication-cards'
import { CategoryFilter } from './category-filter'
import { LoadMoreList } from './load-more-list'
import { orderPublications, spotlightPublications } from './listing-order'
import { audienceJsonLd } from './speech-audience'
import { speechLabels } from './speech-labels'
import styles from './publication-design.module.css'

type Kind = SpeechKind
export type PublicationParams = { params: Promise<{ locale: string; slug?: string }> }
export type PublicationSearch = Promise<Record<string, string | string[] | undefined>>
const localeFor = (locale: string) => locale === 'en' ? 'en' as const : 'mr' as const
const pathFor = (kind: Kind) => SPEECH_PATHS[kind]
const pageFor = (kind: Kind) => kind === 'news' ? 'medicalSpeeches' as const : 'patientSpeeches' as const
const speechPaths: readonly string[] = Object.values(SPEECH_PATHS)
/** The listing's heading copy, from the approved CMS page only. Missing fields stay empty; there is no code fallback. */
async function listingCopy(kind: Kind, locale: 'en' | 'mr') {
  const page = (await getSiteContent(locale))[pageFor(kind)]
  const read = (value: unknown) => { const copy = publicationCopy.safeParse(value); return copy.success ? localize(copy.data, locale) : undefined }
  return { eyebrow: read(page?.eyebrow), heading: read(page?.heading), intro: read(page?.intro) }
}
/** Future-dated speeches stay out of public pages until their publication time. */
function visible(docs: PublicationDocument[], preview: boolean, now: number) {
  return docs.filter(doc => preview || Date.parse(doc.publishedAt) <= now)
}
function PreviewBanner({ locale }: { locale: 'en' | 'mr' }) {
  const t = publicationLabels[locale]
  return <><aside className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-navy p-4 text-sm text-white"><span>{t.preview}</span><form action="/api/draft-mode/disable" method="post"><button className="rounded-lg border border-white/60 px-3 py-2">{t.exit}</button></form></aside><DraftPreview /></>
}
async function PublicationLinks({ locale, current }: { locale: 'en' | 'mr'; current?: string }) {
  const t = publicationLabels[locale]
  const navigation = resolveSiteChrome((await getSiteContent(locale)).globals).navigation
  const links = navigation?.find(item => item.children?.some(child => speechPaths.includes(child.href)))?.children
  if (!links?.length) return null
  return <nav aria-label={t.browse} className={styles.sectionNav}>{links.map(link => <Link key={link.key} href={link.href} aria-current={current === link.href ? 'page' : undefined} target={link.opensInNewTab ? '_blank' : undefined} rel={link.opensInNewTab ? 'noopener noreferrer' : undefined}>{link.label}</Link>)}</nav>
}
export async function publicationMetadata(kind: Kind, props: PublicationParams, search?: PublicationSearch): Promise<Metadata> {
  const { locale: lang, slug } = await props.params, locale = localeFor(lang)
  const result = await getPublications(kind), now = Date.now()
  const doc = slug ? visible(result.documents, result.preview, now).find(doc => doc.slug.current === slug) : undefined
  if (slug && !doc) return { title: 'Content unavailable', robots: { index: false, follow: true } }
  const context = await getSeoContext(locale, doc ? undefined : pageFor(kind)), seo = doc ? resolvePageSeo(doc.seo, locale) : undefined
  const copy = await listingCopy(kind, locale)
  const cover = doc ? coverImages(doc, locale)[0] : undefined
  const metadata = buildPageMetadata({ ...context, locale, path: pathFor(kind) + (slug ? `/${slug}` : ''),
    // Listing SEO falls back to the CMS heading/intro, then the site name; speech text is never in code.
    title: doc ? localize(doc.title, locale) : copy.heading ?? context.siteName ?? siteConfig.name,
    description: doc ? localize(doc.summary, locale) : copy.intro ?? '',
    type: doc ? 'article' : 'website', publishedTime: doc?.publishedAt,
    seo: doc ? { noIndex: false, noFollow: false, structuredData: true, ...(cover ? { ogImage: { url: cover.src, width: cover.width ?? 1200, height: cover.height ?? 675, alt: cover.alt } } : {}), ...seo } : context.seo,
  })
  if (doc && metadata.openGraph && 'type' in metadata.openGraph && metadata.openGraph.type === 'article') metadata.openGraph.modifiedTime = doc._updatedAt
  const query = search ? await search : {}
  if (result.preview || result.error || Object.keys(query).length) metadata.robots = { index: false, follow: !result.preview }
  return metadata
}
/** Breadcrumbs plus the listing as a CollectionPage marked with its audience. */
function listingJsonLd(kind: Kind, locale: 'en' | 'mr', home: string, heading: string) {
  const breadcrumbs = buildPageJsonLd(locale, [{ name: home, path: '/' }, { name: heading, path: pathFor(kind) }])
  const url = buildAbsoluteUrl(buildLocalizedPath(locale, pathFor(kind)))
  return { ...breadcrumbs, '@graph': [...breadcrumbs['@graph'], { '@type': 'CollectionPage', url, name: heading, inLanguage: locale, audience: audienceJsonLd(kind) }] }
}
export async function PublicationListing({ kind, params, searchParams }: PublicationParams & { kind: Kind; searchParams: PublicationSearch }) {
  const { locale: lang } = await params, locale = localeFor(lang), t = await speechLabels(kind, locale)
  const result = await getPublications(kind), query = await searchParams, now = Date.now()
  const [copy, { seo }, nav] = await Promise.all([listingCopy(kind, locale), getSeoContext(locale, pageFor(kind)), getTranslations({ locale, namespace: 'Nav' })])
  const docs = visible(result.documents, result.preview, now)
  const category = typeof query.category === 'string' ? query.category : ''
  const categories = [...new Map(docs.filter(doc => doc.category).map(doc => [doc.category!.slug.current, doc.category!])).values()]
    .sort((a, b) => localize(a.title, locale).localeCompare(localize(b.title, locale), locale))
  const filtered = orderPublications(docs.filter(doc => !category || doc.category?.slug.current === category))
  const spotlight = !category ? spotlightPublications(filtered) : [], lead = spotlight[0]
  const remaining = filtered.filter(doc => !spotlight.some(item => item._id === doc._id))
  const card = (doc: PublicationDocument, variant: 'lead' | 'brief' | 'archive') => <NewsCard key={doc._id} doc={doc} basePath={pathFor(kind)} locale={locale} variant={variant} readLabel={t.read} />
  const href = (nextCategory: string) => pathFor(kind) + (nextCategory ? `?${new URLSearchParams({ category: nextCategory })}` : '')
  const boundaries = docs.flatMap(doc => Date.parse(doc.publishedAt) > now ? [Date.parse(doc.publishedAt)] : [])
  const filterOptions = [{ value: '', label: t.all, href: href('') }, ...categories.map(cat => ({ value: cat.slug.current, label: localize(cat.title, locale), href: href(cat.slug.current) }))]
  if (category && !filterOptions.some(option => option.value === category)) filterOptions.push({ value: category, label: t.noCategory, href: href(category) })
  const emptyTitle = result.error ? t.error : category ? t.noCategory : t.empty
  return <main id="main-content" className={`${styles.page} ${styles.listing}`}><div className={styles.container}>
    {result.preview && <PreviewBanner locale={locale} />}<EventRefresh boundary={boundaries.length ? Math.min(...boundaries) : null} />
    <header className={styles.masthead}>
      <div className={styles.headingGroup}>{copy.eyebrow && <p className={styles.journalLabel}>{copy.eyebrow}</p>}{copy.heading && <h1>{copy.heading}</h1>}{copy.intro && <p className={styles.intro}>{copy.intro}</p>}</div>
      <PublicationLinks locale={locale} current={pathFor(kind)} />
    </header>
    <div className={styles.toolbar}>
      <CategoryFilter value={category} options={filterOptions} label={t.categoryFilter} pendingLabel={t.filtering} />
      {category && <Link href={href('')} scroll={false} className={styles.clearFilter}>{t.clear}</Link>}
      <span className={styles.resultCount} role="status">{filtered.length} {filtered.length === 1 ? t.story : t.stories}</span>
    </div>
    {result.error || !filtered.length ? <div role="status" className={styles.empty}>
      <div className={styles.emptyIcon}><Newspaper size={25} aria-hidden="true" /></div>
      <div><h2>{emptyTitle}</h2><p>{result.error ? t.errorBody : category ? t.noCategoryBody : t.emptyBody}</p>{category && <Link href={href('')} className={styles.emptyAction}>{t.clear}</Link>}</div>
    </div> : <>
      {spotlight.length > 0 && <section aria-label={t.featured} className={styles.newsSpotlight} data-single={spotlight.length === 1}>
        {card(spotlight[0], 'lead')}
        {spotlight.length > 1 && <div className={styles.newsRail}>{spotlight.slice(1).map(doc => card(doc, 'brief'))}</div>}
      </section>}
      {remaining.length > 0 && <section className={styles.archive} aria-label={t.latest}>
        <div className={styles.sectionHeading}><h2>{spotlight.length ? t.moreNews : t.allNews}</h2></div>
        <LoadMoreList key={`${kind}:${category}:${lead?._id ?? ''}`}
          items={remaining.map(doc => ({ id: doc._id, content: card(doc, 'archive') }))}
          featuredCount={spotlight.length} className={styles.archiveGrid}
          loadMoreLabel={t.loadMore} showLessLabel={t.showLess} showingLabel={t.showing} />
      </section>}
    </>}
    <BacklinkReferences entries={seo?.backlinks} locale={locale} />
    {!result.preview && seo?.structuredData !== false && copy.heading && <JsonLdScript data={listingJsonLd(kind, locale, nav('home'), copy.heading)} />}
  </div></main>
}

export async function PublicationDetail({ kind, params }: PublicationParams & { kind: Kind }) {
  const { locale: lang, slug } = await params, locale = localeFor(lang), t = await speechLabels(kind, locale)
  const result = await getPublications(kind), now = Date.now()
  if (result.error) throw new Error('Publication content is temporarily unavailable')
  const doc = visible(result.documents, result.preview, now).find(doc => doc.slug.current === slug)
  if (!doc) notFound()
  const title = localize(doc.title, locale), summary = localize(doc.summary, locale), images = coverImages(doc, locale)
  const seo = resolvePageSeo(doc.seo, locale), url = buildAbsoluteUrl(buildLocalizedPath(locale, `${pathFor(kind)}/${doc.slug.current}`))
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'NewsArticle', headline: title, description: summary, url,
    datePublished: doc.publishedAt, dateModified: doc._updatedAt, inLanguage: locale, audience: audienceJsonLd(kind),
    ...(doc.author && doc.authorKind ? { author: { '@type': doc.authorKind, name: localize(doc.author, locale) } } : {}),
    ...(images[0] ? { image: images[0].src } : {}),
  }
  return <main id="main-content" className={styles.page}><div className={styles.container}>
    {result.preview && <PreviewBanner locale={locale} />}
    <Link href={pathFor(kind)} className={styles.back}><ArrowLeft size={16} aria-hidden="true" />{t.allNews}</Link>
    <header className={styles.detailHeader}>
      <div className={styles.detailLabels}>{doc.category && <Link className={styles.category} href={`${pathFor(kind)}?category=${doc.category.slug.current}`}>{localize(doc.category.title, locale)}</Link>}</div>
      <h1>{title}</h1><p className={styles.detailSummary}>{summary}</p>
      <div className={styles.byline}><time dateTime={doc.publishedAt}>{publicationDate(doc.publishedAt, locale)}</time>{doc.author && <span>{localize(doc.author, locale)}</span>}<span>{t.updated} <time dateTime={doc._updatedAt}>{publicationDate(doc._updatedAt, locale)}</time></span></div>
    </header>
    {images.length > 0 && <PublicationImage images={images} priority className={styles.detailImage} sizes="(min-width: 1280px) 1040px, 100vw" />}
    <div className={styles.detailGrid}><div className={styles.articleBody}>
      <PublicationRichText blocks={localizePublicationBody(doc.body, locale)} />
      {doc.media?.length ? <section className={styles.contentSection} aria-label={t.media}><h2>{t.media}</h2>{doc.media.map(item => { const source = parsePublicationMedia(item.url); return source && <MediaPreview key={item._key} source={source} images={mediaImages(item.url, item.thumbnail, locale)} locale={locale} labels={{ play: t.play, loadInstagram: t.loadInstagram, openSource: t.openSource, unavailable: t.unavailable }} /> })}</section> : null}
      {!!doc.relatedLinks?.length && <section className={styles.contentSection}><h2>{t.sources}</h2><ul className={styles.sourceLinks}>{doc.relatedLinks.map(link => <li key={link._key}><a href={link.url}>{localize(link.label, locale)} ↗</a></li>)}</ul></section>}
    </div>
    </div>
    <div className={styles.bottomNav}><PublicationLinks locale={locale} current={pathFor(kind)} /></div>
    <BacklinkReferences entries={seo?.backlinks} locale={locale} />
    {!result.preview && seo?.structuredData !== false && <JsonLdScript data={jsonLd} />}
  </div></main>
}
