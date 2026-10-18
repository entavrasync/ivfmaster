import { buildRootJsonLd, serializeJsonLd } from '@/lib/seo/jsonLd'
import type { ClinicSettings } from '@/sanity/lib/clinic-mapping'
import type { ClinicAvailability } from '@/lib/clinic-availability'

export function StructuredData({ settings = null, availability = null }: { settings?: ClinicSettings | null; availability?: ClinicAvailability | null }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(buildRootJsonLd(settings, availability)),
      }}
    />
  )
}
