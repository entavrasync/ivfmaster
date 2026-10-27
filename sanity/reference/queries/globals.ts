import { localizedValue } from '../../lib/localized-query'
import { defineQuery } from 'next-sanity'

/** Shared presentation settings, header and footer. Literal projections preserve localized fallbacks. Protected clinic facts continue to come from the authoritative target clinic-settings reader or code, rather than these compatibility fields. */
export const globalsQuery = defineQuery(`{
  "settings": *[_type == "siteSettings" && _id == "siteSettings" && reviewStatus == "approved"][0]{
    name,
    legalName,
    "description": ${localizedValue('description')},
    siteUrl,
    address{
      streetAddress,
      addressLocality,
      addressRegion,
      postalCode,
      addressCountry
    },
    "displayAddress": ${localizedValue('displayAddress')},
    geo{placeUrl, latitude, longitude},
    contact{
      email,
      telephone,
      whatsappNumber,
      "whatsappPrefill": ${localizedValue('whatsappPrefill')}
    },
    timezone,
    hours[]{day, closed, open, close},
    "hoursSummary": ${localizedValue('hoursSummary')},
    holidays[]{
      date,
      "name": ${localizedValue('name')}
    },
    stats[]{
      value,
      suffix,
      "label": ${localizedValue('label')}
    },
    social[]{platform, url},
    defaultSeo{
      "metaTitle": ${localizedValue('metaTitle')},
      "metaDescription": ${localizedValue('metaDescription')},
      "ogImage": ogImage{
        "alt": ${localizedValue('alt')},
        crop, hotspot, "assetId": asset->_id,
        "url": asset->url,
        "dimensions": asset->metadata.dimensions,
        "lqip": asset->metadata.lqip
      },
      canonicalUrl,
      noIndex,
      "ogTitle": ${localizedValue('ogTitle')},
      "ogDescription": ${localizedValue('ogDescription')}
    }
  },
  "navigation": *[_type == "navigation" && _id == "navigation" && reviewStatus == "approved"][0]{
    items[]{
      "label": ${localizedValue('label')},
      link{kind, internalPath, externalUrl, anchor, opensInNewTab}
    },
    primaryCta{
      "label": ${localizedValue('label')},
      emphasis,
      link{kind, internalPath, externalUrl, anchor, opensInNewTab}
    },
    "mobileMenuLabel": ${localizedValue('mobileMenuLabel')}
  },
  "footer": *[_type == "footer" && _id == "footer" && reviewStatus == "approved"][0]{
    "tagline": ${localizedValue('tagline')},
    "byline": ${localizedValue('byline')},
    linkGroups[]{
      _key,
      "heading": ${localizedValue('heading')},
      items[]{
        _key,
        "label": ${localizedValue('label')},
        link{kind, internalPath, externalUrl, anchor, opensInNewTab}
      }
    },
    "contactHeading": ${localizedValue('contactHeading')},
    "languageHeading": ${localizedValue('languageHeading')},
    "copyright": ${localizedValue('copyright')},
    legalLinks[]{
      _key,
      "label": ${localizedValue('label')},
      link{kind, internalPath, externalUrl, anchor, opensInNewTab}
    }
  }
}`)
