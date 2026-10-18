import { defineQuery } from 'next-sanity'

// Every approved, published procedure: existing routes are overlaid, new slugs are added
// to the listing, detail route and navigation. Ordered so new entries appear stably.
export const allProceduresQuery = defineQuery(`
  *[_type == "procedure" && defined(slug.current) && reviewStatus == "approved"
    && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(_createdAt asc) [0...20]{
    _id, reviewStatus, "slug": slug.current,
    name{en, mr}, fullName{en, mr}, oneLiner{en, mr}, heroDescription{en, mr},
    quickFacts[]{_key, label{en, mr}, value{en, mr}},
    whoItsFor[]{_key, en, mr}, process[]{_key, title{en, mr}, detail{en, mr}},
    whatToExpect{en, mr}, faqs[]{_key, q{en, mr}, a{en, mr}},
    seo{metaTitle{en, mr}, metaDescription{en, mr}},
    cardImage{alt{en, mr}, crop, hotspot, "assetId": asset->_id, "url": asset->url, "dimensions": asset->metadata.dimensions, "lqip": asset->metadata.lqip},
    bannerImage{alt{en, mr}, crop, hotspot, "assetId": asset->_id, "url": asset->url, "dimensions": asset->metadata.dimensions, "lqip": asset->metadata.lqip}
  }
`)
