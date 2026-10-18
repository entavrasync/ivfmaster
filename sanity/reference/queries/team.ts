import { defineQuery } from 'next-sanity'
import { SEO_LOCALIZED_PROJECTION } from '../../lib/seo-mapping'

/** Team-page presentation only. Doctor records use sanity/lib/clinic. */
export const teamPageQuery = defineQuery(`{
  "page": *[_type == "teamPage" && _id == "teamPage" && reviewStatus == "approved"][0]{
    hero{
      "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
      "headline": select($locale == "en" => coalesce(headline.en, headline.mr), coalesce(headline.mr, headline.en)),
      "lead": select($locale == "en" => coalesce(lead.en, lead.mr), coalesce(lead.mr, lead.en))
    },
    doctorsSection{
      "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
      "heading": select($locale == "en" => coalesce(heading.en, heading.mr), coalesce(heading.mr, heading.en)),
      "lead": select($locale == "en" => coalesce(lead.en, lead.mr), coalesce(lead.mr, lead.en)),
      "coupleNote": select($locale == "en" => coalesce(coupleNote.en, coupleNote.mr), coalesce(coupleNote.mr, coupleNote.en))
    },
    careTeamSection{
      "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
      "heading": select($locale == "en" => coalesce(heading.en, heading.mr), coalesce(heading.mr, heading.en)),
      "lead": select($locale == "en" => coalesce(lead.en, lead.mr), coalesce(lead.mr, lead.en)),
      members[]{
        "name": select($locale == "en" => coalesce(name.en, name.mr), coalesce(name.mr, name.en)),
        "role": select($locale == "en" => coalesce(role.en, role.mr), coalesce(role.mr, role.en)),
        "blurb": select($locale == "en" => coalesce(blurb.en, blurb.mr), coalesce(blurb.mr, blurb.en)),
        credentials[]{
          "text": select($locale == "en" => coalesce(text.en, text.mr), coalesce(text.mr, text.en)),
          accent
        },
        "portrait": portrait{
          "alt": select($locale == "en" => coalesce(alt.en, alt.mr), coalesce(alt.mr, alt.en)),
          crop, hotspot, "assetId": asset->_id, "url": asset->url,
          "dimensions": asset->metadata.dimensions,
          "lqip": asset->metadata.lqip
        }
      }
    },
    facilitySection{
      "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
      "heading": select($locale == "en" => coalesce(heading.en, heading.mr), coalesce(heading.mr, heading.en)),
      "lead": select($locale == "en" => coalesce(lead.en, lead.mr), coalesce(lead.mr, lead.en)),
      areas[]{
        "caption": select($locale == "en" => coalesce(caption.en, caption.mr), coalesce(caption.mr, caption.en)),
        images[]{
          "alt": select($locale == "en" => coalesce(alt.en, alt.mr), coalesce(alt.mr, alt.en)),
          crop, hotspot, "assetId": asset->_id, "url": asset->url,
          "dimensions": asset->metadata.dimensions,
          "lqip": asset->metadata.lqip
        }
      }
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
      }
    },
    seo{
      "metaTitle": select($locale == "en" => coalesce(metaTitle.en, metaTitle.mr), coalesce(metaTitle.mr, metaTitle.en)),
      "metaDescription": select($locale == "en" => coalesce(metaDescription.en, metaDescription.mr), coalesce(metaDescription.mr, metaDescription.en)),
      ${SEO_LOCALIZED_PROJECTION},
      "ogImage": ogImage{
        "alt": select($locale == "en" => coalesce(alt.en, alt.mr), coalesce(alt.mr, alt.en)),
        crop, hotspot, "assetId": asset->_id, "url": asset->url,
        "dimensions": asset->metadata.dimensions,
        "lqip": asset->metadata.lqip
      },
      canonicalUrl,
      noIndex
    }
  }
}`)
