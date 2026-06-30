'use client';

import { useState } from 'react';
import { Footer } from '@/components/shared/Footer';
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("Thank you for reaching out! We'll contact you within 24 hours.");
    setFormData({ name: '', email: '', phone: '', message: '' });
  }

  return (
    <>
      <main className="min-h-screen">
        <section className="section-padding bg-linear-to-b from-ivf-pink to-ivf-mauve">
          <div className="section-max-width text-center text-ivf-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Get In Touch</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Ready to take the first step? We're here to answer your questions.
            </p>
          </div>
        </section>

        <section className="section-padding bg-ivf-white">
          <div className="section-max-width">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-ivf-dark mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-ivf-dark mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-ivf-border rounded-lg focus:border-ivf-pink focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-ivf-dark mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-ivf-border rounded-lg focus:border-ivf-pink focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-ivf-dark mb-2">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-ivf-border rounded-lg focus:border-ivf-pink focus:outline-none transition-colors"
                      placeholder="+91 XXXX XXXX XX"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-ivf-dark mb-2">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border-2 border-ivf-border rounded-lg focus:border-ivf-pink focus:outline-none transition-colors resize-none"
                      placeholder="Tell us a bit about your situation"
                    />
                  </div>
                  <button type="submit" className="w-full btn-primary mt-6">
                    Send Message
                  </button>
                </form>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-ivf-dark mb-6">Other ways to reach us</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <Phone className="w-6 h-6 text-ivf-pink shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-ivf-dark mb-1">Phone</h3>
                      <a href="tel:+919876543210" className="text-ivf-dark/80 hover:text-ivf-pink transition-colors">
                        +91 9876 543 210
                      </a>
                      <p className="text-sm text-ivf-dark/60 mt-1">Mon-Sat: 9 AM – 6 PM IST</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Mail className="w-6 h-6 text-ivf-pink shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-ivf-dark mb-1">Email</h3>
                      <a href="mailto:info@ivfmaster.com" className="text-ivf-dark/80 hover:text-ivf-pink transition-colors">
                        info@ivfmaster.com
                      </a>
                      <p className="text-sm text-ivf-dark/60 mt-1">Response within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <MessageCircle className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-ivf-dark mb-1">WhatsApp</h3>
                      <a
                        href="https://wa.me/919876543210"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ivf-dark/80 hover:text-green-500 transition-colors"
                      >
                        Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <MapPin className="w-6 h-6 text-ivf-pink shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-ivf-dark mb-1">Location</h3>
                      <p className="text-ivf-dark/80">Sangli, Maharashtra, India</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Clock className="w-6 h-6 text-ivf-pink shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-ivf-dark mb-1">Consultation options</h3>
                      <ul className="text-ivf-dark/80 text-sm space-y-1">
                        <li>✓ Online consultations</li>
                        <li>✓ In-person visits</li>
                        <li>✓ Phone consultations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
