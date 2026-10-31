// Local-only records; these are never written to Sanity.
export const blocks = [{ _type: 'block', _key: 'opening', style: 'normal', children: [{ _type: 'span', _key: 'text', text: 'A local publishing workflow fixture for IVFMaster.', marks: [] }], markDefs: [] }]
export const newsCategory = { _id: 'fixture-news-category', _type: 'publicationCategory', title: { en: 'Institutional updates', mr: 'संस्थेच्या घडामोडी' }, slug: { _type: 'slug', current: 'institutional-updates' }, scope: 'news' }
export const eventCategory = { _id: 'fixture-event-category', _type: 'publicationCategory', title: { en: 'Learning together' }, slug: { _type: 'slug', current: 'learning-together' }, scope: 'event' }
const common = {
  _updatedAt: '2026-10-27T04:00:00Z', reviewStatus: 'approved',
  title: { en: 'A new chapter in institutional learning', mr: 'संस्थेच्या ज्ञानप्रवासातील नवा अध्याय' },
  summary: { en: 'An institutional update with realistic editorial copy, useful context and a clear publishing date.' },
  body: { en: blocks }, featured: true,
}
export const newsFixture = { ...common, _id: 'fixture-news', _type: 'news', slug: { _type: 'slug', current: 'institutional-learning' }, category: { _type: 'reference', _ref: newsCategory._id }, publishedAt: '2026-10-26T06:30:00Z' }
export const eventFixture = {
  ...common, _id: 'fixture-event', _type: 'event', title: { en: 'A conversation about fertility care and the questions that matter' },
  slug: { _type: 'slug', current: 'fertility-conversation' }, category: { _type: 'reference', _ref: eventCategory._id },
  startAt: '2030-11-01T04:30:00Z', endAt: '2030-11-01T06:30:00Z', timezone: 'Asia/Kolkata',
  status: 'scheduled', attendanceMode: 'inPerson', venue: { en: 'IVFMaster learning room, local fixture address' },
  registrationUrl: 'https://example.com/register',
}
