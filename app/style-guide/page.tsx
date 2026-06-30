const palette = [
  { name: 'ivory',      hex: '#FBF7F1', label: 'Page background',          textDark: true  },
  { name: 'navy',       hex: '#2E4F8E', label: 'Primary — headings, logo', textDark: false },
  { name: 'ink',        hex: '#1C2A48', label: 'Darkest text',             textDark: false },
  { name: 'periwinkle', hex: '#97A6D2', label: 'Secondary accent',         textDark: true  },
  { name: 'lavender',   hex: '#ECEFF9', label: 'Section tint / cards',     textDark: true  },
  { name: 'blush',      hex: '#E2849C', label: 'CTA / warm highlight',     textDark: true  },
  { name: 'taupe',      hex: '#D8CCBE', label: 'Borders / warm neutral',   textDark: true  },
]

const textTokens = [
  { label: 'text-primary (ink)',      hex: '#1C2A48', sample: 'The quick brown fox jumps over the lazy dog.' },
  { label: 'text-secondary (slate)',  hex: '#5A6173', sample: 'The quick brown fox jumps over the lazy dog.' },
  { label: 'text-muted (ash)',        hex: '#8A8F9C', sample: 'The quick brown fox jumps over the lazy dog.' },
]

export default function StyleGuide() {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: '#FBF7F1', padding: '4rem 2rem', maxWidth: '64rem', margin: '0 auto' }}
    >
      {/* Header */}
      <header style={{ marginBottom: '5rem' }}>
        <p className="eyebrow" style={{ marginBottom: '1.25rem' }}>
          Design Foundation · IVF Master
        </p>
        <h1 className="display-xl" style={{ color: '#1C2A48', marginBottom: '1.5rem' }}>
          Token & Typography<br />Style Guide
        </h1>
        <p className="lead" style={{ maxWidth: '42rem' }}>
          Every color, typeface, and scale used across the brand. Verify this foundation
          before building any page sections.
        </p>
      </header>

      {/* ── Color Palette ─────────────────────────────────────────────── */}
      <section style={{ marginBottom: '5rem' }}>
        <p className="eyebrow" style={{ marginBottom: '2rem' }}>01 — Color Palette</p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(12rem, 1fr))',
            gap: '1rem',
          }}
        >
          {palette.map(({ name, hex, label, textDark }) => (
            <div
              key={name}
              style={{
                backgroundColor: hex,
                borderRadius: '0.75rem',
                overflow: 'hidden',
                border: '1px solid #D8CCBE',
              }}
            >
              <div style={{ height: '7rem', backgroundColor: hex }} />
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: textDark ? '#FBF7F1' : '#1C2A48',
                  color: textDark ? '#1C2A48' : '#FBF7F1',
                }}
              >
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  {name}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.25rem' }}>
                  {hex}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', opacity: 0.55 }}>
                  bg-{name} / text-{name}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', opacity: 0.45, marginTop: '0.25rem' }}>
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Text tokens ───────────────────────────────────────────────── */}
      <section style={{ marginBottom: '5rem' }}>
        <p className="eyebrow" style={{ marginBottom: '2rem' }}>02 — Text Color Tokens</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {textTokens.map(({ label, hex, sample }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '2rem',
                padding: '1.25rem 1.5rem',
                backgroundColor: '#ECEFF9',
                borderRadius: '0.625rem',
                border: '1px solid #D8CCBE',
              }}
            >
              <div style={{ minWidth: '14rem', flexShrink: 0 }}>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.8rem', color: '#1C2A48', marginBottom: '0.25rem' }}>
                  {label}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#5A6173' }}>{hex}</p>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem', color: hex, lineHeight: 1.7 }}>
                {sample}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Type Scale ────────────────────────────────────────────────── */}
      <section style={{ marginBottom: '5rem' }}>
        <p className="eyebrow" style={{ marginBottom: '2.5rem' }}>03 — Type Scale</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

          {/* display-xl */}
          <div style={{ borderTop: '1px solid #D8CCBE', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div style={{ minWidth: '9rem', flexShrink: 0, paddingTop: '0.5rem' }}>
                <p className="eyebrow">display-xl</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#8A8F9C', marginTop: '0.375rem' }}>
                  clamp(3–5.5rem)<br />Fraunces / 500<br />leading 1.05
                </p>
              </div>
              <p className="display-xl" style={{ color: '#1C2A48' }}>
                Your path to parenthood begins here.
              </p>
            </div>
          </div>

          {/* display-lg */}
          <div style={{ borderTop: '1px solid #D8CCBE', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div style={{ minWidth: '9rem', flexShrink: 0, paddingTop: '0.5rem' }}>
                <p className="eyebrow">display-lg</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#8A8F9C', marginTop: '0.375rem' }}>
                  clamp(2.25–3.75rem)<br />Fraunces / 500<br />leading 1.1
                </p>
              </div>
              <p className="display-lg" style={{ color: '#1C2A48' }}>
                Compassionate care, from the very first step.
              </p>
            </div>
          </div>

          {/* heading */}
          <div style={{ borderTop: '1px solid #D8CCBE', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div style={{ minWidth: '9rem', flexShrink: 0, paddingTop: '0.375rem' }}>
                <p className="eyebrow">heading</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#8A8F9C', marginTop: '0.375rem' }}>
                  clamp(1.5–2.25rem)<br />Fraunces / 500<br />leading 1.35
                </p>
              </div>
              <p className="heading" style={{ color: '#1C2A48' }}>
                Every treatment plan is built around you, not a protocol.
              </p>
            </div>
          </div>

          {/* lead */}
          <div style={{ borderTop: '1px solid #D8CCBE', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div style={{ minWidth: '9rem', flexShrink: 0, paddingTop: '0.25rem' }}>
                <p className="eyebrow">lead</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#8A8F9C', marginTop: '0.375rem' }}>
                  1.25rem<br />Hanken / 400<br />leading 1.75<br />color: slate
                </p>
              </div>
              <p className="lead">
                We understand that fertility treatment carries deep emotional weight.
                Our team at IVF Master walks with you through every decision, every result,
                and every moment of hope.
              </p>
            </div>
          </div>

          {/* body-text */}
          <div style={{ borderTop: '1px solid #D8CCBE', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div style={{ minWidth: '9rem', flexShrink: 0, paddingTop: '0.25rem' }}>
                <p className="eyebrow">body-text</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#8A8F9C', marginTop: '0.375rem' }}>
                  1.0625rem<br />Hanken / 400<br />leading 1.7
                </p>
              </div>
              <p className="body-text" style={{ color: '#1C2A48', maxWidth: '40rem' }}>
                IVF (in vitro fertilisation) is an assisted reproductive technique in which eggs
                are retrieved from the ovaries and fertilised with sperm in a laboratory. The
                resulting embryos are cultured for several days and then transferred to the uterus.
                Success rates depend on a range of individual factors, and our team will guide you
                through each step with honesty and warmth.
              </p>
            </div>
          </div>

          {/* eyebrow */}
          <div style={{ borderTop: '1px solid #D8CCBE', paddingTop: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid #D8CCBE' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <div style={{ minWidth: '9rem', flexShrink: 0 }}>
                <p className="eyebrow">eyebrow</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: '#8A8F9C', marginTop: '0.375rem' }}>
                  0.8125rem<br />Hanken / 500<br />tracking 0.1em<br />uppercase<br />color: ash
                </p>
              </div>
              <p className="eyebrow">Our services · Fertility treatment · IVF Master</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── Sample paragraph ──────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#ECEFF9',
          borderRadius: '1rem',
          padding: '3rem',
          border: '1px solid #D8CCBE',
          marginBottom: '4rem',
        }}
      >
        <p className="eyebrow" style={{ marginBottom: '2rem' }}>04 — Sample editorial block</p>
        <p className="heading" style={{ color: '#1C2A48', marginBottom: '1.25rem' }}>
          What to expect on your first visit
        </p>
        <p className="lead" style={{ marginBottom: '1.5rem' }}>
          Your first consultation is a conversation, not a clinical assessment. We want to
          understand your story before we talk about any treatment.
        </p>
        <p className="body-text" style={{ color: '#1C2A48', marginBottom: '1.25rem' }}>
          During this session, Dr. Mandrupkar will review your complete reproductive history,
          any previous investigations, and the specific concerns that brought you here. There
          are no rushed checklists. You will have time to ask every question you have been
          carrying, and we will answer each one with complete honesty.
        </p>
        <p className="body-text" style={{ color: '#1C2A48' }}>
          By the end of the appointment, you will have a clear picture of the recommended
          next steps — and the confidence that comes from knowing exactly what lies ahead.
        </p>
      </section>

      <footer style={{ textAlign: 'center', paddingBottom: '3rem' }}>
        <p className="eyebrow">IVF Master · Mandrupkar Clinic · Design Foundation v1</p>
      </footer>
    </main>
  )
}
