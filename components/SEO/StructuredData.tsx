import { buildRootJsonLd, serializeJsonLd } from '@/lib/seo/jsonLd'

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(buildRootJsonLd()),
      }}
    />
  )
}
