'use client';

import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/educate-ivf', label: 'Learn About IVF' },
    { href: '/procedures', label: 'Procedures' },
    { href: '/team', label: 'Team' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Scroll effect handler
  useEffect(() => {
    let lastScrollY = 0;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > 100) {
        // Only hide after scrolling past 100px
        setIsVisible(false);
      }
      
      lastScrollY = currentScrollY;
      setScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-40 bg-ivf-white border-b border-ivf-border/20 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="w-full">
        <div className="max-w-none mx-auto px-6 lg:px-16">
          <div className="flex justify-between items-center py-3 lg:py-4 gap-6 lg:gap-8">
            {/* Left Section - Logo */}
            <Link href="/" className="flex-shrink-0 group">
              <div className="text-base lg:text-lg font-semibold text-ivf-pink tracking-tight group-hover:opacity-80 transition-opacity duration-300">
                IVF Master
              </div>
            </Link>

            {/* Center Section - Navigation (Desktop Only) */}
            <div className="hidden xl:flex items-center gap-1 w-fit bg-ivf-cream/40 backdrop-blur-sm rounded-full px-4 py-2 border border-ivf-pink/10 mx-auto">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs lg:text-sm font-light px-3 py-1.5 lg:px-4 lg:py-2 rounded-full transition-all duration-300 ${
                      active
                        ? 'bg-ivf-pink text-white font-semibold shadow-md'
                        : 'text-ivf-dark/60 hover:bg-ivf-pink/10 hover:text-ivf-dark'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Section - CTA Button & Mobile Toggle */}
            <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
              {/* Desktop CTA - Premium Button */}
              <Link
                href="/contact"
                className="hidden md:flex items-center gap-2 bg-ivf-pink hover:bg-ivf-mauve text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-full font-semibold text-xs lg:text-sm transition-all duration-300 hover:shadow-lg hover:scale-105 group"
              >
                Book Consultation
                <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className="xl:hidden p-1.5"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="w-5 h-5 text-ivf-dark" />
                ) : (
                  <Menu className="w-5 h-5 text-ivf-dark" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation - Full Width Below */}
          {isOpen && (
            <div className="xl:hidden border-t border-ivf-border/20 py-4 animate-fade-in-up">
              <div className="space-y-2 mb-4">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-sm font-light block px-3 py-2 rounded-lg transition-all duration-300 ${
                        active
                          ? 'bg-ivf-pink text-white font-semibold'
                          : 'text-ivf-dark/60 hover:bg-ivf-cream/60'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
              <div className="border-t border-ivf-border/20 pt-4">
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 bg-ivf-pink hover:bg-ivf-mauve text-white px-4 py-2.5 rounded-full font-semibold transition-all duration-300 w-full group text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Book Consultation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
