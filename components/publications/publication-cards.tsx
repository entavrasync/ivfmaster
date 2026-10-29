import { ArrowRight, CalendarDays, MapPin, Video } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { eventLifecycle, localizePublication as localize, type EventDocument, type NewsDocument } from '@/sanity/lib/publication-model'
import { coverImages, publicationDate } from './publication-data'
import { PublicationImage } from './publication-image'
import { publicationLabels } from './copy'
import styles from './publication-design.module.css'

type Locale = 'en' | 'mr'
export function EventStatus({ event, locale, now }: { event: EventDocument; locale: Locale; now: number }) {
  const state = eventLifecycle(event, now).state
  return <span className={styles.status} data-state={state}>{publicationLabels[locale][state]}</span>
}
export function EventDates({ event, locale }: { event: EventDocument; locale: Locale }) {
  const t = publicationLabels[locale]
  const language = locale === 'mr' ? 'mr-IN' : 'en-IN', start = new Date(event.startAt), end = new Date(event.endAt)
  const day = new Intl.DateTimeFormat(language, { timeZone: event.timezone, weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  const time = new Intl.DateTimeFormat(language, { timeZone: event.timezone, hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })
  const sameDay = day.format(start) === day.format(end)
  return <div className={styles.eventDates}>
    {event.status === 'postponed' && <p><strong>{t.newDate}</strong></p>}
    <div className={event.status === 'postponed' ? styles.previousDate : undefined}>
      {event.status === 'postponed' && <span>{t.originalDate}: </span>}
      <p><time dateTime={event.startAt}>{day.format(start)}</time>{!sameDay && <> – <time dateTime={event.endAt}>{day.format(end)}</time></>}</p>
      <p>{time.formatRange(start, end)}</p>
    </div>
  </div>
}
export function DateTile({ event, locale }: { event: EventDocument; locale: Locale }) {
  const date = new Date(event.startAt), options = { timeZone: event.timezone }
  if (event.status === 'postponed') return <div className={`${styles.dateTile} ${styles.datePending}`} aria-hidden="true"><CalendarDays size={23} /><span>{publicationLabels[locale].datePending}</span></div>
  return <div className={styles.dateTile} aria-hidden="true"><strong>{new Intl.DateTimeFormat(locale, { ...options, day: '2-digit' }).format(date)}</strong><span>{new Intl.DateTimeFormat(locale, { ...options, month: 'short', year: 'numeric' }).format(date)}</span></div>
}
function NewsMeta({ doc, locale }: { doc: NewsDocument; locale: Locale }) {
  return <div className={styles.storyMeta}><time dateTime={doc.publishedAt}>{publicationDate(doc.publishedAt, locale)}</time><span className={styles.readLink}>{publicationLabels[locale].read}<ArrowRight size={15} aria-hidden="true" /></span></div>
}
export function NewsCard({ doc, locale, variant }: { doc: NewsDocument; locale: Locale; variant: 'lead' | 'brief' | 'archive' }) {
  const title = localize(doc.title, locale), images = coverImages(doc, locale), href = `/news/${doc.slug.current}`
  const imageClass = variant === 'lead' ? styles.leadImage : variant === 'brief' ? styles.briefImage : styles.archiveImage
  const cardClass = variant === 'lead' ? styles.newsLead : variant === 'brief' ? styles.newsBrief : styles.archiveRow
  return <article className={cardClass} data-image={images.length > 0}><Link href={href} className={styles.storyLink} aria-labelledby={`story-${doc._id}`}>
    {images.length > 0 && <PublicationImage images={images} priority={variant === 'lead'} className={imageClass} sizes={variant === 'lead' ? '(min-width: 760px) 650px, 100vw' : '128px'} />}
    <div className={variant === 'lead' ? styles.newsLeadText : undefined}>
      {doc.category && <span className={styles.category}>{localize(doc.category.title, locale)}</span>}
      <h2 id={`story-${doc._id}`} className={variant === 'lead' ? styles.storyTitle : styles.briefTitle}>{title}</h2>
      <p className={styles.excerpt}>{localize(doc.summary, locale)}</p>
      <NewsMeta doc={doc} locale={locale} />
    </div>
  </Link></article>
}
export function EventCard({ event, locale, now, featured = false }: { event: EventDocument; locale: Locale; now: number; featured?: boolean }) {
  const t = publicationLabels[locale], href = `/events/${event.slug.current}`, images = coverImages(event, locale)
  const mode = event.attendanceMode === 'online' ? t.online : event.attendanceMode === 'hybrid' ? t.hybrid : t.inPerson
  const ModeIcon = event.attendanceMode === 'online' ? Video : MapPin
  return <article className={featured ? styles.eventFeature : styles.eventRow} data-image={featured && images.length > 0}>
    <Link href={href} className={styles.eventLink} aria-labelledby={`event-${event._id}`}>
    <DateTile event={event} locale={locale} />
    <div className={styles.eventCardContent}>
      <div className={styles.eventCardLabels}><EventStatus event={event} locale={locale} now={now} />{event.category && <span className={styles.category}>{localize(event.category.title, locale)}</span>}</div>
      <h2 id={`event-${event._id}`} className={styles.briefTitle}>{localize(event.title, locale)}</h2>
      <p className={styles.excerpt}>{localize(event.summary, locale)}</p>
      <div className={styles.eventRowFoot}><EventDates event={event} locale={locale} /><span className={styles.attendance}><ModeIcon size={15} aria-hidden="true" />{mode}</span></div>
      <span className={styles.readLink}>{t.details}<ArrowRight size={16} aria-hidden="true" /></span>
    </div>
    {featured && images.length > 0 && <PublicationImage images={images} priority className={styles.eventFeatureImage} sizes="(min-width: 1000px) 320px, (min-width: 760px) 240px, 0px" />}
    </Link>
  </article>
}
