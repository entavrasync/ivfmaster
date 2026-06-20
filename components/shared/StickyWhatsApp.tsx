'use client';

import { MessageCircle } from 'lucide-react';

export function StickyWhatsApp() {
  const whatsappNumber = '919876543210';
  const message = encodeURIComponent(
    "Hi IVF Master! I'd like to know more about fertility treatment options."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-6 z-30 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all transform hover:scale-110 flex items-center justify-center"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
