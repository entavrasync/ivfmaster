import { Container } from '@/components/layout/Container'
import { Reveal } from '@/components/motion/Reveal'
import { aboutContent } from '@/lib/content/about'

export function TrustInPractice() {
  const { trust } = aboutContent

  return (
    <section className="border-y border-taupe/70 bg-lavender py-20 sm:py-28 lg:py-36">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5" y={18}>
            <p className="eyebrow mb-5 text-navy">{trust.eyebrow}</p>
            <h2 className="display-lg max-w-[12ch]">{trust.title}</h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-slate">{trust.intro}</p>
          </Reveal>

          <ol className="border-t border-periwinkle/70 lg:col-span-6 lg:col-start-7">
            {trust.points.map((point, index) => (
              <li key={point.title} className="border-b border-periwinkle/70 py-7 sm:py-8">
                <Reveal delay={index * 0.05} y={12}>
                  <div className="grid gap-3 sm:grid-cols-[9rem_1fr] sm:gap-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.13em] text-navy">{point.label}</p>
                    <div>
                      <h3 className="text-2xl leading-snug text-ink">{point.title}</h3>
                      <p className="mt-3 text-base leading-7 text-slate">{point.body}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
