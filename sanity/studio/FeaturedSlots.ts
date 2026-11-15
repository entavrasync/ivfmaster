import { createElement as h, useEffect, useState } from 'react'
import { getPublishedId, set, useClient, useFormValue, type BooleanInputProps, type NumberInputProps } from 'sanity'
import { FEATURED_LIMIT } from '../lib/publication-model'
import { apiVersion } from '../project'

type Row = { _id: string; title?: string | null; featured?: boolean | null; featuredPosition?: number | null }
/** Another speech of the same type that currently holds a featured spot, in its latest edited state. */
export type FeaturedHolder = { id: string; title: string; position: number | null; live: boolean; unpublishedChange: boolean }

const ROWS = '*[_type == $type && !(_id in path("versions.**"))]{_id, "title": title.en, featured, featuredPosition}'
const SPOT_NAMES = ['Large blue card', 'Side card', 'Side card']

/** Uses each speech's draft when one exists, so the panel reflects what editors are doing right now. */
export function featuredHolders(rows: readonly Row[], selfId: string): FeaturedHolder[] {
  const byId = new Map<string, { published?: Row; draft?: Row }>()
  for (const row of rows) {
    const id = getPublishedId(row._id), entry = byId.get(id) ?? {}
    if (row._id === id) entry.published = row; else entry.draft = row
    byId.set(id, entry)
  }
  return [...byId].flatMap(([id, { published, draft }]) => {
    const latest = draft ?? published
    if (id === selfId || !latest || latest.featured !== true) return []
    const position = typeof latest.featuredPosition === 'number' ? latest.featuredPosition : null
    return [{ id, title: latest.title?.trim() || 'Untitled speech', position, live: published?.featured === true, unpublishedChange: !!draft && (draft.featured !== published?.featured || draft.featuredPosition !== published?.featuredPosition) }]
  }).sort((a, b) => (a.position ?? 99) - (b.position ?? 99))
}

/** Live list of the other featured speeches of this document's type; refreshes on every change to that type. */
function useFeaturedHolders() {
  const client = useClient({ apiVersion }).withConfig({ perspective: 'raw', useCdn: false })
  const type = useFormValue(['_type']) as string | undefined
  const id = useFormValue(['_id']) as string | undefined
  const self = id ? getPublishedId(id) : ''
  const [state, setState] = useState<{ holders: FeaturedHolder[]; loading: boolean; failed: boolean }>({ holders: [], loading: true, failed: false })
  useEffect(() => {
    if (!type) return
    let active = true
    const load = () => client.fetch<Row[]>(ROWS, { type }).then(
      rows => { if (active) setState({ holders: featuredHolders(rows, self), loading: false, failed: false }) },
      () => { if (active) setState(previous => ({ ...previous, loading: false, failed: true })) })
    void load()
    const subscription = client.listen('*[_type == $type]', { type }, { includeResult: false, visibility: 'query' })
      .subscribe({ next: () => void load(), error: () => { if (active) setState(previous => ({ ...previous, failed: true })) } })
    return () => { active = false; subscription.unsubscribe() }
  }, [client, type, self])
  return state
}

const note = { margin: '8px 0 0', fontSize: 13 }
const status = (holder: FeaturedHolder) => holder.unpublishedChange ? (holder.live ? 'live, with unpublished changes' : 'not published yet') : 'live'

function SlotBoard({ holders, mine, loading, failed }: { holders: FeaturedHolder[]; mine: number | null; loading: boolean; failed: boolean }) {
  const unplaced = holders.filter(holder => holder.position == null || holder.position < 1 || holder.position > FEATURED_LIMIT)
  const used = holders.length + (mine != null ? 1 : 0)
  return h('div', { role: 'status', 'aria-live': 'polite', style: { marginTop: 12, padding: 12, border: '1px solid currentColor', borderRadius: 6, opacity: loading ? 0.6 : 1 } },
    h('strong', {}, `Featured spots: ${Math.min(used, FEATURED_LIMIT)} of ${FEATURED_LIMIT} used`),
    h('ol', { style: { margin: '8px 0 0', paddingLeft: 20 } }, ...Array.from({ length: FEATURED_LIMIT }, (_, i) => {
      const position = i + 1, here = holders.filter(holder => holder.position === position)
      const names = [...(mine === position ? ['This speech'] : []), ...here.map(holder => `“${holder.title}” (${status(holder)})`)]
      return h('li', { key: position, style: { margin: '2px 0' } }, h('span', { style: { opacity: 0.7 } }, `${SPOT_NAMES[i]}: `), names.length ? names.join(' and ') : 'Empty — the newest speech fills it', names.length > 1 ? ' ⚠ shared — choose another position' : '')
    })),
    unplaced.length ? h('p', { style: note }, `Featured without a valid position: ${unplaced.map(holder => `“${holder.title}”`).join(', ')}. Open it and choose a position.`) : null,
    failed ? h('p', { style: note }, 'Could not load the other featured speeches. Check your connection; Publish still checks the limit.') : null)
}

/** Featured toggle with the live spot board. Turning it on is blocked while all spots are taken. */
export function FeaturedToggleInput(props: BooleanInputProps) {
  const { holders, loading, failed } = useFeaturedHolders()
  const position = useFormValue(['featuredPosition'])
  const on = props.value === true, full = holders.length >= FEATURED_LIMIT
  return h('div', {},
    props.renderDefault({ ...props, readOnly: props.readOnly || (!on && full && !loading) }),
    h(SlotBoard, { holders, mine: on && typeof position === 'number' ? position : null, loading, failed }),
    !on && full && !loading ? h('p', { style: note }, `All ${FEATURED_LIMIT} featured spots are taken. Unfeature one of the speeches above before featuring this one.`) : null)
}

/** One button per spot, naming who holds it; spots held by other speeches cannot be chosen. */
export function FeaturedPositionInput(props: NumberInputProps) {
  const { holders } = useFeaturedHolders()
  return h('div', { role: 'radiogroup', 'aria-label': 'Featured position', style: { display: 'grid', gap: 8 } },
    ...Array.from({ length: FEATURED_LIMIT }, (_, i) => {
      const position = i + 1, holder = holders.find(item => item.position === position), selected = props.value === position
      return h('button', {
        key: position, type: 'button', role: 'radio', 'aria-checked': selected, disabled: props.readOnly || !!holder,
        onClick: () => props.onChange(set(position)),
        style: { textAlign: 'left', padding: '10px 12px', borderRadius: 6, font: 'inherit', color: 'inherit', cursor: holder ? 'not-allowed' : 'pointer', opacity: holder ? 0.55 : 1,
          border: selected ? '2px solid #2f4f9f' : '1px solid currentColor', background: selected ? '#2f4f9f1f' : 'transparent' },
      }, h('strong', {}, `${position} · ${SPOT_NAMES[i]}`), ' — ', holder ? `taken by “${holder.title}”` : selected ? 'this speech' : 'free')
    }))
}
