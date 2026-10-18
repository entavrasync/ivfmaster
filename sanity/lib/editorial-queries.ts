import { defineQuery } from 'next-sanity'

// Read up to two eligible documents: never choose arbitrarily between duplicates.
export const homeFaqQuery = defineQuery(`
  *[_type == "homeFaq" && reviewStatus == "approved" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))][0...2]{
    _id,reviewStatus,eyebrow{en,mr},heading{en,mr},body{en,mr},closeBody{en,mr},
    faqs[]{_key,question{en,mr},answer{en,mr}}
  }
`)
export const aboutInformationQuery = defineQuery(`
  *[_type == "aboutInformation" && reviewStatus == "approved" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))][0...2]{
    _id,reviewStatus,
    origin{eyebrow{en,mr},title{en,mr},quote{en,mr},note{en,mr},paragraphs[]{_key,en,mr}},
    care{eyebrow{en,mr},title{en,mr},intro{en,mr},steps[]{_key,title{en,mr},body{en,mr}}},
    trust{eyebrow{en,mr},title{en,mr},intro{en,mr},points[]{_key,label{en,mr},title{en,mr},body{en,mr}}}
  }
`)
export const facilityGalleryQuery = defineQuery(`
  *[_type == "facilityGallery" && reviewStatus == "approved" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))][0...2]{
    _id,reviewStatus,eyebrow{en,mr},heading{en,mr},lead{en,mr},
    areas[]{_key,area,caption{en,mr},imageAlt{en,mr},
      images[]{_key,crop,hotspot,asset->{_id,url,metadata{dimensions{width,height},lqip}}}}
  }
`)
