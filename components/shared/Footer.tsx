'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-ivf-dark text-ivf-cream pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-xl text-ivf-pink mb-3">IVF Master</h3>
            <p className="text-sm text-ivf-cream/80">
              Premium fertility care with compassion. Guiding couples through their journey to parenthood.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-ivf-cream/80 hover:text-ivf-pink transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/educate-ivf" className="text-ivf-cream/80 hover:text-ivf-pink transition-colors">
                  Learn About IVF
                </Link>
              </li>
              <li>
                <Link href="/procedures" className="text-ivf-cream/80 hover:text-ivf-pink transition-colors">
                  Our Procedures
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-ivf-cream/80 hover:text-ivf-pink transition-colors">
                  Our Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-ivf-cream/80 hover:text-ivf-pink transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-ivf-cream/80 hover:text-ivf-pink transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#faq" className="text-ivf-cream/80 hover:text-ivf-pink transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-ivf-cream/80 hover:text-ivf-pink transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-ivf-cream/80">
                <Phone className="w-4 h-4 text-ivf-pink" />
                <a href="tel:+919876543210" className="hover:text-ivf-pink transition-colors">
                  +91 9876 543 210
                </a>
              </li>
              <li className="flex items-center gap-2 text-ivf-cream/80">
                <Mail className="w-4 h-4 text-ivf-pink" />
                <a href="mailto:info@ivfmaster.com" className="hover:text-ivf-pink transition-colors">
                  info@ivfmaster.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-ivf-cream/80">
                <MapPin className="w-4 h-4 text-ivf-pink mt-1 flex-shrink-0" />
                <span>Sangli, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-ivf-cream/20 mb-6"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-ivf-cream/60">
          <p>&copy; 2026 IVF Master. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-ivf-pink transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-ivf-pink transition-colors">
              Terms of Service
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="hover:text-ivf-pink transition-colors flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
