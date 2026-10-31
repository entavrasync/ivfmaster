import { defineQuery } from 'next-sanity'
import { SEO_RAW_PROJECTION } from './seo-mapping.ts'

export const PUBLICATION_IMAGE = `{alt{en,mr}, crop, hotspot, "assetId": asset->_id, "url": asset->url, "dimensions": asset->metadata.dimensions, "lqip": asset->metadata.lqip}`
export const publicationsQuery = defineQuery(`*[_type == $type && !(_id in path("versions.**"))
  && ($preview || (reviewStatus == "approved" && !(_id in path("drafts.**"))))]{
  _id,_type,_updatedAt,reviewStatus,title,slug,summary,body,featured,
  "category": category->{_id,title,slug,scope},
  "coverImage": coverImage${PUBLICATION_IMAGE},
  media[]{_key,url,"thumbnail": thumbnail${PUBLICATION_IMAGE}},
  publishedAt,author,authorKind,relatedLinks,startAt,endAt,timezone,status,attendanceMode,venue,onlineUrl,registrationUrl,recap,
  "gallery": gallery[]${PUBLICATION_IMAGE},recordingUrl,${SEO_RAW_PROJECTION}
}`)
