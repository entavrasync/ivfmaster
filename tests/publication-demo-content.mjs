import { randomUUID } from 'node:crypto'
import { mockEvents, mockNews, mockProgrammes } from './publication-editorial-catalog.mjs'

export const mockArtwork = [
  { key: 'news-institutional', title: 'Inside IVFMaster', subtitle: 'Institutional updates', type: 'news', mr: 'संस्थेच्या घडामोडी' },
  { key: 'news-people', title: 'People at the centre', subtitle: 'People & community', type: 'news', mr: 'माणसं आणि समुदाय' },
  { key: 'news-community', title: 'Conversations that connect', subtitle: 'Community journal', type: 'news', mr: 'समुदाय वार्तापत्र' },
  { key: 'news-learning', title: 'Learning together', subtitle: 'Learning & collaboration', type: 'news', mr: 'शिक्षण आणि सहयोग' },
  { key: 'event-patient', title: 'A space for your questions', subtitle: 'Patient conversations', type: 'event', mr: 'रुग्णांशी संवाद' },
  { key: 'event-professional', title: 'A shared perspective', subtitle: 'Professional learning', type: 'event', mr: 'व्यावसायिक शिक्षण' },
  { key: 'event-community', title: 'Meet. Listen. Connect.', subtitle: 'Community sessions', type: 'event', mr: 'समुदाय सत्रे' },
  { key: 'media-fallback', title: 'Media preview', subtitle: 'The original source is one click away', type: 'media', mr: 'माध्यमाचे पूर्वावलोकन' },
]

const notice = 'Mock editorial content for CMS review. This is not a real clinic announcement or event; verify and replace the copy before any public use.'
const noticeMr = 'हा CMS चाचणीसाठीचा संपादकीय नमुना आहे. ही प्रत्यक्ष घोषणा किंवा कार्यक्रम नाही. सार्वजनिक वापरापूर्वी मजकूर तपासून बदलावा.'
const localized = (en, mr) => ({ en, ...(mr ? { mr } : {}) })
const slug = current => ({ _type: 'slug', current })
function blocks(entries) {
  return entries.map((entry, index) => {
    const value = typeof entry === 'string' ? { text: entry } : entry
    return { _type: 'block', _key: `block-${index}`, style: value.heading ? 'h2' : 'normal',
      ...(value.bullet ? { listItem: 'bullet', level: 1 } : {}),
      markDefs: [], children: [{ _type: 'span', _key: `span-${index}`, text: value.heading ?? value.bullet ?? value.text, marks: value.strong ? ['strong'] : [] }] }
  })
}
const richText = (entries, mr) => ({ _type: 'publicationRichText', en: blocks(entries), ...(mr ? { mr: blocks(mr) } : {}) })
const categoryReference = category => ({ _type: 'reference', _ref: category._id.slice(7), _weak: true, _strengthenOnPublish: { type: 'publicationCategory', weak: false } })
const mediaSource = {
  'youtube-watch': 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
  'youtube-short': 'https://youtu.be/M7lc1UVf-VE',
  'youtube-shorts': 'https://www.youtube.com/shorts/M7lc1UVf-VE',
  'youtube-live': 'https://www.youtube.com/live/M7lc1UVf-VE',
  'youtube-unavailable': 'https://www.youtube.com/watch?v=invalidVid0',
  'instagram-public': 'https://www.instagram.com/p/BsOGulcndj-/',
  'instagram-unavailable': 'https://www.instagram.com/p/MOCKNOTFOUND2026/',
}
const linkDestinations = {
  contact: { label: localized('Contact the clinic', 'क्लिनिकशी संपर्क साधा'), url: 'https://www.ivfmaster.in/contact' },
  team: { label: localized('Meet the clinical team', 'क्लिनिकल टीमची माहिती'), url: 'https://www.ivfmaster.in/team' },
}
const mockSeo = (title, summary, image) => ({ metaTitle: localized(title), metaDescription: localized(summary), noIndex: true,
  visibilityReason: 'Fictional mock content for editorial and workflow testing.', ...(image ? { ogImage: { ...image, _type: 'image' } } : {}) })

/** A balanced review set: stable fixture URLs, unique copy, and no remote writes. */
export function createPublicationDemo({ assets = [], now = Date.now() } = {}) {
  const image = key => {
    const artwork = mockArtwork.find(item => item.key === key)
    const asset = assets.find(item => item.originalFilename === `ivfmaster-mock-${key}.png`)
    return artwork && asset ? { _type: 'publicationImage', asset: { _type: 'reference', _ref: asset._id },
      alt: localized(`Mock IVFMaster editorial artwork: ${artwork.title} — ${artwork.subtitle}.`, `IVFMaster च्या नमुना संपादकीय चित्राचा विषय: ${artwork.mr}.`) } : undefined
  }
  const categories = [
    ['news', 'Institutional updates', 'संस्थेच्या घडामोडी'], ['news', 'People & community', 'माणसं आणि समुदाय'], ['news', 'Learning & collaboration', 'शिक्षण आणि सहयोग'],
    ['event', 'Patient conversations', 'रुग्णांशी संवाद'], ['event', 'Professional learning', 'व्यावसायिक शिक्षण'], ['event', 'Community sessions', 'समुदाय सत्रे'],
  ].map(([scope, title, mr], index) => ({ _id: `drafts.${randomUUID()}`, _type: 'publicationCategory', scope,
    title: localized(`Mock — ${title}`, `नमुना — ${mr}`), slug: slug(`demo-${scope}-category-${index + 1}`) }))
  const days = [1, 2, 5, 8, 13, 17, 22, 28, 35, 42, 49, 56, 63, 70, 84, 91]
  const dateAt = (offset, hour = 4, minute = 30) => { const date = new Date(now); date.setUTCDate(date.getUTCDate() + offset); date.setUTCHours(hour, minute, 0, 0); return date }
  const news = mockNews.map((entry, index) => {
    const cover = entry.art ? image(entry.art) : undefined
    const content = [notice, ...entry.sections.flatMap(([heading, text]) => [{ heading }, text]),
      ...(entry.bullets ? [{ heading: 'At a glance' }, ...entry.bullets.map(bullet => ({ bullet }))] : []), ...(entry.closing ? [entry.closing] : [])]
    return { _id: `drafts.${randomUUID()}`, _type: 'news', reviewStatus: 'pendingReview', title: localized(entry.title, entry.mr),
      slug: slug(`demo-news-${String(index + 1).padStart(2, '0')}`), category: categoryReference(categories[entry.category]),
      summary: localized(entry.summary, entry.summaryMr), publishedAt: dateAt(-days[index], 5, 0).toISOString(), featured: [0, 4, 10].includes(index), ...([0, 4, 10].includes(index) ? { featuredPosition: [0, 4, 10].indexOf(index) + 1 } : {}),
      body: richText(content, entry.marathiBody), ...(cover ? { coverImage: cover } : {}),
      ...(index % 3 === 0 ? { author: localized('IVFMaster editorial preview', 'IVFMaster संपादकीय पूर्वावलोकन'), authorKind: 'Organization' } : {}),
      ...(entry.media ? { media: [{ _type: 'publicationMedia', _key: 'source', url: mediaSource[entry.media], ...(![6, 14].includes(index) && image('media-fallback') ? { thumbnail: image('media-fallback') } : {}) }] } : {}),
      ...(entry.links ? { relatedLinks: entry.links.map((key, i) => ({ _key: `source-${i}`, ...linkDestinations[key] })) } : {}),
      seo: mockSeo(entry.title, entry.summary, index === 0 ? image('news-institutional') : undefined),
    }
  })
  // Patient speeches use the medical-speech shape: a publication date, not event scheduling.
  const events = mockEvents.map((entry, index) => {
    const programme = mockProgrammes[entry.theme], artwork = ['event-patient', 'event-professional', 'event-community'][entry.category]
    const cover = index % 5 === 3 ? undefined : image(artwork)
    const english = [notice, programme.intro, { heading: 'Who this speech is for' }, programme.audience,
      { heading: 'What the speech covers' }, ...programme.agenda.map(bullet => ({ bullet }))]
    const marathi = index === 1 || index === 15 ? [noticeMr, 'या लहान गटाच्या सत्रात क्लिनिकच्या भेटीतील आगमन, नोंदणी आणि व्यवहार्य प्रश्न यांची ओळख करून दिली जाते. ही वैयक्तिक वैद्यकीय सल्लामसलत नाही.', { heading: 'हे सत्र कोणासाठी आहे' }, 'पहिल्यांदा भेट देणाऱ्या व्यक्ती आणि त्यांच्यासोबत येणाऱ्या आधार देणाऱ्या व्यक्तींसाठी हा नमुना कार्यक्रम आहे.', { heading: 'कार्यक्रम' }, { bullet: 'स्वागत आणि भेटीच्या क्रमाची ओळख.' }, { bullet: 'नोंदणी आणि व्यवहार्य मदत कुठे मिळेल याची माहिती.' }, { bullet: 'भेटीच्या सूचनांची नोंद आणि प्रश्नांसाठी वेळ.' }, { heading: 'सहभागाची माहिती' }, 'ही नमुना जागा आणि नमुना वेळापत्रक आहे. प्रत्यक्ष कार्यक्रम प्रकाशित करण्यापूर्वी तारीख, पत्ता आणि सहभागी होण्याची पद्धत तपासावी.', 'व्यवहार्य प्रश्नांसाठी क्लिनिकच्या संपर्क पानाचा वापर करता येतो.'] : undefined
    return { _id: `drafts.${randomUUID()}`, _type: 'event', reviewStatus: 'pendingReview', title: localized(entry.title, entry.mr),
      slug: slug(`demo-event-${String(index + 1).padStart(2, '0')}`), category: categoryReference(categories[3 + entry.category]),
      summary: localized(entry.summary, entry.summaryMr), body: richText(english, marathi),
      publishedAt: dateAt(-(index * 3 + 1), 5, 0).toISOString(), featured: index === 0, ...(index === 0 ? { featuredPosition: 1 } : {}),
      ...(cover ? { coverImage: cover } : {}),
      ...(index % 4 === 0 ? { author: localized('IVFMaster editorial preview', 'IVFMaster संपादकीय पूर्वावलोकन'), authorKind: 'Organization' } : {}),
      ...([0, 9, 12].includes(index) ? { media: [{ _type: 'publicationMedia', _key: 'source', url: 'https://youtu.be/M7lc1UVf-VE' }] } : {}),
      seo: mockSeo(entry.title, entry.summary),
    }
  })
  return { categories, news, events, documents: [...categories, ...news, ...events] }
}
