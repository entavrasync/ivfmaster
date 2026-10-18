import { defineQuery } from 'next-sanity'

/** Shared presentation settings, header and footer. Literal projections preserve localized fallbacks. Protected clinic facts continue to come from the authoritative target clinic-settings reader or code, rather than these compatibility fields. */
export const globalsQuery = defineQuery(`{
  "settings": *[_type == "siteSettings" && _id == "siteSettings" && reviewStatus == "approved"][0]{
    name,
    legalName,
    "description": select($locale == "en" => coalesce(description.en, description.mr), coalesce(description.mr, description.en)),
    siteUrl,
    address{
      streetAddress,
      addressLocality,
      addressRegion,
      postalCode,
      addressCountry
    },
    "displayAddress": select($locale == "en" => coalesce(displayAddress.en, displayAddress.mr), coalesce(displayAddress.mr, displayAddress.en)),
    geo{placeUrl, latitude, longitude},
    contact{
      email,
      telephone,
      whatsappNumber,
      "whatsappPrefill": select($locale == "en" => coalesce(whatsappPrefill.en, whatsappPrefill.mr), coalesce(whatsappPrefill.mr, whatsappPrefill.en))
    },
    timezone,
    hours[]{day, closed, open, close},
    "hoursSummary": select($locale == "en" => coalesce(hoursSummary.en, hoursSummary.mr), coalesce(hoursSummary.mr, hoursSummary.en)),
    holidays[]{
      date,
      "name": select($locale == "en" => coalesce(name.en, name.mr), coalesce(name.mr, name.en))
    },
    stats[]{
      value,
      suffix,
      "label": select($locale == "en" => coalesce(label.en, label.mr), coalesce(label.mr, label.en))
    },
    social[]{platform, url},
    defaultSeo{
      "metaTitle": select($locale == "en" => coalesce(metaTitle.en, metaTitle.mr), coalesce(metaTitle.mr, metaTitle.en)),
      "metaDescription": select($locale == "en" => coalesce(metaDescription.en, metaDescription.mr), coalesce(metaDescription.mr, metaDescription.en)),
      "ogImage": ogImage{
        "alt": select($locale == "en" => coalesce(alt.en, alt.mr), coalesce(alt.mr, alt.en)),
        "url": asset->url,
        "dimensions": asset->metadata.dimensions,
        "lqip": asset->metadata.lqip
      },
      canonicalUrl,
      noIndex,
      "ogTitle": select($locale == "en" => coalesce(ogTitle.en, ogTitle.mr), coalesce(ogTitle.mr, ogTitle.en)),
      "ogDescription": select($locale == "en" => coalesce(ogDescription.en, ogDescription.mr), coalesce(ogDescription.mr, ogDescription.en))
    }
  },
  "navigation": *[_type == "navigation" && _id == "navigation" && reviewStatus == "approved"][0]{
    items[]{
      "label": select($locale == "en" => coalesce(label.en, label.mr), coalesce(label.mr, label.en)),
      link{kind, internalPath, externalUrl, anchor, opensInNewTab}
    },
    primaryCta{
      "label": select($locale == "en" => coalesce(label.en, label.mr), coalesce(label.mr, label.en)),
      emphasis,
      link{kind, internalPath, externalUrl, anchor, opensInNewTab}
    },
    "mobileMenuLabel": select($locale == "en" => coalesce(mobileMenuLabel.en, mobileMenuLabel.mr), coalesce(mobileMenuLabel.mr, mobileMenuLabel.en))
  },
  "footer": *[_type == "footer" && _id == "footer" && reviewStatus == "approved"][0]{
    "tagline": select($locale == "en" => coalesce(tagline.en, tagline.mr), coalesce(tagline.mr, tagline.en)),
    "byline": select($locale == "en" => coalesce(byline.en, byline.mr), coalesce(byline.mr, byline.en)),
    linkGroups[]{
      "heading": select($locale == "en" => coalesce(heading.en, heading.mr), coalesce(heading.mr, heading.en)),
      items[]{
        "label": select($locale == "en" => coalesce(label.en, label.mr), coalesce(label.mr, label.en)),
        link{kind, internalPath, externalUrl, anchor, opensInNewTab}
      }
    },
    "contactHeading": select($locale == "en" => coalesce(contactHeading.en, contactHeading.mr), coalesce(contactHeading.mr, contactHeading.en)),
    "languageHeading": select($locale == "en" => coalesce(languageHeading.en, languageHeading.mr), coalesce(languageHeading.mr, languageHeading.en)),
    "copyright": select($locale == "en" => coalesce(copyright.en, copyright.mr), coalesce(copyright.mr, copyright.en)),
    legalLinks[]{
      "label": select($locale == "en" => coalesce(label.en, label.mr), coalesce(label.mr, label.en)),
      link{kind, internalPath, externalUrl, anchor, opensInNewTab}
    }
  }
}`)
