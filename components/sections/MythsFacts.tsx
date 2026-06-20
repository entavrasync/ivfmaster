'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function MythsFacts() {
  const myths = [
    {
      id: 'myth-1',
      myth: 'IVF Babies Are Not "Normal"',
      fact: 'IVF children develop normally. Over 40 years and millions of births show IVF children have no increased health risks.',
    },
    {
      id: 'myth-2',
      myth: 'IVF Always Results In Twins',
      fact: 'Modern practice emphasizes single embryo transfer. Multiple births depend on how many embryos are transferred.',
    },
    {
      id: 'myth-3',
      myth: 'IVF Is Extremely Painful',
      fact: 'While some procedures cause mild discomfort, most IVF steps are painless. Sedation is used during egg retrieval.',
    },
    {
      id: 'myth-4',
      myth: 'You Can Never Get Pregnant Naturally After IVF',
      fact: 'Many couples conceive naturally after IVF. IVF doesn\'t permanently affect fertility potential.',
    },
    {
      id: 'myth-5',
      myth: 'Fertility Issues Are Always The Woman&apos;s Problem',
      fact: 'Male factor accounts for 40-50% of infertility cases. Both partners should be thoroughly evaluated.',
    },
    {
      id: 'myth-6',
      myth: 'You&apos;re Too Old For IVF At 40',
      fact: 'While age affects outcomes, IVF at 40+ is very possible. Success depends on egg quality, not just age.',
    },
  ];

  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="section-padding bg-ivf-cream">
      <div className="section-max-width">
        <div className="mb-16 text-center">
          <p className="text-ivf-pink font-semibold text-sm mb-2 uppercase tracking-wide">
            Separating Fact From Fiction
          </p>
          <h2 className="text-4xl font-bold text-ivf-dark mb-4">
            IVF Myths Debunked
          </h2>
          <p className="text-lg text-ivf-dark/70 max-w-2xl mx-auto">
            Let&apos;s clear up the most common misconceptions about IVF and fertility treatment.
          </p>
        </div>

        {/* Myths Accordion */}
        <div className="space-y-4 mb-12">
          {myths.map((item) => (
            <div
              key={item.id}
              className="bg-ivf-white border-2 border-ivf-border rounded-lg overflow-hidden hover:border-ivf-pink transition-all"
            >
              <button
                onClick={() =>
                  setExpandedId(expandedId === item.id ? null : item.id)
                }
                className="w-full p-6 flex items-start gap-4 hover:bg-ivf-cream/50 transition-colors text-left"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-ivf-dark">
                    {item.myth}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-ivf-pink flex-shrink-0 transition-transform ${
                    expandedId === item.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedId === item.id && (
                <div className="px-6 pb-6 border-t border-ivf-border">
                  <div className="bg-ivf-pink/5 rounded-lg p-4 border-l-4 border-ivf-pink">
                    <p className="font-semibold text-ivf-pink text-sm mb-2">
                      THE REALITY:
                    </p>
                    <p className="text-ivf-dark/80">{item.fact}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="bg-gradient-to-r from-ivf-pink/10 to-ivf-mauve/10 border border-ivf-border rounded-xl p-8 text-center">
          <p className="text-ivf-dark/80 mb-4">
            Have more questions about IVF myths and facts?
          </p>
          <a
            href="#final-cta"
            className="inline-block text-ivf-pink font-semibold hover:text-ivf-mauve transition-colors"
          >
            Book a consultation to discuss your specific concerns →
          </a>
        </div>
      </div>
    </section>
  );
}
