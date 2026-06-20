'use client';

import Link from 'next/link';
import { MessageCircle, Calendar } from 'lucide-react';

export function FinalCTA() {
  const whatsappNumber = '919876543210';
  const message = encodeURIComponent(
    "Hi IVF Master! I'd like to know more about fertility treatment options."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <section id="final-cta" className="section-padding bg-gradient-to-r from-ivf-pink to-ivf-mauve">
      <div className="section-max-width text-center text-ivf-white">
        <h2 className="text-5xl font-bold mb-4">Let&apos;s Start With Understanding</h2>

        <p className="text-xl text-ivf-white/90 max-w-2xl mx-auto mb-4">
          {"You don't need to make any decisions today. A conversation is the first step."}
        </p>

        <p className="text-lg text-ivf-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
          Book a consultation where we listen, evaluate, and explain. No pressure. 
          Just clarity and a clear path forward based on your unique situation.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 bg-ivf-white text-ivf-pink hover:bg-ivf-cream font-semibold py-4 px-8 rounded-lg transition-colors"
          >
            <Calendar className="w-5 h-5" />
            Book Consultation
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border-2 border-ivf-white text-ivf-white hover:bg-ivf-white/10 font-semibold py-4 px-8 rounded-lg transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Chat On WhatsApp
          </a>
        </div>

        {/* Trust Message */}
        <div className="mt-12 pt-12 border-t border-ivf-white/20">
          <p className="text-sm text-ivf-white/80 mb-4">
            ✓ Confidential consultations  •  ✓ Expert guidance  •  ✓ No judgment
          </p>
          <p className="text-sm text-ivf-white/70">
            Response within 24 hours. Consultations available online and in-person in Sangli.
          </p>
        </div>
      </div>
    </section>
  );
}
