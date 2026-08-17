'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast('Thank you for reaching out! We will get back to you shortly.', 'success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex-1 py-16 px-4 max-w-7xl mx-auto space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-wider">
          Contact <span className="text-orange-500">Us</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Have queries about coaching schedules, membership fees, or tournament entries? Get in touch!
        </p>
        <div className="h-1 w-20 bg-orange-500 mx-auto mt-2"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="p-8 rounded-lg bg-gray-950 border border-gray-800 space-y-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-bold text-white">Send Message</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rahul"
                  className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded p-2.5 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. rahul@example.com"
                  className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded p-2.5 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Subject</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g. Speed Skating Classes"
                className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded p-2.5 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Message</label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Type your message here..."
                className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded p-2.5 text-sm focus:border-orange-500 focus:outline-none resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 text-white font-bold p-2.5 rounded text-sm transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? 'Sending...' : 'Send Message'} <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Club Office Details & Location Map Info */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="p-8 rounded-lg bg-gray-950 border border-gray-800 space-y-6">
            <h2 className="text-xl font-bold text-white">Club Headquarters</h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <div className="text-sm text-gray-400">
                  <strong className="text-white">Address:</strong><br />
                  Anna Stadium Roller Rink Track, Anna Nagar,<br />
                  Tiruchirappalli, Tamil Nadu 620023
                </div>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 text-orange-500 shrink-0" />
                <div className="text-sm text-gray-400">
                  <strong className="text-white">Contact Phone:</strong><br />
                  +91 98765 43210 / +91 94432 10987
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 text-orange-500 shrink-0" />
                <div className="text-sm text-gray-400">
                  <strong className="text-white">Email Address:</strong><br />
                  info@trichyskaters.com / coach@trichyskaters.com
                </div>
              </li>
            </ul>
          </div>

          {/* Map Representation Box */}
          <div className="rounded-lg overflow-hidden border border-gray-800 h-64 bg-gray-950 p-6 flex flex-col justify-center items-center text-center space-y-2 relative">
            <MapPin className="h-10 w-10 text-orange-500 animate-bounce" />
            <h3 className="text-white font-bold text-sm">Anna Stadium, Trichy</h3>
            <p className="text-xs text-gray-400 max-w-xs">
              Located within the Anna Stadium Complex. Our coaching team is present at the track from 5:30 AM to 7:30 AM and 5:00 PM to 7:30 PM daily.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
