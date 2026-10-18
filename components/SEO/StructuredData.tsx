import { buildRootJsonLd, serializeJsonLd } from '@/lib/seo/jsonLd'
import type { ClinicSettings } from '@/sanity/lib/clinic-mapping'

export function StructuredData({ settings = null }: { settings?: ClinicSettings | null }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(buildRootJsonLd(settings)),
      }}
    />
  )
}
