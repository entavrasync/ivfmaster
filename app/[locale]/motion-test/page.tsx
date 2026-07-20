import { Reveal, Stagger, StaggerItem, FadeIn, Parallax, Pressable } from '@/components/motion'

const SWATCHES = [
  { bg: '#2E4F8E', label: 'Navy' },
  { bg: '#E2849C', label: 'Blush' },
  { bg: '#97A6D2', label: 'Periwinkle' },
  { bg: '#ECEFF9', label: 'Lavender', dark: true },
  { bg: '#D8CCBE', label: 'Taupe', dark: true },
]

export default function MotionTest() {
  return (
    <main
      style={{
        backgroundColor: '#FBF7F1',
        color: '#1C2A48',
        fontFamily: 'var(--font-body)',
        maxWidth: '56rem',
        margin: '0 auto',
        padding: '6rem 2rem 12rem',
      }}
    >
      {/* Header */}
      <FadeIn>
        <p className="eyebrow" style={{ marginBottom: '1rem' }}>Motion foundation · IVF Master</p>
        <h1 className="display-lg" style={{ color: '#1C2A48', marginBottom: '1.5rem' }}>
          Motion primitives test
        </h1>
        <p className="lead" style={{ marginBottom: '5rem' }}>
          Scroll down to verify each primitive. All effects should feel calm,
          deliberate, and documentary. Nothing fast or bouncy.
        </p>
      </FadeIn>

      {/* ── Reveal ─────────────────────────────────────────────────── */}
      <section style={{ marginBottom: '6rem' }}>
        <FadeIn delay={0.1}>
          <p className="eyebrow" style={{ marginBottom: '2rem' }}>
            01 — Reveal (fade + rise on scroll)
          </p>
        </FadeIn>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {['First block enters the view.', 'Second follows with a delay.', 'Third brings up the rear.'].map(
            (text, i) => (
              <Reveal key={i} delay={i * 0.12} y={20}>
                <div
                  style={{
                    padding: '2rem 2.5rem',
                    backgroundColor: '#ECEFF9',
                    borderRadius: '0.75rem',
                    border: '1px solid #D8CCBE',
                  }}
                >
                  <p className="body-text">{text}</p>
                </div>
              </Reveal>
            )
          )}
        </div>
      </section>

      {/* ── Stagger ────────────────────────────────────────────────── */}
      <section style={{ marginBottom: '6rem' }}>
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: '2rem' }}>
            02 — Stagger (children cascade in sequence)
          </p>
        </Reveal>

        <Stagger
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))',
            gap: '1rem',
          }}
        >
          {SWATCHES.map(({ bg, label, dark }) => (
            <StaggerItem key={label}>
              <div
                style={{
                  height: '8rem',
                  backgroundColor: bg,
                  borderRadius: '0.625rem',
                  border: '1px solid #D8CCBE',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '0.75rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: dark ? '#1C2A48' : '#FBF7F1',
                    opacity: 0.85,
                  }}
                >
                  {label}
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ── Parallax ───────────────────────────────────────────────── */}
      <section style={{ marginBottom: '6rem' }}>
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: '2rem' }}>
            03 — Parallax (gentle Y offset on scroll)
          </p>
        </Reveal>

        <div
          style={{
            position: 'relative',
            height: '18rem',
            backgroundColor: '#1C2A48',
            borderRadius: '1rem',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Background layer — more parallax */}
          <Parallax range={48} className="absolute inset-0 flex items-center justify-center">
            <div
              style={{
                width: '24rem',
                height: '24rem',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #97A6D2 0%, transparent 70%)',
                opacity: 0.25,
              }}
            />
          </Parallax>

          {/* Foreground text — less parallax */}
          <Parallax range={16}>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                fontWeight: 500,
                color: '#FBF7F1',
                textAlign: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              Layers move at different rates.
            </p>
          </Parallax>
        </div>
      </section>

      {/* ── FadeIn ─────────────────────────────────────────────────── */}
      <section style={{ marginBottom: '6rem' }}>
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: '2rem' }}>
            04 — FadeIn (opacity only — reduced-motion safe)
          </p>
        </Reveal>

        <FadeIn delay={0.1}>
          <blockquote
            style={{
              borderLeft: '3px solid #97A6D2',
              paddingLeft: '2rem',
              marginLeft: 0,
            }}
          >
            <p className="display-lg" style={{ color: '#1C2A48', marginBottom: '1rem' }}>
              &ldquo;Every detail should feel intentional.&rdquo;
            </p>
            <p className="lead">This text fades in with no transform — safe for all users.</p>
          </blockquote>
        </FadeIn>
      </section>

      {/* ── Pressable ──────────────────────────────────────────────── */}
      <section style={{ marginBottom: '6rem' }}>
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: '2rem' }}>
            05 — Pressable (hover scale + tap spring + optional haptic)
          </p>
        </Reveal>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Pressable haptic>
            <button
              style={{
                backgroundColor: '#2E4F8E',
                color: '#FBF7F1',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '1rem',
                padding: '1rem 2.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.01em',
              }}
            >
              Book a consultation
            </button>
          </Pressable>

          <Pressable>
            <div
              style={{
                backgroundColor: '#ECEFF9',
                border: '1.5px solid #D8CCBE',
                borderRadius: '0.75rem',
                padding: '1.25rem 2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  backgroundColor: '#E2849C',
                }}
              />
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    color: '#1C2A48',
                    marginBottom: '0.2rem',
                  }}
                >
                  Card element
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: '#5A6173' }}>
                  Hover and press me
                </p>
              </div>
            </div>
          </Pressable>
        </div>
      </section>

      {/* ── Stagger with text list ──────────────────────────────────── */}
      <section>
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: '2rem' }}>
            06 — Stagger with text list
          </p>
        </Reveal>

        <Stagger style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            'Calm, not clinical.',
            'Warm, not cold.',
            'Human, not algorithmic.',
            'Trustworthy, not boastful.',
          ].map((item, i) => (
            <StaggerItem key={i}>
              <div
                style={{
                  padding: '1.5rem 0',
                  borderBottom: '1px solid #D8CCBE',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: '#8A8F9C',
                    minWidth: '1.5rem',
                  }}
                >
                  0{i + 1}
                </span>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
                    fontWeight: 500,
                    color: '#1C2A48',
                  }}
                >
                  {item}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </main>
  )
}
