import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DraftPreview } from './draft-preview'
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, MapPin, Newspaper } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { buildAbsoluteUrl, buildLocalizedPath } from '@/lib/seo/routes'
import { getPublications } from '@/sanity/lib/publications'
import { getSeoContext, getSiteContent } from '@/sanity/lib/site-content'
import { resolveSiteChrome } from '@/sanity/lib/site-content-mapping'
import { BacklinkReferences } from '@/components/SEO/BacklinkReferences'
import { resolvePageSeo } from '@/sanity/lib/seo-mapping'
import { eventLifecycle, localizePublication as localize, localizePublicationBody, type PublicationDocument, type EventDocument } from '@/sanity/lib/publication-model'
import { parsePublicationMedia } from '@/sanity/lib/publication-media'
import { JsonLdScript } from '@/components/SEO/StructuredData'
import { publicationLabels } from './copy'
import { coverImages, mediaImages, publicationDate, publicationImage } from './publication-data'
import { PublicationImage } from './publication-image'
import { PublicationRichText } from './rich-text'
import { MediaPreview } from './media-preview'
import { EventRefresh } from './event-refresh'
import { NewsCard, EventCard, EventDates, EventStatus } from './publication-cards'
import { CategoryFilter } from './category-filter'
import { orderPublications } from './listing-order'
import styles from './publication-design.module.css'

type Kind = 'news' | 'event'
export type PublicationParams = { params: Promise<{ locale: string; slug?: string }> }
export type PublicationSearch = Promise<Record<string, string | string[] | undefined>>
const localeFor = (locale: string) => locale === 'en' ? 'en' as const : 'mr' as const
const pathFor = (kind: Kind) => kind === 'news' ? '/news' : '/events'
function visible(docs: PublicationDocument[], preview: boolean, now: number) {
  return docs.filter(doc => doc._type !== 'news' || preview || Date.parse(doc.publishedAt) <= now)
}
function PreviewBanner({ locale }: { locale: 'en' | 'mr' }) {
  const t = publicationLabels[locale]
  return <><aside className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-navy p-4 text-sm text-white"><span>{t.preview}</span><form action="/api/draft-mode/disable" method="post"><button className="rounded-lg border border-white/60 px-3 py-2">{t.exit}</button></form></aside><DraftPreview /></>
}
async function PublicationLinks({ locale, current }: { locale: 'en' | 'mr'; current?: string }) {
  const t = publicationLabels[locale]
  const navigation = resolveSiteChrome((await getSiteContent(locale)).globals).navigation
  const links = navigation?.find(item => item.children?.some(child => child.href === '/news' || child.href === '/events'))?.children
  if (!links?.length) return null
  return <nav aria-label={t.browse} className={styles.sectionNav}>{links.map(link => <Link key={link.key} href={link.href} aria-current={current === link.href ? 'page' : undefined} target={link.opensInNewTab ? '_blank' : undefined} rel={link.opensInNewTab ? 'noopener noreferrer' : undefined}>{link.label}</Link>)}</nav>
}
export async function publicationMetadata(kind: Kind, props: PublicationParams, search?: PublicationSearch): Promise<Metadata> {
  const { locale: lang, slug } = await props.params, locale = localeFor(lang), t = publicationLabels[locale]
  const result = await getPublications(kind), now = Date.now()
  const doc = slug ? visible(result.documents, result.preview, now).find(doc => doc.slug.current === slug) : undefined
  if (slug && !doc) return { title: 'Content unavailable', robots: { index: false, follow: true } }
  const context = await getSeoContext(locale), seo = doc ? resolvePageSeo(doc.seo, locale) : undefined
  const cover = doc ? coverImages(doc, locale)[0] : undefined
  const metadata = buildPageMetadata({ ...context, locale, path: pathFor(kind) + (slug ? `/${slug}` : ''),
    title: doc ? localize(doc.title, locale) : kind === 'news' ? t.news : t.events,
    description: doc ? localize(doc.summary, locale) : kind === 'news' ? t.newsIntro : t.eventsIntro,
    type: kind === 'news' && doc ? 'article' : 'website', publishedTime: doc?._type === 'news' ? doc.publishedAt : undefined,
    seo: doc ? { noIndex: false, noFollow: false, structuredData: true, ...(cover ? { ogImage: { url: cover.src, width: cover.width ?? 1200, height: cover.height ?? 675, alt: cover.alt } } : {}), ...seo } : undefined,
  })
  if (doc?._type === 'news' && metadata.openGraph && 'type' in metadata.openGraph && metadata.openGraph.type === 'article') metadata.openGraph.modifiedTime = doc._updatedAt
  const query = search ? await search : {}
  if (result.preview || result.error || Object.keys(query).length) metadata.robots = { index: false, follow: !result.preview }
  return metadata
}
export async function PublicationListing({ kind, params, searchParams }: PublicationParams & { kind: Kind; searchParams: PublicationSearch }) {
  const { locale: lang } = await params, locale = localeFor(lang), t = publicationLabels[locale]
  const result = await getPublications(kind), query = await searchParams, now = Date.now()
  const docs = visible(result.documents, result.preview, now)
  const category = typeof query.category === 'string' ? query.category : '', group = query.view === 'past' ? 'past' : 'upcoming'
  const categories = [...new Map(docs.filter(doc => doc.category).map(doc => [doc.category!.slug.current, doc.category!])).values()]
    .sort((a, b) => localize(a.title, locale).localeCompare(localize(b.title, locale), locale))
  const matchingCategory = docs.filter(doc => !category || doc.category?.slug.current === category)
  const filtered = orderPublications(matchingCategory.filter(doc => doc._type !== 'event' || eventLifecycle(doc, now).group === group), group, now)
  const pageCount = Math.max(1, Math.ceil(filtered.length / 12)), parsed = typeof query.page === 'string' && /^\d+$/.test(query.page) ? Number(query.page) : 1
  const page = Math.min(pageCount, Math.max(1, parsed))
  const eligibleLead = filtered.filter(doc => doc._type === 'news' || group === 'upcoming' && doc.status === 'scheduled')
  const selectedLead = !category ? eligibleLead.find(doc => doc.featured) ?? eligibleLead[0] : undefined
  const lead = page === 1 ? selectedLead : undefined
  const ordered = selectedLead ? [selectedLead, ...filtered.filter(doc => doc._id !== selectedLead._id)] : filtered
  const slice = ordered.slice((page - 1) * 12, page * 12)
  const spotlight = kind === 'news' && page === 1 && !category ? slice.slice(0, 3) : []
  const remaining = kind === 'news' ? slice.filter(doc => !spotlight.some(item => item._id === doc._id)) : lead ? slice.filter(doc => doc._id !== lead._id) : slice
  const href = (changes: { category?: string; view?: string; page?: number }) => {
    const values = { category, view: kind === 'event' ? group : '', page: 1, ...changes }, query = new URLSearchParams()
    if (values.category) query.set('category', values.category)
    if (values.view === 'past') query.set('view', 'past')
    if (values.page > 1) query.set('page', String(values.page))
    return pathFor(kind) + (query.size ? `?${query}` : '')
  }
  const boundaries = docs.flatMap(doc => doc._type === 'event' ? [eventLifecycle(doc, now).nextBoundary].filter((value): value is number => value != null) : Date.parse(doc.publishedAt) > now ? [Date.parse(doc.publishedAt)] : [])
  const upcomingCount = matchingCategory.filter(doc => doc._type === 'event' && eventLifecycle(doc, now).group === 'upcoming').length
  const pastCount = matchingCategory.filter(doc => doc._type === 'event' && eventLifecycle(doc, now).group === 'past').length
  const filterOptions = [{ value: '', label: t.all, href: href({ category: '' }) }, ...categories.map(cat => ({ value: cat.slug.current, label: localize(cat.title, locale), href: href({ category: cat.slug.current }) }))]
  if (category && !filterOptions.some(option => option.value === category)) filterOptions.push({ value: category, label: t.noCategory, href: href({ category }) })
  const emptyTitle = result.error ? t.error : category ? t.noCategory : kind === 'event' ? group === 'upcoming' ? t.noUpcoming : t.noPast : t.empty
  return <main id="main-content" className={styles.page}><div className={styles.container}>
    {result.preview && <PreviewBanner locale={locale} />}<EventRefresh boundary={boundaries.length ? Math.min(...boundaries) : null} />
    <header className={styles.masthead}>
      <div><h1>{kind === 'news' ? t.newsTitle : t.eventsTitle}</h1><p className={styles.intro}>{kind === 'news' ? t.newsIntro : t.eventsIntro}</p></div>
      <PublicationLinks locale={locale} current={pathFor(kind)} />
    </header>
    <div className={styles.toolbar}>
      {kind === 'event' && <nav aria-label={t.eventViews} className={styles.eventTabs}>{(['upcoming', 'past'] as const).map(view => <Link key={view} href={href({ view })} scroll={false} aria-current={group === view ? 'page' : undefined}>{t[view]}<span>{view === 'upcoming' ? upcomingCount : pastCount}</span></Link>)}</nav>}
      <CategoryFilter value={category} options={filterOptions} label={t.categoryFilter} pendingLabel={t.filtering} />
      {category && <Link href={href({ category: '' })} scroll={false} className={styles.clearFilter}>{t.clear}</Link>}
      <span className={styles.resultCount} role="status">{filtered.length} {kind === 'news' ? filtered.length === 1 ? t.story : t.stories : filtered.length === 1 ? t.eventLabel : t.eventsLabel}</span>
    </div>
    {result.error || !filtered.length ? <div role="status" className={styles.empty}>
      <div className={styles.emptyIcon}>{kind === 'news' ? <Newspaper size={25} aria-hidden="true" /> : <CalendarDays size={25} aria-hidden="true" />}</div>
      <div><h2>{emptyTitle}</h2><p>{result.error ? t.errorBody : category ? t.noCategoryBody : t.emptyBody}</p>{category ? <Link href={href({ category: '' })} className={styles.emptyAction}>{t.clear}</Link> : kind === 'event' && !result.error && <Link href={href({ view: group === 'past' ? 'upcoming' : 'past' })} className={styles.emptyAction}>{group === 'past' ? t.viewUpcoming : t.viewPast}<ArrowRight size={16} /></Link>}</div>
    </div> : <>
      {spotlight.length > 0 && <section aria-label={t.featured} className={styles.newsSpotlight} data-single={spotlight.length === 1}>
        {spotlight[0]._type === 'news' && <NewsCard doc={spotlight[0]} locale={locale} variant="lead" />}
        {spotlight.length > 1 && <div className={styles.newsRail}>{spotlight.slice(1).map(doc => doc._type === 'news' && <NewsCard key={doc._id} doc={doc} locale={locale} variant="brief" />)}</div>}
      </section>}
      {kind === 'event' && lead?._type === 'event' && <section aria-label={t.featured}><EventCard event={lead} locale={locale} now={now} featured /></section>}
      {remaining.length > 0 && <section className={kind === 'news' ? styles.archive : styles.agenda} aria-label={kind === 'news' ? t.latest : t[group]}>
        <div className={styles.sectionHeading}><h2>{kind === 'news' ? spotlight.length ? t.moreNews : t.allNews : t[group]}</h2></div>
        <div className={kind === 'news' ? styles.archiveGrid : undefined}>{remaining.map(doc => doc._type === 'news' ? <NewsCard key={doc._id} doc={doc} locale={locale} variant="archive" /> : <EventCard key={doc._id} event={doc} locale={locale} now={now} />)}</div>
      </section>}
      {pageCount > 1 && <nav aria-label={t.pagination} className={styles.pagination}>{page > 1 ? <Link href={href({ page: page - 1 })}><ArrowLeft size={14} />{t.previous}</Link> : <span />}<span>{t.page} {page} {t.of} {pageCount}</span>{page < pageCount ? <Link href={href({ page: page + 1 })}>{t.next}<ArrowRight size={14} /></Link> : <span />}</nav>}
    </>}
  </div></main>
}

function EventInformation({ doc, locale, now }: { doc: EventDocument; locale: 'en' | 'mr'; now: number }) {
  const t = publicationLabels[locale], lifecycle = eventLifecycle(doc, now)
  const notice = doc.status === 'cancelled' ? t.cancelledNotice : doc.status === 'postponed' ? t.postponedNotice : lifecycle.group === 'past' ? t.pastNotice : null
  return <aside className={styles.detailFacts} aria-label={t.details}>
    <h2>{t.details}</h2>
    {notice && <p className={styles.eventNotice} data-state={doc.status}>{notice}</p>}
    <div className={styles.fact}><div className={styles.factLabel}><Clock3 size={16} aria-hidden="true" />{t.dates}</div><EventDates event={doc} locale={locale} /></div>
    <div className={styles.fact}><div className={styles.factLabel}><MapPin size={16} aria-hidden="true" />{doc.attendanceMode === 'online' ? t.online : doc.attendanceMode === 'hybrid' ? t.hybrid : t.venue}</div>{doc.attendanceMode !== 'online' && doc.venue && <p>{localize(doc.venue, locale)}</p>}</div>
    {lifecycle.canRegister && doc.registrationUrl && <a href={doc.registrationUrl} className={styles.primaryAction}>{t.register}<ArrowRight size={16} aria-hidden="true" /></a>}
    {lifecycle.canRegister && doc.onlineUrl && <a href={doc.onlineUrl} className={doc.registrationUrl ? styles.secondaryAction : styles.primaryAction}>{t.attend}<ArrowRight size={16} aria-hidden="true" /></a>}
    {lifecycle.group === 'past' && doc.recordingUrl && <a href="#event-recording" className={styles.primaryAction}>{t.recording}<ArrowRight size={16} aria-hidden="true" /></a>}
    {lifecycle.group === 'past' && doc.recap && <a href="#event-recap" className={styles.secondaryAction}>{t.recap}<ArrowRight size={16} aria-hidden="true" /></a>}
  </aside>
}

export async function PublicationDetail({ kind, params }: PublicationParams & { kind: Kind }) {
  const { locale: lang, slug } = await params, locale = localeFor(lang), t = publicationLabels[locale]
  const result = await getPublications(kind), now = Date.now()
  if (result.error) throw new Error('Publication content is temporarily unavailable')
  const doc = visible(result.documents, result.preview, now).find(doc => doc.slug.current === slug)
  if (!doc) notFound()
  const title = localize(doc.title, locale), summary = localize(doc.summary, locale), images = coverImages(doc, locale)
  const lifecycle = doc._type === 'event' ? eventLifecycle(doc, now) : null
  const seo = resolvePageSeo(doc.seo, locale), url = buildAbsoluteUrl(buildLocalizedPath(locale, `${pathFor(kind)}/${doc.slug.current}`))
  const jsonLd = doc._type === 'news' ? {
    '@context': 'https://schema.org', '@type': 'NewsArticle', headline: title, description: summary, url,
    datePublished: doc.publishedAt, dateModified: doc._updatedAt, inLanguage: locale,
    ...(doc.author && doc.authorKind ? { author: { '@type': doc.authorKind, name: localize(doc.author, locale) } } : {}),
    ...(images[0] ? { image: images[0].src } : {}),
  } : {
    '@context': 'https://schema.org', '@type': 'Event', name: title, description: summary, url,
    ...(doc.status !== 'postponed' ? { startDate: doc.startAt, endDate: doc.endAt } : { previousStartDate: doc.startAt }),
    ...(lifecycle?.state !== 'held' ? { eventStatus: `https://schema.org/${doc.status === 'cancelled' ? 'EventCancelled' : doc.status === 'postponed' ? 'EventPostponed' : 'EventScheduled'}` } : {}),
    eventAttendanceMode: `https://schema.org/${doc.attendanceMode === 'online' ? 'OnlineEventAttendanceMode' : doc.attendanceMode === 'hybrid' ? 'MixedEventAttendanceMode' : 'OfflineEventAttendanceMode'}`,
    location: [...(doc.attendanceMode !== 'online' && doc.venue ? [{ '@type': 'Place', name: localize(doc.venue, locale), address: localize(doc.venue, locale) }] : []), ...(doc.attendanceMode !== 'inPerson' && doc.onlineUrl ? [{ '@type': 'VirtualLocation', url: doc.onlineUrl }] : [])],
    ...(images[0] ? { image: images[0].src } : {}),
  }
  return <main id="main-content" className={styles.page}><div className={styles.container}>
    {result.preview && <PreviewBanner locale={locale} />}{lifecycle && <EventRefresh boundary={lifecycle.nextBoundary} />}
    <Link href={pathFor(kind) + (lifecycle?.group === 'past' ? '?view=past' : '')} className={styles.back}><ArrowLeft size={16} aria-hidden="true" />{kind === 'news' ? t.allNews : lifecycle?.group === 'past' ? t.past : t.upcoming}</Link>
    <header className={styles.detailHeader}>
      <div className={styles.detailLabels}>{doc.category && <Link className={styles.category} href={`${pathFor(kind)}?category=${doc.category.slug.current}${lifecycle?.group === 'past' ? '&view=past' : ''}`}>{localize(doc.category.title, locale)}</Link>}{doc._type === 'event' && <EventStatus event={doc} locale={locale} now={now} />}</div>
      <h1>{title}</h1><p className={styles.detailSummary}>{summary}</p>
      {doc._type === 'news' && <div className={styles.byline}><time dateTime={doc.publishedAt}>{publicationDate(doc.publishedAt, locale)}</time>{doc.author && <span>{localize(doc.author, locale)}</span>}<span>{t.updated} <time dateTime={doc._updatedAt}>{publicationDate(doc._updatedAt, locale)}</time></span></div>}
    </header>
    {doc._type === 'event' ? <div className={styles.eventOverview} data-image={images.length > 0}>
      <EventInformation doc={doc} locale={locale} now={now} />
      {images.length > 0 && <PublicationImage images={images} priority className={styles.detailImage} sizes="(min-width: 1000px) 700px, 100vw" />}
    </div> : images.length > 0 && <PublicationImage images={images} priority className={styles.detailImage} sizes="(min-width: 1280px) 1040px, 100vw" />}
    <div className={styles.detailGrid}><div className={styles.articleBody}>
      {doc._type === 'event' && <h2 className={styles.bodyHeading}>{t.aboutEvent}</h2>}
      <PublicationRichText blocks={localizePublicationBody(doc.body, locale)} />
      {doc.media?.length ? <section className={styles.contentSection} aria-label={t.media}><h2>{t.media}</h2>{doc.media.map(item => { const source = parsePublicationMedia(item.url); return source && <MediaPreview key={item._key} source={source} images={mediaImages(item.url, item.thumbnail, locale)} locale={locale} /> })}</section> : null}
      {doc._type === 'news' && !!doc.relatedLinks?.length && <section className={styles.contentSection}><h2>{t.sources}</h2><ul className={styles.sourceLinks}>{doc.relatedLinks.map(link => <li key={link._key}><a href={link.url}>{localize(link.label, locale)} ↗</a></li>)}</ul></section>}
      {doc._type === 'event' && lifecycle?.group === 'past' && <>
        {doc.recap && <section id="event-recap" className={styles.contentSection}><h2>{t.recap}</h2><PublicationRichText blocks={localizePublicationBody(doc.recap, locale)} /></section>}
        {doc.recordingUrl && (() => { const source = parsePublicationMedia(doc.recordingUrl); return source && <section id="event-recording" className={styles.contentSection}><h2>{t.recording}</h2><MediaPreview source={source} images={mediaImages(doc.recordingUrl, null, locale)} locale={locale} /></section> })()}
        {!!doc.gallery?.length && <section className={styles.contentSection}><h2>{t.gallery}</h2><div className="grid gap-4 sm:grid-cols-2">{doc.gallery.map((image, index) => <PublicationImage key={index} images={publicationImage(image, locale)} className="aspect-[4/3] rounded-lg" />)}</div></section>}
      </>}
    </div>
    </div>
    <div className={styles.bottomNav}><PublicationLinks locale={locale} current={pathFor(kind)} /></div>
    <BacklinkReferences entries={seo?.backlinks} locale={locale} />
    {!result.preview && seo?.structuredData !== false && <JsonLdScript data={jsonLd} />}
  </div></main>
}
