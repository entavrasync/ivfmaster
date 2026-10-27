import { localizedValue } from '../../lib/localized-query'
import { defineQuery } from 'next-sanity'
import { SEO_LOCALIZED_PROJECTION } from '../../lib/seo-mapping'

/** About-page presentation. Chapters retain their own narrative and resolve a shared doctor reference or existing profile slug. Static artwork and the target doctor reader preserve the existing portraits and identities. */
export const aboutPageQuery = defineQuery(`*[_type == "aboutPage" && _id == "aboutPage" && reviewStatus == "approved"][0]{
  hero{
    "eyebrow": ${localizedValue('eyebrow')},
    "title": ${localizedValue('title')},
    "body": ${localizedValue('body')},
    "primaryCtaLabel": ${localizedValue('primaryCtaLabel')},
    "secondaryCtaLabel": ${localizedValue('secondaryCtaLabel')}
  },
  origin{
    "eyebrow": ${localizedValue('eyebrow')},
    "title": ${localizedValue('title')},
    "paragraphs": paragraphs[]{
      "text": ${localizedValue('@')}
    },
    "quote": ${localizedValue('quote')},
    "note": ${localizedValue('note')}
  },
  care{
    "eyebrow": ${localizedValue('eyebrow')},
    "title": ${localizedValue('title')},
    "intro": ${localizedValue('intro')},
    steps[]{
      "title": ${localizedValue('title')},
      "body": ${localizedValue('body')}
    }
  },
  doctorsSection{
    "eyebrow": ${localizedValue('eyebrow')},
    chapters[!defined(doctor) || doctor->reviewStatus == "approved"]{
      "slug": coalesce(doctor->slug.current, profileSlug),
      "name": ${localizedValue('doctor->name')},
      "role": ${localizedValue('doctor->title')},
      "pullQuote": ${localizedValue('pullQuote')},
      "paragraphs": paragraphs[]{
        "text": ${localizedValue('@')}
      },
      "evidence": ${localizedValue('evidence')},
      "ctaLabel": ${localizedValue('ctaLabel')}
    }
  },
  team{
    "eyebrow": ${localizedValue('eyebrow')},
    "title": ${localizedValue('title')},
    "intro": ${localizedValue('intro')},
    moments[]{
      "title": ${localizedValue('title')},
      "body": ${localizedValue('body')}
    }
  },
  trust{
    "eyebrow": ${localizedValue('eyebrow')},
    "title": ${localizedValue('title')},
    "intro": ${localizedValue('intro')},
    points[]{
      "label": ${localizedValue('label')},
      "title": ${localizedValue('title')},
      "body": ${localizedValue('body')}
    }
  },
  closing{
    "eyebrow": ${localizedValue('eyebrow')},
    "title": ${localizedValue('title')},
    "body": ${localizedValue('body')},
    "primaryCtaLabel": ${localizedValue('primaryCtaLabel')},
    "secondaryCtaLabel": ${localizedValue('secondaryCtaLabel')}
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
}`)
