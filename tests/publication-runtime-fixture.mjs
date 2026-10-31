// Preloaded only by the local HTTP/browser verification command. No app code
// imports this module and no records are sent to the remote CMS.
import { createRequire } from 'node:module'
import { existsSync, readFileSync } from 'node:fs'
import { createPublicationDemo } from './publication-demo-content.mjs'
import initial from '../sanity/reference/initial-content.json' with { type: 'json' }
import { newsFixture, eventFixture, newsCategory, eventCategory } from './publication-fixtures.mjs'

const require = createRequire(import.meta.url)
const groq = createRequire(require.resolve('sanity'))('groq-js')
const records = [newsCategory, eventCategory, ...Object.entries(initial.singletons).map(([type, value]) => ({ ...value, _id: type, _type: type, reviewStatus: 'approved' })),
  ...Object.entries(initial.legacy).map(([type, value]) => ({ ...value, _id: type, _type: type, reviewStatus: 'approved' })),
  ...Array.from({ length: 14 }, (_, i) => ({ ...newsFixture, _id: `fixture-news-${i}`, slug: { current: `institutional-learning-${i}` },
    title: { en: i === 0 ? 'Local fixture: a new chapter in learning, collaboration and compassionate fertility care' : `Local fixture: institutional update ${i}` },
    featured: i === 0, publishedAt: `2026-10-${String(26 - i).padStart(2, '0')}T06:30:00Z`,
    media: i === 0 ? [{ _key: 'video', url: 'https://youtu.be/M7lc1UVf-VE' }, { _key: 'instagram', url: 'https://www.instagram.com/p/BsOGulcndj-/' }] : [],
  })),
  ...['scheduled', 'held', 'cancelled', 'postponed'].map(status => ({ ...eventFixture, _id: `fixture-event-${status}`, slug: { current: `fertility-conversation-${status}` },
    title: { en: `Local fixture: ${status} fertility conversation` }, featured: status === 'scheduled', status,
    recap: status === 'held' ? newsFixture.body : undefined,
    recordingUrl: status === 'held' ? 'https://youtu.be/M7lc1UVf-VE' : undefined,
  })),
]
if (process.env.PUBLICATION_VISUAL_REVIEW === '1') {
  const assetPath = new URL('../.next/cache/publication-review-assets.json', import.meta.url)
  const snapshotPath = new URL('../.next/cache/publication-mock-review-snapshot.json', import.meta.url)
  const snapshot = existsSync(snapshotPath) ? JSON.parse(readFileSync(snapshotPath, 'utf8')) : null
  const assets = snapshot?.assets ?? (existsSync(assetPath) ? JSON.parse(readFileSync(assetPath, 'utf8')) : [])
  const demo = snapshot ?? createPublicationDemo({ assets })
  const keep = records.filter(record => !['news', 'event', 'publicationCategory'].includes(record._type))
  records.splice(0, records.length, ...keep,
    ...assets.map(asset => ({ ...asset, _type: 'sanity.imageAsset', metadata: { dimensions: asset.dimensions } })),
    ...demo.documents.map(doc => ({ ...doc, _id: doc._id.slice(7), _updatedAt: new Date().toISOString(), ...(doc._type !== 'publicationCategory' ? { reviewStatus: 'approved' } : {}) })),
  )
}
const navigation = records.find(record => record._id === 'navigation')
if (navigation) navigation.items = [
  ...navigation.items.filter(item => item.link?.internalPath !== '/contact').slice(0, 4),
  { _key: 'news-events', behavior: 'dropdown', label: { en: 'News & Events', mr: 'बातम्या आणि कार्यक्रम' }, link: { kind: 'internal', internalPath: '/news-events' }, children: [
    { _key: 'news', label: { en: 'News', mr: 'बातम्या' }, link: { kind: 'internal', internalPath: '/news' } },
    { _key: 'events', label: { en: 'Events', mr: 'कार्यक्रम' }, link: { kind: 'internal', internalPath: '/events' } },
    { _key: 'education', label: { en: 'Educational Articles', mr: 'शैक्षणिक लेख' }, link: { kind: 'internal', internalPath: '/educate-ivf' } },
  ] },
]

function wrapFetch(native) {
  return new Proxy(native, {
    apply(target, receiver, args) {
      const input = args[0], address = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
      const url = new URL(address)
      if (url.hostname === '4k9zwr7s.api.sanity.io' && url.pathname.includes('/data/query/production')) return (async () => {
        const payload = args[1]?.body ? JSON.parse(args[1].body) : null
        const query = payload?.query ?? url.searchParams.get('query'), params = payload?.params ?? {}
        for (const [key, value] of url.searchParams) if (key.startsWith('$')) params[key.slice(1)] = JSON.parse(value)
        const result = await (await groq.evaluate(groq.parse(query), { dataset: records, params })).get()
        return new Response(JSON.stringify({ result, ms: 1, query }), { headers: { 'Content-Type': 'application/json' } })
      })()
      return Reflect.apply(target, receiver, args)
    },
  })
}
let currentFetch = wrapFetch(globalThis.fetch)
// Preserve Next's own fetch wrappers while intercepting only this test dataset.
Object.defineProperty(globalThis, 'fetch', { configurable: true, get: () => currentFetch, set: value => { currentFetch = wrapFetch(value) } })
