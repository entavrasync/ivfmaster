import { localizedValue } from '../../lib/localized-query'
import { defineQuery } from 'next-sanity'
import { SEO_LOCALIZED_PROJECTION } from '../../lib/seo-mapping'

/** Team-page presentation only. Doctor records use sanity/lib/clinic. */
export const teamPageQuery = defineQuery(`{
  "page": *[_type == "teamPage" && _id == "teamPage" && reviewStatus == "approved"][0]{
    hero{
      "eyebrow": ${localizedValue('eyebrow')},
      "headline": ${localizedValue('headline')},
      "lead": ${localizedValue('lead')}
    },
    doctorsSection{
      "eyebrow": ${localizedValue('eyebrow')},
      "heading": ${localizedValue('heading')},
      "lead": ${localizedValue('lead')},
      "coupleNote": ${localizedValue('coupleNote')}
    },
    careTeamSection{
      "eyebrow": ${localizedValue('eyebrow')},
      "heading": ${localizedValue('heading')},
      "lead": ${localizedValue('lead')},
      members[]{
        "name": ${localizedValue('name')},
        "role": ${localizedValue('role')},
        "blurb": ${localizedValue('blurb')},
        credentials[]{
          "text": ${localizedValue('text')},
          accent
        },
        "portrait": portrait{
          "alt": ${localizedValue('alt')},
          crop, hotspot, "assetId": asset->_id, "url": asset->url,
          "dimensions": asset->metadata.dimensions,
          "lqip": asset->metadata.lqip
        }
      }
    },
    facilitySection{
      "eyebrow": ${localizedValue('eyebrow')},
      "heading": ${localizedValue('heading')},
      "lead": ${localizedValue('lead')},
      areas[]{
        "caption": ${localizedValue('caption')},
        images[]{
          "alt": ${localizedValue('alt')},
          crop, hotspot, "assetId": asset->_id, "url": asset->url,
          "dimensions": asset->metadata.dimensions,
          "lqip": asset->metadata.lqip
        }
      }
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
      }
    },
    seo{
      "metaTitle": ${localizedValue('metaTitle')},
      "metaDescription": ${localizedValue('metaDescription')},
      ${SEO_LOCALIZED_PROJECTION},
      "ogImage": ogImage{
        "alt": ${localizedValue('alt')},
        crop, hotspot, "assetId": asset->_id, "url": asset->url,
        "dimensions": asset->metadata.dimensions,
        "lqip": asset->metadata.lqip
      },
      canonicalUrl,
      noIndex
    }
  }
}`)
