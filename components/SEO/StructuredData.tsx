import { getTranslations } from 'next-intl/server'
import { buildPageJsonLd, buildRootJsonLd, serializeJsonLd, type JsonLdValue } from '@/lib/seo/jsonLd'
import { buildAbsoluteUrl } from '@/lib/seo/routes'
import type { ClinicSettings } from '@/sanity/lib/clinic-mapping'
import type { ClinicAvailability } from '@/lib/clinic-availability'
import { getSeoContext } from '@/sanity/lib/site-content'

export function StructuredData({ settings = null, availability = null }: { settings?: ClinicSettings | null; availability?: ClinicAvailability | null }) {
  return <JsonLdScript data={buildRootJsonLd(settings, availability)} />
}

export function JsonLdScript({ data }: { data: JsonLdValue | object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
}

type Section = 'about' | 'team' | 'contact' | 'procedures' | 'educateIVF'
const SECTION_PATHS: Record<Section, string> = { about: '/about', team: '/team', contact: '/contact', procedures: '/procedures', educateIVF: '/educate-ivf' }

export const pageLocale = (locale: string) => (locale === 'en' ? 'en' : 'mr') as 'en' | 'mr'

/** Absolute URL for an image path, for structured data. */
export const absoluteImage = (src?: string) => (src ? (/^https?:\/\//.test(src) ? src : buildAbsoluteUrl(src)) : undefined)

/** Home › section › optional page, using the navigation's own labels. */
export async function breadcrumbTrail(locale: string, section: Section, leaf?: { name: string; path: string }) {
  const t = await getTranslations({ locale, namespace: 'Nav' })
  return [{ name: t('home'), path: '/' }, { name: t(section), path: SECTION_PATHS[section] }, ...(leaf ? [leaf] : [])]
}

/** Breadcrumb markup for a section page, unless its editor turned schema markup off. */
export async function SectionJsonLd({ locale, section, seoPage }: { locale: string; section: Section; seoPage?: 'about' | 'team' | 'contact' | 'procedures' }) {
  const { seo } = await getSeoContext(locale, seoPage)
  if (seo?.structuredData === false) return null
  return <JsonLdScript data={buildPageJsonLd(pageLocale(locale), await breadcrumbTrail(locale, section))} />
}
