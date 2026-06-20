'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FAQ() {
  const faqs = [
    {
      id: 'faq-1',
      question: 'What should I do if I haven\'t been able to conceive?',
      answer: 'If you\'re under 35 and have been trying for over a year, or over 35 and trying for 6 months, it\'s worth getting an evaluation. We\'ll run tests and help you understand what\'s happening.',
    },
    {
      id: 'faq-2',
      question: 'Is IVF our only option?',
      answer: 'Not necessarily. It depends on your specific situation. Some couples conceive naturally with lifestyle changes, others need medication or less intensive treatments like IUI first. We\'ll discuss all options.',
    },
    {
      id: 'faq-3',
      question: 'How much does fertility treatment cost?',
      answer: 'Costs vary depending on the treatment. We\'ll provide transparent pricing upfront and discuss payment options. We also help navigate insurance coverage when available.',
    },
    {
      id: 'faq-4',
      question: 'How long does IVF take?',
      answer: 'From hormone stimulation to pregnancy test is typically 4-6 weeks. The entire process of evaluation, planning, and treatment might span 2-3 months.',
    },
    {
      id: 'faq-5',
      question: 'Will I need to take time off work?',
      answer: 'Most people continue working throughout IVF. You might want to take time off the day of egg retrieval and transfer. It depends on your comfort level.',
    },
    {
      id: 'faq-6',
      question: 'What if the first cycle doesn\'t work?',
      answer: 'Many couples need multiple cycles. This is normal and doesn\'t mean something is wrong. We\'ll discuss next steps and adjust the protocol if needed.',
    },
    {
      id: 'faq-7',
      question: 'Can my partner support me during treatment?',
      answer: 'Absolutely. We encourage partner involvement. They can attend consultations, be present during procedures, and be part of the decision-making process.',
    },
    {
      id: 'faq-8',
      question: 'Is fertility treatment emotionally difficult?',
      answer: 'The fertility journey can be emotionally complex. That\'s why we offer counseling and emotional support. Having expert guidance and realistic expectations helps tremendously.',
    },
  ];

  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="section-padding bg-ivf-cream">
      <div className="section-max-width">
        <div className="mb-16 text-center">
          <p className="text-ivf-pink font-semibold text-sm mb-2 uppercase tracking-wide">
            Common Questions Answered
          </p>
          <h2 className="text-4xl font-bold text-ivf-dark mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-ivf-dark/70 max-w-2xl mx-auto">
            Answers to questions we hear most often from couples considering fertility treatment.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-ivf-white border-2 border-ivf-border rounded-lg overflow-hidden hover:border-ivf-pink transition-all"
            >
              <button
                onClick={() =>
                  setExpandedId(expandedId === faq.id ? null : faq.id)
                }
                className="w-full p-6 flex items-start gap-4 hover:bg-ivf-cream/50 transition-colors text-left"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-ivf-dark">
                    {faq.question}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-ivf-pink flex-shrink-0 transition-transform ${
                    expandedId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedId === faq.id && (
                <div className="px-6 pb-6 border-t border-ivf-border">
                  <p className="text-ivf-dark/80 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="bg-gradient-to-r from-ivf-pink/10 to-ivf-mauve/10 border border-ivf-border rounded-xl p-8 text-center">
          <p className="text-lg font-semibold text-ivf-dark mb-2">Still Have Questions?</p>
          <p className="text-ivf-dark/80 mb-6">
            Every couple&apos;s situation is unique. Our doctors are happy to discuss your specific concerns.
          </p>
          <a
            href="#final-cta"
            className="inline-block text-ivf-pink font-semibold hover:text-ivf-mauve transition-colors"
          >
            Book a consultation →
          </a>
        </div>
      </div>
    </section>
  );
}
