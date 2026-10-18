import { defineQuery } from 'next-sanity'

/** Listing-page presentation only. Treatment records use sanity/lib/procedures. */
export const proceduresHubQuery = defineQuery(`{
  "page": *[_type == "proceduresPage" && _id == "proceduresPage" && reviewStatus == "approved"][0]{
    hero{
      "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
      "heading": select($locale == "en" => coalesce(heading.en, heading.mr), coalesce(heading.mr, heading.en)),
      "body": select($locale == "en" => coalesce(body.en, body.mr), coalesce(body.mr, body.en))
    },
    closing{
      "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
      "heading": select($locale == "en" => coalesce(heading.en, heading.mr), coalesce(heading.mr, heading.en)),
      "body": select($locale == "en" => coalesce(body.en, body.mr), coalesce(body.mr, body.en)),
      "microCopy": select($locale == "en" => coalesce(microCopy.en, microCopy.mr), coalesce(microCopy.mr, microCopy.en)),
      primary{
        "label": select($locale == "en" => coalesce(label.en, label.mr), coalesce(label.mr, label.en)),
        emphasis,
        link{kind, internalPath, externalUrl, anchor, opensInNewTab}
      },
      secondary{
        "label": select($locale == "en" => coalesce(label.en, label.mr), coalesce(label.mr, label.en)),
        emphasis,
        link{kind, internalPath, externalUrl, anchor, opensInNewTab}
      }
    },
    seo{
      "metaTitle": select($locale == "en" => coalesce(metaTitle.en, metaTitle.mr), coalesce(metaTitle.mr, metaTitle.en)),
      "metaDescription": select($locale == "en" => coalesce(metaDescription.en, metaDescription.mr), coalesce(metaDescription.mr, metaDescription.en)),
      "ogImage": ogImage{
        "alt": select($locale == "en" => coalesce(alt.en, alt.mr), coalesce(alt.mr, alt.en)),
        "url": asset->url,
        "dimensions": asset->metadata.dimensions,
        "lqip": asset->metadata.lqip
      },
      canonicalUrl,
      noIndex
    }
  }
}`)
