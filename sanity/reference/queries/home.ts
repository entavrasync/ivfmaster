import { localizedValue } from '../../lib/localized-query'
import { defineQuery } from 'next-sanity'
import { SEO_LOCALIZED_PROJECTION } from '../../lib/seo-mapping'

/** Homepage presentation and selected FAQ references. Keep this literal projection aligned with site-content-mapping and the existing section components. Shared doctor identities and profile narratives remain owned by the target clinic reader. */
export const homePageQuery = defineQuery(`*[_type == "homePage" && _id == "homePage" && reviewStatus == "approved"][0]{
  hero{
    "eyebrow": ${localizedValue('eyebrow')},
    "headline": ${localizedValue('headline')},
    "subheadline": ${localizedValue('subheadline')},
    "body": ${localizedValue('body')},
    "microTrust": ${localizedValue('microTrust')},
    "desktopImage": desktopImage{
      "alt": ${localizedValue('alt')},
      crop, hotspot, "assetId": asset->_id, "url": asset->url,
      "dimensions": asset->metadata.dimensions,
      "lqip": asset->metadata.lqip
    },
    "mobileImage": mobileImage{
      "alt": ${localizedValue('alt')},
      crop, hotspot, "assetId": asset->_id, "url": asset->url,
      "dimensions": asset->metadata.dimensions,
      "lqip": asset->metadata.lqip
    },
    primaryCta{
      "label": ${localizedValue('label')},
      emphasis,
      link{kind, internalPath, externalUrl, anchor, opensInNewTab}
    },
    secondaryCta{
      "label": ${localizedValue('label')},
      emphasis,
      link{kind, internalPath, externalUrl, anchor, opensInNewTab}
    }
  },
  painRecognition{
    "eyebrow": ${localizedValue('eyebrow')},
    "headline": ${localizedValue('headline')},
    "body": ${localizedValue('body')}
  },
  painStory{
    chapters[]{
      "eyebrow": ${localizedValue('eyebrow')},
      "headline": ${localizedValue('headline')},
      "body": ${localizedValue('body')}
    }
  },
  painCta{
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
  whyTrust{
    "eyebrow": ${localizedValue('eyebrow')},
    "heading": ${localizedValue('heading')},
    "body": ${localizedValue('body')},
    cards[]{
      "label": ${localizedValue('label')},
      "worry": ${localizedValue('worry')},
      "response": ${localizedValue('response')}
    },
    "credentialNote": ${localizedValue('credentialNote')},
    credentialCitation{
      "textBefore": ${localizedValue('textBefore')},
      "textAfter": ${localizedValue('textAfter')},
      link{
        "label": ${localizedValue('label')},
        emphasis,
        link{kind, internalPath, externalUrl, anchor, opensInNewTab}
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
    }
  },
  costOfWaiting{
    "eyebrow": ${localizedValue('eyebrow')},
    narrativeLines[]{
      _key, _type,
      desktop{
        "alt": ${localizedValue('alt')},
        crop, hotspot, "assetId": asset->_id, "url": asset->url,
        "dimensions": asset->metadata.dimensions, "lqip": asset->metadata.lqip
      },
      mobile{
        "alt": ${localizedValue('alt')},
        crop, hotspot, "assetId": asset->_id, "url": asset->url,
        "dimensions": asset->metadata.dimensions, "lqip": asset->metadata.lqip
      },
      "text": ${localizedValue('@')}
    },
    hopeLines[]{
      _key, _type,
      desktop{
        "alt": ${localizedValue('alt')},
        crop, hotspot, "assetId": asset->_id, "url": asset->url,
        "dimensions": asset->metadata.dimensions, "lqip": asset->metadata.lqip
      },
      mobile{
        "alt": ${localizedValue('alt')},
        crop, hotspot, "assetId": asset->_id, "url": asset->url,
        "dimensions": asset->metadata.dimensions, "lqip": asset->metadata.lqip
      },
      "text": ${localizedValue('@')}
    },
    frames[]{
      _key,
      "desktop": desktop{
        "alt": ${localizedValue('alt')},
        crop, hotspot, "assetId": asset->_id, "url": asset->url,
        "dimensions": asset->metadata.dimensions,
        "lqip": asset->metadata.lqip
      },
      "mobile": mobile{
        "alt": ${localizedValue('alt')},
        crop, hotspot, "assetId": asset->_id, "url": asset->url,
        "dimensions": asset->metadata.dimensions,
        "lqip": asset->metadata.lqip
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
    }
  },
  understandingIvf{
    "eyebrow": ${localizedValue('eyebrow')},
    "heading": ${localizedValue('heading')},
    "body": ${localizedValue('body')},
    steps[]{
      illustrationKey,
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
      }
    }
  },
  meetTheDoctors{
    "eyebrow": ${localizedValue('eyebrow')},
    "heading": ${localizedValue('heading')},
    "body": ${localizedValue('body')},
    "coupleNote": ${localizedValue('coupleNote')},
    doctors[!defined(doctor) || doctor->reviewStatus == "approved"]{
      "slug": coalesce(doctor->slug.current, profileSlug),
      "name": ${localizedValue('doctor->name')},
      "essence": ${localizedValue('doctor->essence')},
      "intro": ${localizedValue('intro')},
      "ctaLabel": ${localizedValue('ctaLabel')},
      "storyLabel": ${localizedValue('storyLabel')},
      credentials[]{
        "text": ${localizedValue('text')},
        accent
      }
    }
  },
  mythsFacts{
    "eyebrow": ${localizedValue('eyebrow')},
    "heading": ${localizedValue('heading')},
    "body": ${localizedValue('body')},
    "referencedItems": faqReferences[]{
      "_id": select(@->reviewStatus == "approved" && @->isPublished == true && !(@->_id in path("drafts.**")) && !(@->_id in path("versions.**")) => @->_id),
      "question": select(@->reviewStatus == "approved" && @->isPublished == true => ${localizedValue('@->question')}),
      "answer": select(@->reviewStatus == "approved" && @->isPublished == true => ${localizedValue('@->answer')})
    },
    items[]{
      _key,
      "question": ${localizedValue('question')},
      "answer": ${localizedValue('answer')}
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
    }
  },
  finalCta{
    intro{
      "eyebrow": ${localizedValue('eyebrow')},
      "heading": ${localizedValue('heading')},
      "body": ${localizedValue('body')},
      "microCopy": ${localizedValue('microCopy')}
    },
    contactLabels{
      "clinic": ${localizedValue('clinic')},
      "hours": ${localizedValue('hours')},
      "reach": ${localizedValue('reach')}
    },
    whatsappCta{
      "label": ${localizedValue('label')},
      emphasis,
      link{kind, internalPath, externalUrl, anchor, opensInNewTab}
    },
    formCta{
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
}`)
