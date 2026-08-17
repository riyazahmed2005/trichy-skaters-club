'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Posts', path: '/posts' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Events', path: '/events' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0b0c10]/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-orange-500">
                <Image
                  src="/logo.jpg"
                  alt="Trichy Skaters Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white tracking-wide text-sm sm:text-base leading-tight">
                  TRICHY SKATERS
                </span>
                <span className="text-[10px] text-orange-500 font-semibold tracking-wider">
                  ROLLER SKATING CLUB
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-medium transition-all duration-200 hover:text-orange-500 ${
                    isActive ? 'text-orange-500 font-semibold border-b-2 border-orange-500 pb-1' : 'text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Authentication & Controls */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'ADMIN' ? (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 text-xs font-semibold uppercase bg-orange-600 hover:bg-orange-500 text-white px-3 py-2 rounded-md transition-colors"
                  >
                    <Shield className="h-4 w-4" /> Admin
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1 text-xs font-semibold uppercase bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-md transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-xs font-semibold uppercase border border-gray-700 hover:bg-gray-800 text-gray-300 px-3 py-2 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0b0c10] border-t border-gray-800 px-2 pt-2 pb-4 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive ? 'bg-orange-500/10 text-orange-500' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="border-t border-gray-800 my-2 pt-2">
            {user ? (
              <div className="flex flex-col gap-2 px-3">
                {user.role === 'ADMIN' ? (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 text-center text-sm font-bold uppercase bg-orange-600 hover:bg-orange-500 text-white py-2.5 rounded-md"
                  >
                    <Shield className="h-4 w-4" /> Admin Panel
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 text-center text-sm font-bold uppercase bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-md"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full text-center text-sm font-bold uppercase border border-gray-700 hover:bg-gray-800 text-gray-300 py-2.5 rounded-md"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center text-sm font-bold border border-gray-700 text-gray-300 py-2.5 rounded-md hover:bg-gray-800"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block text-center text-sm font-bold bg-orange-500 text-white py-2.5 rounded-md hover:bg-orange-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
