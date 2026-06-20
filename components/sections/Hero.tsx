'use client';

import { ArrowRight, HeartHandshake, MessageCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  const whatsappNumber = '919876543210';
  const message = encodeURIComponent(
    "Hi IVF Master! I'd like to know more about fertility treatment options."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <section className="relative bg-ivf-cream overflow-hidden">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-ivf-pink/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-ivf-mauve/6 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-ivf-pink/4 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 section-max-width px-6 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.9fr)] gap-8 lg:gap-12 items-center">
          {/* Editorial Content - Large and Expressive */}
          <div className="space-y-6 animate-fade-in-up">
            {/* Eyebrow Text */}
            <div className="inline-block">
              <p className="text-xs font-light tracking-widest uppercase text-ivf-mauve/80">Your Fertility Journey</p>
            </div>

            {/* Main Headline - Editorial Scale */}
            <h1 className="text-5xl sm:text-6xl font-bold text-ivf-dark leading-tight">
              Trying To Conceive Is Rarely Simple.
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-ivf-dark/70 font-light">
              {"Understanding why doesn't have to be either."}
            </p>

            {/* Body Copy */}
            <p className="text-base text-ivf-dark/75 leading-relaxed max-w-lg">
              At IVF Master, we believe that clear understanding comes before any decision. Our approach is built on compassion, transparency, and personalized care—guiding couples through their fertility journey with confidence and hope.
            </p>

            {/* Premium Trust Indicators */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="text-ivf-pink text-xl flex-shrink-0 pt-0.5">✓</div>
                <div>
                  <p className="font-semibold text-sm text-ivf-dark">15+ Years of Excellence</p>
                  <p className="text-xs text-ivf-dark/60">Trusted by thousands of families</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-ivf-pink text-xl flex-shrink-0 pt-0.5">🤝</div>
                <div>
                  <p className="font-semibold text-sm text-ivf-dark">2500+ Success Stories</p>
                  <p className="text-xs text-ivf-dark/60">Real journeys, real results, real hope</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Link
                href="/educate-ivf"
                className="btn-primary flex items-center justify-center gap-3 group"
              >
                Explore Your Options
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-5 h-5" />
                Chat With Us
              </a>
            </div>
          </div>

          {/* Visual/Imagery Side - Asymmetrical */}
          <div className="relative hidden min-h-[520px] items-center justify-center self-stretch lg:flex">
            <div className="relative flex min-h-[520px] w-full items-center justify-center animate-fade-in-scale" style={{animationDelay: '0.2s'}}>
              {/* Layered Visual Elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Large Background Shape */}
                <div className="absolute h-72 w-72 rounded-[44px] bg-gradient-to-br from-ivf-pink/10 to-ivf-mauve/7 blur-3xl" />
                
                {/* Mid-layer Shape */}
                <div className="absolute h-56 w-56 animate-float rounded-[34px] bg-ivf-pink/7 blur-2xl" />
                
                {/* Premium Care Card */}
                <div className="relative w-52 overflow-hidden rounded-2xl bg-white/90 px-6 py-7 text-center shadow-[0_8px_14px_rgba(43,43,43,0.07)] outline outline-1 outline-white/70">
                  <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-ivf-pink/50 to-transparent" />
                  <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-ivf-pink/10 blur-2xl" />

                  <div className="relative flex flex-col items-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ivf-pink/10 text-ivf-pink ring-1 ring-ivf-pink/15">
                      <HeartHandshake className="h-6 w-6" strokeWidth={1.7} />
                    </div>

                    <p className="mb-2 flex items-center gap-1.5 text-[10px] font-medium tracking-[0.16em] text-ivf-mauve">
                      <Sparkles className="h-3 w-3" strokeWidth={1.8} />
                      IVF MASTER
                    </p>
                    <div className="space-y-1">
                      <p className="text-base font-semibold leading-tight text-ivf-dark">here will be the hero section,</p>
                      <p className="text-base font-semibold leading-tight text-ivf-pink">Photo</p>
                    </div>

                    <div className="my-4 h-px w-14 bg-ivf-border" />

                    <p className="max-w-40 text-xs leading-relaxed text-ivf-dark/65">
                      Consultant-led fertility care with clarity at every step.
                    </p>
                  </div>
                </div>

                {/* Accent Elements */}
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-ivf-pink/8 rounded-full blur-2xl" />
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-ivf-mauve/6 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
