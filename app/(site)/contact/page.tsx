'use client';

import Link from 'next/link';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for reaching out! We\'ll contact you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-b from-ivf-pink to-ivf-mauve">
          <div className="section-max-width text-center text-ivf-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Get In Touch
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              {"Ready to take the first step? We're here to answer your questions and help you understand your options."}
            </p>
          </div>
        </section>

        {/* What Happens Next */}
        <section className="section-padding bg-ivf-cream">
          <div className="section-max-width max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-ivf-dark mb-8">What happens next</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { step: 1, title: 'You Reach Out', desc: 'Contact us via form, phone, or WhatsApp' },
                { step: 2, title: 'We Respond', desc: 'Within 24 hours with available consultation times' },
                { step: 3, title: 'You Consult', desc: 'Online or in-person, there\'s no obligation' },
              ].map((item) => (
                <div key={item.step} className="bg-ivf-white rounded-lg p-6 border-2 border-ivf-border">
                  <div className="text-4xl font-bold text-ivf-pink mb-3">{item.step}</div>
                  <h3 className="font-bold text-ivf-dark mb-2">{item.title}</h3>
                  <p className="text-sm text-ivf-dark/70">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-ivf-dark/80">
              <span className="font-semibold">Important:</span> {"You don't need to commit to anything today. A consultation is simply a conversation where we listen and explain your options."}
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-padding bg-ivf-white">
          <div className="section-max-width">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-ivf-dark mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-ivf-dark mb-2">
                      Full Name
                    </label>
                    <input
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
                    <label className="block text-sm font-semibold text-ivf-dark mb-2">
                      Email
                    </label>
                    <input
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
                    <label className="block text-sm font-semibold text-ivf-dark mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-ivf-border rounded-lg focus:border-ivf-pink focus:outline-none transition-colors"
                      placeholder="+91 XXXX XXXX XX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-ivf-dark mb-2">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border-2 border-ivf-border rounded-lg focus:border-ivf-pink focus:outline-none transition-colors resize-none"
                      placeholder="Tell us a bit about your situation (optional, but helps us prepare)"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary mt-6"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-3xl font-bold text-ivf-dark mb-6">Other ways to reach us</h2>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <Phone className="w-6 h-6 text-ivf-pink flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-ivf-dark mb-1">Phone</h3>
                      <a href="tel:+919876543210" className="text-ivf-dark/80 hover:text-ivf-pink transition-colors">
                        +91 9876 543 210
                      </a>
                      <p className="text-sm text-ivf-dark/60 mt-1">
                        Mon-Sat: 9 AM - 6 PM IST
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Mail className="w-6 h-6 text-ivf-pink flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-ivf-dark mb-1">Email</h3>
                      <a href="mailto:info@ivfmaster.com" className="text-ivf-dark/80 hover:text-ivf-pink transition-colors">
                        info@ivfmaster.com
                      </a>
                      <p className="text-sm text-ivf-dark/60 mt-1">
                        Response within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <MessageCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-ivf-dark mb-1">WhatsApp</h3>
                      <a
                        href="https://wa.me/919876543210?text=Hi%20IVF%20Master%21%20I%27d%20like%20to%20know%20more%20about%20fertility%20treatment%20options."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ivf-dark/80 hover:text-green-500 transition-colors"
                      >
                        Chat on WhatsApp
                      </a>
                      <p className="text-sm text-ivf-dark/60 mt-1">
                        Quick messages anytime
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <MapPin className="w-6 h-6 text-ivf-pink flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-ivf-dark mb-1">Location</h3>
                      <p className="text-ivf-dark/80">
                        Sangli, Maharashtra<br />
                        India
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Clock className="w-6 h-6 text-ivf-pink flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-ivf-dark mb-1">Consultation Options</h3>
                      <ul className="text-ivf-dark/80 text-sm space-y-1">
                        <li>✓ Online consultations</li>
                        <li>✓ In-person visits</li>
                        <li>✓ Phone consultations</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Assurance */}
                <div className="mt-8 bg-gradient-to-br from-ivf-pink/10 to-ivf-mauve/10 rounded-lg p-6 border border-ivf-border">
                  <p className="text-sm text-ivf-dark/80">
                    <span className="font-semibold">Your Privacy:</span> All information you share is 
                    completely confidential. No shared information with anyone else.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final Message */}
        <section className="section-padding bg-ivf-cream text-center">
          <div className="section-max-width max-w-2xl">
            <h2 className="text-3xl font-bold text-ivf-dark mb-4">{"We're Ready When You Are"}</h2>
            <p className="text-lg text-ivf-dark/80">
              {"Whether you have questions, concerns, or are ready to begin your fertility journey, we're here to listen and help. Reach out today."}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
