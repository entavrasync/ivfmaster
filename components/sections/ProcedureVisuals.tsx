'use client'

/* ─── Abstract SVG marks — shared between ProceduresHub cards and ProcedureDetail ── */

function IVFVisualFeatured() {
  return (
    <svg width="220" height="178" viewBox="0 0 220 178" fill="none" aria-hidden="true">
      <circle cx="82"  cy="89" r="65" stroke="rgba(148,164,196,0.09)" strokeWidth="1" />
      <circle cx="138" cy="89" r="65" stroke="rgba(226,132,156,0.09)" strokeWidth="1" />
      <circle cx="82"  cy="89" r="45" stroke="rgba(148,164,196,0.18)" strokeWidth="1.3" />
      <circle cx="138" cy="89" r="45" stroke="rgba(226,132,156,0.18)" strokeWidth="1.3" />
      <circle cx="82"  cy="89" r="27" fill="rgba(148,164,196,0.13)" stroke="rgba(148,164,196,0.24)" strokeWidth="1.4" />
      <circle cx="138" cy="89" r="27" fill="rgba(226,132,156,0.11)" stroke="rgba(226,132,156,0.24)" strokeWidth="1.4" />
      <circle cx="82"  cy="89" r="9"  fill="rgba(148,164,196,0.26)" />
      <circle cx="138" cy="89" r="9"  fill="rgba(226,132,156,0.24)" />
      <path
        d="M110 73 Q119 61 130 67 Q141 73 130 85 L110 105 L90 85 Q79 73 90 67 Q101 61 110 73Z"
        stroke="rgba(226,132,156,0.33)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IVFVisualSmall() {
  return (
    <svg width="62" height="62" viewBox="0 0 62 62" fill="none" aria-hidden="true">
      <circle cx="24" cy="31" r="15" fill="rgba(148,164,196,0.11)" stroke="rgba(148,164,196,0.28)" strokeWidth="1.3" />
      <circle cx="38" cy="31" r="15" fill="rgba(226,132,156,0.10)" stroke="rgba(226,132,156,0.28)" strokeWidth="1.3" />
      <path
        d="M31 25 Q35 19 40 22 Q45 25 40 31 L31 40 L22 31 Q17 25 22 22 Q27 19 31 25Z"
        stroke="rgba(226,132,156,0.36)"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IUIVisual() {
  return (
    <svg width="62" height="62" viewBox="0 0 62 62" fill="none" aria-hidden="true">
      <circle cx="52" cy="8"  r="8"  fill="rgba(100,120,200,0.13)" stroke="rgba(100,120,200,0.30)" strokeWidth="1.3" />
      <circle cx="52" cy="8"  r="4"  fill="rgba(100,120,200,0.22)" />
      <circle cx="52" cy="8"  r="14" stroke="rgba(100,120,200,0.10)" strokeWidth="1" />
      <path d="M8 58 Q16 36 30 20 Q42 8 51 7" stroke="rgba(100,120,200,0.40)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function ICSIVisual() {
  return (
    <svg width="62" height="62" viewBox="0 0 62 62" fill="none" aria-hidden="true">
      <circle cx="46" cy="16" r="13" fill="rgba(148,100,200,0.10)" stroke="rgba(148,100,200,0.28)" strokeWidth="1.3" />
      <circle cx="46" cy="16" r="6"  fill="rgba(148,100,200,0.18)" />
      <circle cx="46" cy="16" r="20" stroke="rgba(148,100,200,0.09)" strokeWidth="1" />
      <line x1="8"  y1="58" x2="38" y2="26" stroke="rgba(148,100,200,0.50)" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="7"  cy="59" r="2.8" fill="rgba(148,100,200,0.22)" />
      <circle cx="20" cy="46" r="1.4" fill="rgba(148,100,200,0.18)" />
    </svg>
  )
}

function EmbryoVisual() {
  const c = (o: number) => `rgba(72,140,172,${o})`
  return (
    <svg width="62" height="62" viewBox="0 0 62 62" fill="none" aria-hidden="true">
      <line x1="31" y1="5"  x2="31" y2="57" stroke={c(0.40)} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5"  y1="31" x2="57" y2="31" stroke={c(0.40)} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="12" x2="50" y2="50" stroke={c(0.20)} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="50" y1="12" x2="12" y2="50" stroke={c(0.20)} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="31" cy="31" r="5" fill={c(0.18)} stroke={c(0.32)} strokeWidth="1.2" />
      <line x1="31" y1="5"  x2="26" y2="11" stroke={c(0.22)} strokeWidth="1.1" strokeLinecap="round" />
      <line x1="31" y1="5"  x2="36" y2="11" stroke={c(0.22)} strokeWidth="1.1" strokeLinecap="round" />
      <line x1="31" y1="57" x2="26" y2="51" stroke={c(0.22)} strokeWidth="1.1" strokeLinecap="round" />
      <line x1="31" y1="57" x2="36" y2="51" stroke={c(0.22)} strokeWidth="1.1" strokeLinecap="round" />
      <line x1="5"  y1="31" x2="11" y2="26" stroke={c(0.22)} strokeWidth="1.1" strokeLinecap="round" />
      <line x1="5"  y1="31" x2="11" y2="36" stroke={c(0.22)} strokeWidth="1.1" strokeLinecap="round" />
      <line x1="57" y1="31" x2="51" y2="26" stroke={c(0.22)} strokeWidth="1.1" strokeLinecap="round" />
      <line x1="57" y1="31" x2="51" y2="36" stroke={c(0.22)} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

export function ProcVisual({
  id,
  featured = false,
}: Readonly<{ id: string; featured?: boolean }>) {
  if (id === 'ivf')             return featured ? <IVFVisualFeatured /> : <IVFVisualSmall />
  if (id === 'iui')             return <IUIVisual />
  if (id === 'icsi')            return <ICSIVisual />
  if (id === 'embryo-freezing') return <EmbryoVisual />
  return null
}
