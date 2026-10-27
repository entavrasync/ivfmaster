import { defineQuery } from 'next-sanity'
import { SEO_RAW_PROJECTION } from './seo-mapping'

export const availabilityQuery = defineQuery(`*[_type == "clinicAvailability" && reviewStatus == "approved" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))][0...2]{_id,reviewStatus,timezone,weeklyHours[]{day,closed,open,close},closures[]{date,reason},confirmationNote,confirmedAt,confirmedSnapshot}`)

export const doctorsQuery = defineQuery(`
  *[_type == "doctor" && slug.current in $slugs && reviewStatus == "approved"
    && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]
  | order(order asc, slug.current asc)[0...3]{
    _id, reviewStatus, order, "slug": slug.current,
    name{en,mr}, title{en,mr}, essence{en,mr}, intro{en,mr}, biography{en,mr}, metaDescription{en,mr}, ${SEO_RAW_PROJECTION},
    credentials[]{_key,en,mr,text{en,mr},institution,awardingBody,year}, specializations[]{_key,en,mr},
    home{essence{en,mr},intro{en,mr},credentials[]{_key,en,mr,text{en,mr},institution,awardingBody,year}},
    about{role{en,mr},pullQuote{en,mr},paragraphs[]{_key,en,mr},evidence{en,mr}},
    portrait{alt{en,mr},crop,hotspot,asset->{_id,url,metadata{dimensions{width,height},lqip}}}
  }
`)

// Count via a bounded collection read, then require the exact singleton ID in the mapper.
// A second approved settings document causes fallback instead of arbitrary selection.
export const clinicSettingsQuery = defineQuery(`
  *[_type == "clinicSettings" && reviewStatus == "approved"
    && !(_id in path("drafts.**")) && !(_id in path("versions.**"))][0...2]{
    _id,reviewStatus,telephone,whatsappNumber,email,displayAddress{en,mr},
    address{streetAddress,addressLocality,addressRegion,postalCode,addressCountry},mapUrl,latitude,longitude,instagram
  }
`)
