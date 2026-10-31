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
      summary: localized(entry.summary, entry.summaryMr), publishedAt: dateAt(-days[index], 5, 0).toISOString(), featured: [0, 4, 10].includes(index),
      body: richText(content, entry.marathiBody), ...(cover ? { coverImage: cover } : {}),
      ...(index % 3 === 0 ? { author: localized('IVFMaster editorial preview', 'IVFMaster संपादकीय पूर्वावलोकन'), authorKind: 'Organization' } : {}),
      ...(entry.media ? { media: [{ _type: 'publicationMedia', _key: 'source', url: mediaSource[entry.media], ...(![6, 14].includes(index) && image('media-fallback') ? { thumbnail: image('media-fallback') } : {}) }] } : {}),
      ...(entry.links ? { relatedLinks: entry.links.map((key, i) => ({ _key: `source-${i}`, ...linkDestinations[key] })) } : {}),
      seo: mockSeo(entry.title, entry.summary, index === 0 ? image('news-institutional') : undefined),
    }
  })
  const events = mockEvents.map((entry, index) => {
    const past = index >= 14, position = index % 14, programme = mockProgrammes[entry.theme]
    const status = past ? position === 5 ? 'cancelled' : position === 8 ? 'scheduled' : 'held' : position === 4 || position === 11 ? 'postponed' : position === 6 ? 'cancelled' : 'scheduled'
    const start = past || status === 'postponed' ? dateAt(-(position * 4 + 4), 9, 30) : position === 0 ? new Date(Math.floor((now - 1_800_000) / 60_000) * 60_000) : dateAt(position * 3 + 2)
    const end = new Date(start.getTime() + (entry.theme === 'roundtable' ? 5_400_000 : 7_200_000))
    const online = entry.mode !== 'inPerson', artwork = ['event-patient', 'event-professional', 'event-community'][entry.category]
    const cover = position % 5 === 3 ? undefined : image(artwork)
    const notes = status === 'postponed' ? 'This mock event has been postponed. The displayed dates are the original schedule, and a replacement date has not been confirmed. Registration is suspended until the editor enters the new dates and restores Scheduled status.'
      : status === 'cancelled' ? 'This mock session has been cancelled. The original dates remain visible for reference, and registration or online-attendance actions must not be offered.'
      : past ? 'This sample session has concluded. The original registration destination is retained in the document to verify that the website suppresses it for Past events.'
      : 'The session is a general information or professional learning format. It does not provide individual medical advice, and participants should not share personal clinical information in a group discussion.'
    const joining = entry.mode === 'online' ? 'This is an online demonstration programme. The joining destination is a public media-test source, not a real meeting room. Replace it with verified joining instructions before any actual event is published.'
      : entry.mode === 'hybrid' ? 'The mock programme supports attendance at a venue or online. In-person directions and a verified online joining destination must be checked separately before real publication.'
      : 'This is an in-person demonstration programme. The venue text is explicitly marked as a mock location. A real announcement would confirm the complete address, accessibility information and arrival instructions.'
    const english = [notice, programme.intro, { heading: 'Who this session is for' }, programme.audience,
      { heading: 'Programme' }, ...programme.agenda.map(bullet => ({ bullet })), { heading: 'Joining information' }, joining,
      { heading: 'Event update' }, notes, 'The registration destination in this sample is the clinic’s existing Contact page. No real booking, payment or attendance commitment is created by this mock programme.']
    const marathi = index === 1 || index === 15 ? [noticeMr, 'या लहान गटाच्या सत्रात क्लिनिकच्या भेटीतील आगमन, नोंदणी आणि व्यवहार्य प्रश्न यांची ओळख करून दिली जाते. ही वैयक्तिक वैद्यकीय सल्लामसलत नाही.', { heading: 'हे सत्र कोणासाठी आहे' }, 'पहिल्यांदा भेट देणाऱ्या व्यक्ती आणि त्यांच्यासोबत येणाऱ्या आधार देणाऱ्या व्यक्तींसाठी हा नमुना कार्यक्रम आहे.', { heading: 'कार्यक्रम' }, { bullet: 'स्वागत आणि भेटीच्या क्रमाची ओळख.' }, { bullet: 'नोंदणी आणि व्यवहार्य मदत कुठे मिळेल याची माहिती.' }, { bullet: 'भेटीच्या सूचनांची नोंद आणि प्रश्नांसाठी वेळ.' }, { heading: 'सहभागाची माहिती' }, 'ही नमुना जागा आणि नमुना वेळापत्रक आहे. प्रत्यक्ष कार्यक्रम प्रकाशित करण्यापूर्वी तारीख, पत्ता आणि सहभागी होण्याची पद्धत तपासावी.', past ? 'हे नमुना सत्र संपलेले आहे. यासाठी आगामी कार्यक्रमाची नोंदणी कृती दिसू नये.' : 'व्यवहार्य प्रश्नांसाठी क्लिनिकच्या संपर्क पानाचा वापर करता येतो.'] : undefined
    const recap = past && status !== 'cancelled' ? richText([
      'Mock recap: this is a fictional report, not evidence that the session took place.',
      { heading: 'What the programme covered' }, `The sample programme focused on ${entry.theme === 'questions' ? 'making practical questions easier to discuss' : entry.theme === 'support' ? 'listening and practical support' : entry.theme === 'orientation' ? 'understanding the route through a clinic visit' : 'clear information, shared responsibilities and useful follow-up'}. The archive keeps the original dates visible and separates the report from any future registration action.`,
      { heading: 'Materials and follow-up' }, 'The gallery contains branded mock artwork rather than photographs of real participants. Any attached recording uses a public player-test video and is not presented as footage of this session.',
      ...programme.agenda.slice(0, 2).map(bullet => ({ bullet })),
    ]) : undefined
    return { _id: `drafts.${randomUUID()}`, _type: 'event', reviewStatus: 'pendingReview', title: localized(entry.title, entry.mr),
      slug: slug(`demo-event-${past ? 'past' : 'upcoming'}-${String(position + 1).padStart(2, '0')}`), category: categoryReference(categories[3 + entry.category]),
      summary: localized(entry.summary, entry.summaryMr), body: richText(english, marathi),
      startAt: start.toISOString(), endAt: end.toISOString(), timezone: index === 12 ? 'America/New_York' : 'Asia/Kolkata', status,
      attendanceMode: entry.mode, featured: position === 0,
      ...(entry.mode !== 'online' ? { venue: localized('IVFMaster mock learning venue — illustrative address for editorial testing; not a scheduled public event.', 'IVFMaster नमुना शिक्षण स्थळ — संपादकीय चाचणीसाठीचा काल्पनिक पत्ता; प्रत्यक्ष सार्वजनिक कार्यक्रम नाही.') } : {}),
      ...(online ? { onlineUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE' } : {}),
      registrationUrl: 'https://www.ivfmaster.in/contact', ...(cover ? { coverImage: cover } : {}),
      ...(recap ? { recap } : {}),
      ...(recap && position % 3 === 0 && image(artwork) ? { gallery: [artwork, 'news-learning'].map((key, i) => ({ ...image(key), _key: `gallery-${i}` })) } : {}),
      ...(recap && [0, 9, 12].includes(position) ? { recordingUrl: 'https://youtu.be/M7lc1UVf-VE' } : {}),
      seo: mockSeo(entry.title, entry.summary),
    }
  })
  return { categories, news, events, documents: [...categories, ...news, ...events] }
}
