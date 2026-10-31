import { ArrowRight, CalendarDays, Clock3, MapPin, Video } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { eventLifecycle, localizePublication as localize, type EventDocument, type NewsDocument } from '@/sanity/lib/publication-model'
import { parsePublicationMedia } from '@/sanity/lib/publication-media'
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
  const author = doc.author ? localize(doc.author, locale) : ''
  return <div className={styles.storyMeta}>
    <div className={styles.storyProvenance}>
      {author && <span className={styles.storyAuthor}>{author}</span>}
      <time dateTime={doc.publishedAt}>{publicationDate(doc.publishedAt, locale)}</time>
    </div>
    <span className={styles.readLink}>{publicationLabels[locale].read}<ArrowRight size={15} aria-hidden="true" /></span>
  </div>
}
export function NewsCard({ doc, locale, variant }: { doc: NewsDocument; locale: Locale; variant: 'lead' | 'brief' | 'archive' }) {
  const title = localize(doc.title, locale), images = coverImages(doc, locale), href = `/news/${doc.slug.current}`
  const imageClass = variant === 'lead' ? styles.leadImage : variant === 'brief' ? styles.briefImage : styles.archiveImage
  const cardClass = variant === 'lead' ? styles.newsLead : variant === 'brief' ? styles.newsBrief : styles.archiveRow
  return <article className={cardClass} data-image={images.length > 0}>
    <Link href={href} className={styles.storyLink} aria-labelledby={`story-${doc._id}`}>
      {images.length > 0 && <PublicationImage images={images} priority={variant === 'lead'} className={imageClass} sizes={variant === 'lead' ? '(min-width: 1200px) 632px, (min-width: 900px) 55vw, 100vw' : '(min-width: 640px) 160px, 96px'} />}
      <div className={variant === 'lead' ? styles.newsLeadText : styles.storyContent}>
        {doc.category && <span className={styles.category}>{localize(doc.category.title, locale)}</span>}
        <h2 id={`story-${doc._id}`} className={variant === 'lead' ? styles.storyTitle : styles.briefTitle}>{title}</h2>
        <p className={styles.excerpt}>{localize(doc.summary, locale)}</p>
        <NewsMeta doc={doc} locale={locale} />
      </div>
    </Link>
  </article>
}
export function EventCard({ event, locale, now, featured = false }: { event: EventDocument; locale: Locale; now: number; featured?: boolean }) {
  const t = publicationLabels[locale], images = coverImages(event, locale)
  const mode = event.attendanceMode === 'online' ? t.online : event.attendanceMode === 'hybrid' ? t.hybrid : t.inPerson
  const ModeIcon = event.attendanceMode === 'online' ? Video : MapPin
  const venue = event.attendanceMode !== 'online' && event.venue ? localize(event.venue, locale) : ''
  const hasRecording = eventLifecycle(event, now).state === 'held' && event.recordingUrl && parsePublicationMedia(event.recordingUrl)
  const href = `/events/${event.slug.current}${hasRecording ? '#event-recording' : ''}`
  const action = hasRecording ? t.recording : t.details
  return <article className={featured ? styles.eventFeature : styles.eventRow} data-image={featured && images.length > 0}>
    <Link href={href} className={styles.eventLink} aria-labelledby={`event-${event._id}`}>
      {featured && images.length > 0 && <div className={styles.eventMedia}>
        <p className={styles.featureLabel}><CalendarDays size={16} aria-hidden="true" />{t.featuredEvent}</p>
        <PublicationImage images={images} priority className={styles.eventFeatureImage} sizes="(min-width: 1200px) 384px, (min-width: 900px) 35vw, 100vw" />
      </div>}
      <div className={styles.eventEntry}>
        <DateTile event={event} locale={locale} />
        <div className={styles.eventCardContent}>
          <div className={styles.eventCardLabels}>
            <EventStatus event={event} locale={locale} now={now} />
            {event.category && <span className={styles.category}>{localize(event.category.title, locale)}</span>}
          </div>
          <h2 id={`event-${event._id}`} className={styles.briefTitle}>{localize(event.title, locale)}</h2>
          <p className={styles.excerpt}>{localize(event.summary, locale)}</p>
          <div className={styles.eventRowFoot}>
            <div className={styles.eventFact}>
              <span className={styles.eventFactLabel}><Clock3 size={15} aria-hidden="true" />{t.dates}</span>
              <EventDates event={event} locale={locale} />
            </div>
            <div className={styles.eventFact}>
              <span className={styles.eventFactLabel}><ModeIcon size={15} aria-hidden="true" />{t.location}</span>
              <p className={styles.eventVenue}>{venue || mode}</p>
              {venue && <span className={styles.attendance}>{mode}</span>}
            </div>
          </div>
          <span className={styles.readLink}>{action}<ArrowRight size={16} aria-hidden="true" /></span>
        </div>
      </div>
    </Link>
  </article>
}
