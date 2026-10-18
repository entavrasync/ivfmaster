import { defineQuery } from 'next-sanity'
import { SEO_LOCALIZED_PROJECTION } from '../../lib/seo-mapping'

/** Homepage presentation and selected FAQ references. Keep this literal projection aligned with site-content-mapping and the existing section components. Shared doctor identities and profile narratives remain owned by the target clinic reader. */
export const homePageQuery = defineQuery(`*[_type == "homePage" && _id == "homePage" && reviewStatus == "approved"][0]{
  hero{
    "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
    "headline": select($locale == "en" => coalesce(headline.en, headline.mr), coalesce(headline.mr, headline.en)),
    "subheadline": select($locale == "en" => coalesce(subheadline.en, subheadline.mr), coalesce(subheadline.mr, subheadline.en)),
    "body": select($locale == "en" => coalesce(body.en, body.mr), coalesce(body.mr, body.en)),
    "microTrust": select($locale == "en" => coalesce(microTrust.en, microTrust.mr), coalesce(microTrust.mr, microTrust.en)),
    "desktopImage": desktopImage{
      "alt": select($locale == "en" => coalesce(alt.en, alt.mr), coalesce(alt.mr, alt.en)),
      crop, hotspot, "assetId": asset->_id, "url": asset->url,
      "dimensions": asset->metadata.dimensions,
      "lqip": asset->metadata.lqip
    },
    "mobileImage": mobileImage{
      "alt": select($locale == "en" => coalesce(alt.en, alt.mr), coalesce(alt.mr, alt.en)),
      crop, hotspot, "assetId": asset->_id, "url": asset->url,
      "dimensions": asset->metadata.dimensions,
      "lqip": asset->metadata.lqip
    },
    primaryCta{
      "label": select($locale == "en" => coalesce(label.en, label.mr), coalesce(label.mr, label.en)),
      emphasis,
      link{kind, internalPath, externalUrl, anchor, opensInNewTab}
    },
    secondaryCta{
      "label": select($locale == "en" => coalesce(label.en, label.mr), coalesce(label.mr, label.en)),
      emphasis,
      link{kind, internalPath, externalUrl, anchor, opensInNewTab}
    }
  },
  painRecognition{
    "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
    "headline": select($locale == "en" => coalesce(headline.en, headline.mr), coalesce(headline.mr, headline.en)),
    "body": select($locale == "en" => coalesce(body.en, body.mr), coalesce(body.mr, body.en))
  },
  painStory{
    chapters[]{
      "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
      "headline": select($locale == "en" => coalesce(headline.en, headline.mr), coalesce(headline.mr, headline.en)),
      "body": select($locale == "en" => coalesce(body.en, body.mr), coalesce(body.mr, body.en))
    }
  },
  painCta{
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
  whyTrust{
    "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
    "heading": select($locale == "en" => coalesce(heading.en, heading.mr), coalesce(heading.mr, heading.en)),
    "body": select($locale == "en" => coalesce(body.en, body.mr), coalesce(body.mr, body.en)),
    cards[]{
      "label": select($locale == "en" => coalesce(label.en, label.mr), coalesce(label.mr, label.en)),
      "worry": select($locale == "en" => coalesce(worry.en, worry.mr), coalesce(worry.mr, worry.en)),
      "response": select($locale == "en" => coalesce(response.en, response.mr), coalesce(response.mr, response.en))
    },
    "credentialNote": select($locale == "en" => coalesce(credentialNote.en, credentialNote.mr), coalesce(credentialNote.mr, credentialNote.en)),
    credentialCitation{
      "textBefore": select($locale == "en" => coalesce(textBefore.en, textBefore.mr), coalesce(textBefore.mr, textBefore.en)),
      "textAfter": select($locale == "en" => coalesce(textAfter.en, textAfter.mr), coalesce(textAfter.mr, textAfter.en)),
      link{
        "label": select($locale == "en" => coalesce(label.en, label.mr), coalesce(label.mr, label.en)),
        emphasis,
        link{kind, internalPath, externalUrl, anchor, opensInNewTab}
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
    }
  },
  costOfWaiting{
    "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
    narrativeLines[]{
      "text": select($locale == "en" => coalesce(@.en, @.mr), coalesce(@.mr, @.en))
    },
    hopeLines[]{
      "text": select($locale == "en" => coalesce(@.en, @.mr), coalesce(@.mr, @.en))
    },
    frames[]{
      "desktop": desktop{
        "alt": select($locale == "en" => coalesce(alt.en, alt.mr), coalesce(alt.mr, alt.en)),
        crop, hotspot, "assetId": asset->_id, "url": asset->url,
        "dimensions": asset->metadata.dimensions,
        "lqip": asset->metadata.lqip
      },
      "mobile": mobile{
        "alt": select($locale == "en" => coalesce(alt.en, alt.mr), coalesce(alt.mr, alt.en)),
        crop, hotspot, "assetId": asset->_id, "url": asset->url,
        "dimensions": asset->metadata.dimensions,
        "lqip": asset->metadata.lqip
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
    }
  },
  understandingIvf{
    "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
    "heading": select($locale == "en" => coalesce(heading.en, heading.mr), coalesce(heading.mr, heading.en)),
    "body": select($locale == "en" => coalesce(body.en, body.mr), coalesce(body.mr, body.en)),
    steps[]{
      illustrationKey,
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
      }
    }
  },
  meetTheDoctors{
    "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
    "heading": select($locale == "en" => coalesce(heading.en, heading.mr), coalesce(heading.mr, heading.en)),
    "body": select($locale == "en" => coalesce(body.en, body.mr), coalesce(body.mr, body.en)),
    "coupleNote": select($locale == "en" => coalesce(coupleNote.en, coupleNote.mr), coalesce(coupleNote.mr, coupleNote.en)),
    doctors[!defined(doctor) || doctor->reviewStatus == "approved"]{
      "slug": coalesce(doctor->slug.current, profileSlug),
      "name": select($locale == "en" => coalesce(doctor->name.en, doctor->name.mr), coalesce(doctor->name.mr, doctor->name.en)),
      "essence": select($locale == "en" => coalesce(doctor->essence.en, doctor->essence.mr), coalesce(doctor->essence.mr, doctor->essence.en)),
      "intro": select($locale == "en" => coalesce(intro.en, intro.mr), coalesce(intro.mr, intro.en)),
      "ctaLabel": select($locale == "en" => coalesce(ctaLabel.en, ctaLabel.mr), coalesce(ctaLabel.mr, ctaLabel.en)),
      "storyLabel": select($locale == "en" => coalesce(storyLabel.en, storyLabel.mr), coalesce(storyLabel.mr, storyLabel.en)),
      credentials[]{
        "text": select($locale == "en" => coalesce(text.en, text.mr), coalesce(text.mr, text.en)),
        accent
      }
    }
  },
  mythsFacts{
    "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
    "heading": select($locale == "en" => coalesce(heading.en, heading.mr), coalesce(heading.mr, heading.en)),
    "body": select($locale == "en" => coalesce(body.en, body.mr), coalesce(body.mr, body.en)),
    "referencedItems": faqReferences[]{
      "_id": select(@->reviewStatus == "approved" && @->isPublished == true && !(@->_id in path("drafts.**")) && !(@->_id in path("versions.**")) => @->_id),
      "question": select(@->reviewStatus == "approved" && @->isPublished == true => select($locale == "mr" => coalesce(@->question.mr, @->question.en), @->question.en)),
      "answer": select(@->reviewStatus == "approved" && @->isPublished == true => select($locale == "mr" => coalesce(@->answer.mr, @->answer.en), @->answer.en))
    },
    items[]{
      _key,
      "question": select($locale == "en" => coalesce(question.en, question.mr), coalesce(question.mr, question.en)),
      "answer": select($locale == "en" => coalesce(answer.en, answer.mr), coalesce(answer.mr, answer.en))
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
    }
  },
  finalCta{
    intro{
      "eyebrow": select($locale == "en" => coalesce(eyebrow.en, eyebrow.mr), coalesce(eyebrow.mr, eyebrow.en)),
      "heading": select($locale == "en" => coalesce(heading.en, heading.mr), coalesce(heading.mr, heading.en)),
      "body": select($locale == "en" => coalesce(body.en, body.mr), coalesce(body.mr, body.en)),
      "microCopy": select($locale == "en" => coalesce(microCopy.en, microCopy.mr), coalesce(microCopy.mr, microCopy.en))
    },
    contactLabels{
      "clinic": select($locale == "en" => coalesce(clinic.en, clinic.mr), coalesce(clinic.mr, clinic.en)),
      "hours": select($locale == "en" => coalesce(hours.en, hours.mr), coalesce(hours.mr, hours.en)),
      "reach": select($locale == "en" => coalesce(reach.en, reach.mr), coalesce(reach.mr, reach.en))
    },
    whatsappCta{
      "label": select($locale == "en" => coalesce(label.en, label.mr), coalesce(label.mr, label.en)),
      emphasis,
      link{kind, internalPath, externalUrl, anchor, opensInNewTab}
    },
    formCta{
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
}`)
