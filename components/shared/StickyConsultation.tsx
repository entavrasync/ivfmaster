'use client';

import Link from 'next/link';
import { Phone, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function StickyConsultation() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 500px
      setIsVisible(window.scrollY > 500 && !isDismissed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-30 animate-fade-in">
      {/* Premium Minimal CTA Button */}
      <Link
        href="/contact"
        className="group flex items-center gap-3 bg-ivf-pink hover:bg-ivf-mauve text-white px-5 py-3 rounded-full font-semibold text-sm shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 relative"
      >
        <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
        Book Consultation
        {/* Close button for dismissal */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsDismissed(true);
          }}
          className="absolute -top-2 -right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="w-3 h-3 text-ivf-pink" />
        </button>
      </Link>
    </div>
  );
}
