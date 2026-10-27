import { localizedValue } from '../../lib/localized-query'
import { defineQuery } from 'next-sanity'
import { SEO_LOCALIZED_PROJECTION } from '../../lib/seo-mapping'

/** Listing-page presentation only. Treatment records use sanity/lib/procedures. */
export const proceduresHubQuery = defineQuery(`{
  "page": *[_type == "proceduresPage" && _id == "proceduresPage" && reviewStatus == "approved"][0]{
    hero{
      "eyebrow": ${localizedValue('eyebrow')},
      "heading": ${localizedValue('heading')},
      "body": ${localizedValue('body')}
    },
    closing{
      "eyebrow": ${localizedValue('eyebrow')},
      "heading": ${localizedValue('heading')},
      "body": ${localizedValue('body')},
      "microCopy": ${localizedValue('microCopy')},
      primary{
        "label": ${localizedValue('label')},
        emphasis,
        link{kind, internalPath, externalUrl, anchor, opensInNewTab}
      },
      secondary{
        "label": ${localizedValue('label')},
        emphasis,
        link{kind, internalPath, externalUrl, anchor, opensInNewTab}
      }
    },
    seo{
      "metaTitle": ${localizedValue('metaTitle')},
      "metaDescription": ${localizedValue('metaDescription')},
      ${SEO_LOCALIZED_PROJECTION},
      "ogImage": ogImage{
        "alt": ${localizedValue('alt')},
        crop, hotspot, "assetId": asset->_id,
        "url": asset->url,
        "dimensions": asset->metadata.dimensions,
        "lqip": asset->metadata.lqip
      },
      canonicalUrl,
      noIndex
    }
  }
}`)
