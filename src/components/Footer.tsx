import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail, Phone, Calendar } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0b0c10] border-t border-gray-800 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Intro */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-orange-500">
                <Image
                  src="/logo.jpg"
                  alt="Trichy Skaters Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-lg tracking-wide leading-tight">
                  TRICHY SKATERS
                </span>
                <span className="text-xs text-orange-500 font-semibold tracking-wider">
                  ROLLER SKATING CLUB
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm mb-4 leading-relaxed">
              Established to nurture young speed skaters and roller sports enthusiasts in Tiruchirappalli. We provide top-class training, state-level tournament preparation, and a thriving active community.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/trichy_skaters?igsh=NGNic3I2cTg0dGw4"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-800 text-white hover:bg-orange-500 hover:text-white transition-colors"
                title="Follow us on Instagram"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-500 transition-colors">About Club</Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-orange-500 transition-colors">Achievements</Link>
              </li>
              <li>
                <Link href="/posts" className="hover:text-orange-500 transition-colors">Club News / Posts</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-orange-500 transition-colors">Photo Gallery</Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-orange-500 transition-colors">Upcoming Events</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Anna Stadium Track & Roller Rink, Anna Nagar, Trichy, Tamil Nadu 620023</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-500 shrink-0" />
                <span>info@trichyskaters.com</span>
              </li>
            </ul>
          </div>

        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Trichy Skaters Roller Skating Club. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs">
            <Link href="/login" className="hover:text-orange-500">Skater Login</Link>
            <span className="text-gray-700">|</span>
            <Link href="/register" className="hover:text-orange-500">Join Club</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
