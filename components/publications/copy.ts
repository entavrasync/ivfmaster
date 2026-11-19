/**
 * Default interface wording for the Speeches pages. Page headings, intros and search text come only from the
 * Speeches page documents in the CMS; the labels listed in SPEECH_LABEL_FIELDS can also be changed there
 * (Labels tab), and these defaults apply only to labels left empty.
 */
export const publicationLabels = {
  en: {
    education: 'Educational articles',
    story: 'speech', stories: 'speeches', browse: 'Explore speeches',
    latest: 'Latest speeches', featured: 'In focus', all: 'All categories',
    read: 'View the speech',
    empty: 'There is nothing here yet.', emptyBody: 'Please check back for updates from IVFMaster.',
    error: 'Updates are temporarily unavailable.', errorBody: 'Please try again shortly.', retry: 'Try again',
    previous: 'Previous', next: 'Next', page: 'Page', of: 'of', back: 'Back to', categories: 'Browse by category',
    sources: 'Sources & related links', media: 'Watch & discover',
    preview: 'Draft preview — unpublished content', exit: 'Exit preview', updated: 'Updated',
    play: 'Play video', loadInstagram: 'Load Instagram post', openSource: 'Open on',
    unavailable: 'This media preview is unavailable. You can try the original source.',
    loadMore: 'Load more', showLess: 'Show less', showing: 'Showing {shown} of {total}',
    pagination: 'Speech pages', clear: 'Clear filter',
    categoryFilter: 'Category', filtering: 'Updating results…', allNews: 'All speeches', moreNews: 'More speeches',
    noCategory: 'No results in this category.', noCategoryBody: 'Choose another category or clear the filter to see all results.',
  },
  mr: {
    education: 'शैक्षणिक लेख',
    story: 'व्याख्यान', stories: 'व्याख्याने', browse: 'व्याख्याने पहा',
    latest: 'नवीन व्याख्याने', featured: 'विशेष', all: 'सर्व विषय',
    read: 'व्याख्यान पहा',
    empty: 'सध्या येथे कोणतीही नोंद नाही.', emptyBody: 'IVFMaster च्या नव्या माहितीसाठी पुन्हा भेट द्या.',
    error: 'माहिती सध्या उपलब्ध नाही.', errorBody: 'कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.', retry: 'पुन्हा प्रयत्न करा',
    previous: 'मागील', next: 'पुढील', page: 'पान', of: 'पैकी', back: 'परत', categories: 'विषयानुसार पहा',
    sources: 'स्रोत आणि संबंधित दुवे', media: 'पहा आणि जाणून घ्या',
    preview: 'मसुदा पूर्वावलोकन — अप्रकाशित मजकूर', exit: 'पूर्वावलोकन बंद करा', updated: 'अद्ययावत',
    play: 'व्हिडिओ पहा', loadInstagram: 'Instagram पोस्ट पहा', openSource: 'येथे उघडा',
    unavailable: 'माध्यमाचे पूर्वावलोकन उपलब्ध नाही. मूळ स्रोत पहा.',
    loadMore: 'आणखी पहा', showLess: 'कमी दाखवा', showing: '{total} पैकी {shown} दाखवत आहे',
    pagination: 'व्याख्यानांची पाने', clear: 'विषयाची निवड काढा',
    categoryFilter: 'विषय', filtering: 'माहिती अद्ययावत होत आहे…', allNews: 'सर्व व्याख्याने', moreNews: 'आणखी व्याख्याने',
    noCategory: 'या विषयात कोणतीही नोंद नाही.', noCategoryBody: 'दुसरा विषय निवडा किंवा सर्व नोंदी पाहण्यासाठी विषयाची निवड काढा.',
  },
} as const

export type SpeechLabelSet = { -readonly [K in keyof typeof publicationLabels.en]: string }

/** Labels editors can change in Studio (Speeches page → Labels), in the order they appear on the pages. */
export const SPEECH_LABEL_FIELDS = [
  { key: 'read', title: 'Card link (“View the speech”)' },
  { key: 'allNews', title: 'List heading and back link (“All speeches”)' },
  { key: 'moreNews', title: 'List heading below featured (“More speeches”)' },
  { key: 'story', title: 'Count word, one (“speech”)' },
  { key: 'stories', title: 'Count word, many (“speeches”)' },
  { key: 'categoryFilter', title: 'Category filter label' },
  { key: 'all', title: 'Filter option for all categories' },
  { key: 'clear', title: 'Clear filter link' },
  { key: 'loadMore', title: 'Load more button' },
  { key: 'showLess', title: 'Show less button' },
  { key: 'showing', title: 'Progress text (keep {shown} and {total})' },
  { key: 'empty', title: 'Empty list heading' },
  { key: 'emptyBody', title: 'Empty list message' },
  { key: 'noCategory', title: 'Empty category heading' },
  { key: 'noCategoryBody', title: 'Empty category message' },
  { key: 'updated', title: 'Speech page “Updated” label' },
  { key: 'media', title: 'Speech page video section heading' },
  { key: 'sources', title: 'Speech page sources heading' },
  { key: 'play', title: 'Play video button' },
  { key: 'loadInstagram', title: 'Load Instagram post button' },
  { key: 'openSource', title: 'Open on YouTube/Instagram link' },
  { key: 'unavailable', title: 'Video unavailable message' },
] as const satisfies readonly { key: keyof SpeechLabelSet; title: string }[]

export type EditableSpeechLabel = typeof SPEECH_LABEL_FIELDS[number]['key']

/**
 * Applies CMS label overrides for one locale on top of the defaults. Only that locale's own value is used
 * (an English override never shows on Marathi pages), and the progress text must keep both placeholders.
 */
export function mergeSpeechLabels(locale: 'en' | 'mr', cms: unknown): SpeechLabelSet {
  const labels: SpeechLabelSet = { ...publicationLabels[locale] }
  if (!cms || typeof cms !== 'object') return labels
  for (const { key } of SPEECH_LABEL_FIELDS) {
    const entry = (cms as Record<string, unknown>)[key]
    const value = entry && typeof entry === 'object' ? (entry as Record<string, unknown>)[locale] : undefined
    if (typeof value !== 'string' || !value.trim()) continue
    if (key === 'showing' && !(value.includes('{shown}') && value.includes('{total}'))) continue
    labels[key] = value.trim()
  }
  return labels
}
