import type { JSX } from 'react'

/* ─── Shared procedure data — consumed by desktop dropdown + mobile accordion */

export type Procedure = {
  readonly id:          string
  readonly label:       string
  readonly description: string
  readonly href:        string
  readonly markBg:      string
  readonly markColor:   string
}

export const PROCEDURES: ReadonlyArray<Procedure> = [
  {
    id:          'ivf',
    label:       'IVF',
    description: 'The complete journey, explained gently, step by step.',
    href:        '/procedures/ivf',
    markBg:      'rgba(226,132,156,0.14)',
    markColor:   'rgba(200,96,128,0.72)',
  },
  {
    id:          'iui',
    label:       'IUI',
    description: 'A simpler first step for the right couples.',
    href:        '/procedures/iui',
    markBg:      'rgba(100,120,176,0.14)',
    markColor:   'rgba(72,96,160,0.72)',
  },
  {
    id:          'icsi',
    label:       'ICSI',
    description: 'A precise helping hand when sperm needs support.',
    href:        '/procedures/icsi',
    markBg:      'rgba(148,100,192,0.12)',
    markColor:   'rgba(120,72,168,0.72)',
  },
  {
    id:          'embryo-freezing',
    label:       'Embryo freezing',
    description: 'Preserving your best embryos, safely, for the future.',
    href:        '/procedures/embryo-freezing',
    markBg:      'rgba(72,140,172,0.12)',
    markColor:   'rgba(52,112,140,0.72)',
  },
]

/* ─── Minimal line-mark SVGs, one per procedure ──────────────────────────── */

const MARKS: Readonly<Record<string, (c: string) => JSX.Element>> = {
  /* Two overlapping circles — fertilisation / journey */
  ivf: (c) => (
    <>
      <circle cx="7.5"  cy="10" r="4"   stroke={c} strokeWidth="1.4" fill="none" />
      <circle cx="12.5" cy="10" r="4"   stroke={c} strokeWidth="1.4" fill="none" />
    </>
  ),

  /* Ascending arc + egg — gentle catheter approach */
  iui: (c) => (
    <>
      <path   d="M4 15 Q6 8 11 5.5"    stroke={c} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <circle cx="13.5" cy="5" r="2.5" stroke={c} strokeWidth="1.3" fill="none" />
    </>
  ),

  /* Precision needle approaching a cell */
  icsi: (c) => (
    <>
      <line   x1="5"    y1="15"   x2="13.5" y2="6.5" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="14.5" cy="5.5"  r="2.2"             stroke={c} strokeWidth="1.3" fill="none" />
      <circle cx="5.5"  cy="14.5" r="1.2"             fill={c}   opacity={0.5} />
    </>
  ),

  /* Minimal snowflake crystal */
  'embryo-freezing': (c) => (
    <>
      <line x1="10" y1="3"    x2="10" y2="17"   stroke={c} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="3"  y1="10"   x2="17" y2="10"   stroke={c} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="5.5" y1="5.5" x2="14.5" y2="14.5" stroke={c} strokeWidth="1.1" strokeLinecap="round" opacity={0.5} />
      <line x1="14.5" y1="5.5" x2="5.5" y2="14.5" stroke={c} strokeWidth="1.1" strokeLinecap="round" opacity={0.5} />
    </>
  ),
}

/* ─── Soft visual mark — reused by desktop panel + mobile accordion ───────── */

export function ProcedureMark({
  proc,
  size = 36,
}: Readonly<{ proc: Procedure; size?: number }>) {
  const drawFn = MARKS[proc.id]
  return (
    <div
      aria-hidden="true"
      style={{
        width:          size,
        height:         size,
        borderRadius:   '9px',
        background:     proc.markBg,
        flexShrink:     0,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width={Math.round(size * 0.56)}
        height={Math.round(size * 0.56)}
        viewBox="0 0 20 20"
        fill="none"
      >
        {drawFn?.(proc.markColor)}
      </svg>
    </div>
  )
}
