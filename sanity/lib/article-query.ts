import { defineQuery } from 'next-sanity'
import { SEO_RAW_PROJECTION } from './seo-mapping'

// One bounded, fully validated read keeps list/detail/related eligibility consistent.
// Eight records detect duplicates across the seven existing production URLs.
export const articlesQuery = defineQuery(`
  *[_type == "article" && slug.current in $slugs && reviewStatus == "approved"
    && !(_id in path("drafts.**")) && !(_id in path("versions.**"))][0...8]{
    _id,reviewStatus,"slug":slug.current,title{en,mr},excerpt{en,mr},category,date,readTime,
    ${SEO_RAW_PROJECTION},
    related[]{_key,"slug":select(@->reviewStatus == "approved" && !(@->_id in path("drafts.**")) && !(@->_id in path("versions.**")) => @->slug.current),"reviewStatus":@->reviewStatus},
    coverImage{alt{en,mr},crop,hotspot,asset->{_id,url,metadata{dimensions{width,height},lqip}}},
    ivfGuide{title{en,mr},intro1{en,mr},phases{en[]{_key,heading,intro,intro2,note,items[]{_key,label,body}},mr[]{_key,heading,intro,intro2,note,items[]{_key,label,body}}},closingHeading{en,mr},closingPara1{en,mr},closingPara2{en,mr}},pcos{intro{en,mr},signsHeading{en,mr},signs{en,mr},signsNote{en,mr},whyHeading{en,mr},whyBody{en,mr},diagnosisHeading{en,mr},diagnosisIntro{en,mr},diagnosisList{en,mr},treatmentHeading{en,mr},lifestyleSubheading{en,mr},lifestyleIntro{en,mr},lifestyleList{en,mr},mantra{en,mr},medicinesSubheading{en,mr},medicinesIntro{en,mr},medicinesList{en,mr},medicinesNote{en,mr},regularHeading{en,mr},regularIntro{en,mr},regularList{en,mr},regularClosing{en,mr},visitHeading{en,mr},visitIntro{en,mr},visitList{en,mr},rememberHeading{en,mr},rememberList{en,mr}},maleFertility{title{en,mr},intro{en,mr},about{heading{en,mr},body{en,mr}},causes{heading{en,mr},items{en,mr}},signs{heading{en,mr},body{en,mr}},checked{heading{en,mr},intro{en,mr},items{en,mr}},treated{heading{en,mr},intro{en,mr},items{en,mr}},doYou{heading{en,mr},items{en,mr}},doctor{heading{en,mr},items{en,mr}},remember{heading{en,mr},line{en,mr}}},recurrentLoss{title{en,mr},intro{en,mr},sections{en[]{_key,heading,intro,body,items,table{headers,rows[]{_key,cells}}},mr[]{_key,heading,intro,body,items,table{headers,rows[]{_key,cells}}}},closing{en,mr}},unexplained{title{en,mr},intro{en,mr},sections{en[]{_key,heading,intro,body,items,table{headers,rows[]{_key,cells}}},mr[]{_key,heading,intro,body,items,table{headers,rows[]{_key,cells}}}},closing{en,mr}},age{title{en,mr},intro{en,mr},sections{en[]{_key,heading,intro,body,items,table{headers,rows[]{_key,cells}}},mr[]{_key,heading,intro,body,items,table{headers,rows[]{_key,cells}}}},closing{en,mr}},myths{title{en,mr},intro{en,mr},items{en[]{_key,myth,fact},mr[]{_key,myth,fact}},closing{en,mr}}
  }
`)
