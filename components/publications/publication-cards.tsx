import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { localizePublication as localize, type PublicationDocument } from '@/sanity/lib/publication-model'
import { coverImages, publicationDate } from './publication-data'
import { PublicationImage } from './publication-image'
import { publicationLabels } from './copy'
import styles from './publication-design.module.css'

type Locale = 'en' | 'mr'
type CardVariant = 'lead' | 'brief' | 'archive'
// Both speech listings share one card system, so they keep the same structure.
const cardClasses = { lead: { card: styles.newsLead, image: styles.leadImage }, brief: { card: styles.newsBrief, image: styles.briefImage }, archive: { card: styles.archiveRow, image: styles.archiveImage } }
const imageSizes = (variant: CardVariant) => variant === 'lead' ? '(min-width: 1200px) 632px, (min-width: 900px) 55vw, 100vw' : '(min-width: 640px) 160px, 96px'
function NewsMeta({ doc, locale }: { doc: PublicationDocument; locale: Locale }) {
  const author = doc.author ? localize(doc.author, locale) : ''
  return <div className={styles.storyMeta}>
    <div className={styles.storyProvenance}>
      {author && <span className={styles.storyAuthor}>{author}</span>}
      <time dateTime={doc.publishedAt}>{publicationDate(doc.publishedAt, locale)}</time>
    </div>
    <span className={styles.readLink}>{publicationLabels[locale].read}<ArrowRight size={15} aria-hidden="true" /></span>
  </div>
}
export function NewsCard({ doc, basePath, locale, variant }: { doc: PublicationDocument; basePath: string; locale: Locale; variant: CardVariant }) {
  const title = localize(doc.title, locale), images = coverImages(doc, locale), href = `${basePath}/${doc.slug.current}`
  return <article className={cardClasses[variant].card} data-image={images.length > 0}>
    <Link href={href} className={styles.storyLink} aria-labelledby={`story-${doc._id}`}>
      {images.length > 0 && <PublicationImage images={images} priority={variant === 'lead'} className={cardClasses[variant].image} sizes={imageSizes(variant)} />}
      <div className={variant === 'lead' ? styles.newsLeadText : styles.storyContent}>
        {doc.category && <span className={styles.category}>{localize(doc.category.title, locale)}</span>}
        <h2 id={`story-${doc._id}`} className={variant === 'lead' ? styles.storyTitle : styles.briefTitle}>{title}</h2>
        <p className={styles.excerpt}>{localize(doc.summary, locale)}</p>
        <NewsMeta doc={doc} locale={locale} />
      </div>
    </Link>
  </article>
}
