import { defineQuery } from 'next-sanity'
import { SEO_LOCALIZED_PROJECTION } from '../../lib/seo-mapping'

/** About-page presentation. Chapters retain their own narrative and resolve a shared doctor reference or existing profile slug. Static artwork and the target doctor reader preserve the existing portraits and identities. */
export const aboutPageQuery = defineQuery(`*[_type == "aboutPage" && _id == "aboutPage" && reviewStatus == "approved"][0]{
  hero{
    "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
    "title": select($locale == "en" => coalesce(title.en, title.mr), coalesce(title.mr, title.en)),
    "body": select($locale == "en" => coalesce(body.en, body.mr), coalesce(body.mr, body.en)),
    "primaryCtaLabel": select($locale == "en" => coalesce(primaryCtaLabel.en, primaryCtaLabel.mr), coalesce(primaryCtaLabel.mr, primaryCtaLabel.en)),
    "secondaryCtaLabel": select($locale == "en" => coalesce(secondaryCtaLabel.en, secondaryCtaLabel.mr), coalesce(secondaryCtaLabel.mr, secondaryCtaLabel.en))
  },
  origin{
    "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
    "title": select($locale == "en" => coalesce(title.en, title.mr), coalesce(title.mr, title.en)),
    "paragraphs": paragraphs[]{
      "text": select($locale == "en" => coalesce(@.en, @.mr), coalesce(@.mr, @.en))
    },
    "quote": select($locale == "en" => coalesce(quote.en, quote.mr), coalesce(quote.mr, quote.en)),
    "note": select($locale == "en" => coalesce(note.en, note.mr), coalesce(note.mr, note.en))
  },
  care{
    "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
    "title": select($locale == "en" => coalesce(title.en, title.mr), coalesce(title.mr, title.en)),
    "intro": select($locale == "en" => coalesce(intro.en, intro.mr), coalesce(intro.mr, intro.en)),
    steps[]{
      "title": select($locale == "en" => coalesce(title.en, title.mr), coalesce(title.mr, title.en)),
      "body": select($locale == "en" => coalesce(body.en, body.mr), coalesce(body.mr, body.en))
    }
  },
  doctorsSection{
    "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
    chapters[!defined(doctor) || doctor->reviewStatus == "approved"]{
      "slug": coalesce(doctor->slug.current, profileSlug),
      "name": select($locale == "en" => coalesce(doctor->name.en, doctor->name.mr), coalesce(doctor->name.mr, doctor->name.en)),
      "role": select($locale == "en" => coalesce(doctor->title.en, doctor->title.mr), coalesce(doctor->title.mr, doctor->title.en)),
      "pullQuote": select($locale == "en" => coalesce(pullQuote.en, pullQuote.mr), coalesce(pullQuote.mr, pullQuote.en)),
      "paragraphs": paragraphs[]{
        "text": select($locale == "en" => coalesce(@.en, @.mr), coalesce(@.mr, @.en))
      },
      "evidence": select($locale == "en" => coalesce(evidence.en, evidence.mr), coalesce(evidence.mr, evidence.en)),
      "ctaLabel": select($locale == "en" => coalesce(ctaLabel.en, ctaLabel.mr), coalesce(ctaLabel.mr, ctaLabel.en))
    }
  },
  team{
    "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
    "title": select($locale == "en" => coalesce(title.en, title.mr), coalesce(title.mr, title.en)),
    "intro": select($locale == "en" => coalesce(intro.en, intro.mr), coalesce(intro.mr, intro.en)),
    moments[]{
      "title": select($locale == "en" => coalesce(title.en, title.mr), coalesce(title.mr, title.en)),
      "body": select($locale == "en" => coalesce(body.en, body.mr), coalesce(body.mr, body.en))
    }
  },
  trust{
    "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
    "title": select($locale == "en" => coalesce(title.en, title.mr), coalesce(title.mr, title.en)),
    "intro": select($locale == "en" => coalesce(intro.en, intro.mr), coalesce(intro.mr, intro.en)),
    points[]{
      "label": select($locale == "en" => coalesce(label.en, label.mr), coalesce(label.mr, label.en)),
      "title": select($locale == "en" => coalesce(title.en, title.mr), coalesce(title.mr, title.en)),
      "body": select($locale == "en" => coalesce(body.en, body.mr), coalesce(body.mr, body.en))
    }
  },
  closing{
    "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
    "title": select($locale == "en" => coalesce(title.en, title.mr), coalesce(title.mr, title.en)),
    "body": select($locale == "en" => coalesce(body.en, body.mr), coalesce(body.mr, body.en)),
    "primaryCtaLabel": select($locale == "en" => coalesce(primaryCtaLabel.en, primaryCtaLabel.mr), coalesce(primaryCtaLabel.mr, primaryCtaLabel.en)),
    "secondaryCtaLabel": select($locale == "en" => coalesce(secondaryCtaLabel.en, secondaryCtaLabel.mr), coalesce(secondaryCtaLabel.mr, secondaryCtaLabel.en))
  },
  seo{
    "metaTitle": select($locale == "en" => coalesce(metaTitle.en, metaTitle.mr), coalesce(metaTitle.mr, metaTitle.en)),
    "metaDescription": select($locale == "en" => coalesce(metaDescription.en, metaDescription.mr), coalesce(metaDescription.mr, metaDescription.en)),
    ${SEO_LOCALIZED_PROJECTION},
    "ogImage": ogImage{
      "alt": select($locale == "en" => coalesce(alt.en, alt.mr), coalesce(alt.mr, alt.en)),
      "url": asset->url,
      "dimensions": asset->metadata.dimensions,
      "lqip": asset->metadata.lqip
    },
    canonicalUrl,
    noIndex
  }
}`)
