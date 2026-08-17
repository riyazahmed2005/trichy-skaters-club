'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield, Users, FileText, Award, Image as ImageIcon, Calendar, Megaphone, LogOut, Home, BarChart2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: BarChart2 },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Posts', path: '/admin/posts', icon: FileText },
    { name: 'Achievements', path: '/admin/achievements', icon: Award },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Events', path: '/admin/events', icon: Calendar },
    { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-gray-950 border-r border-gray-850 p-4 space-y-6 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2 pb-4 border-b border-gray-850">
            <Shield className="h-5 w-5 text-orange-500 shrink-0" />
            <div>
              <h2 className="font-bold text-white text-sm uppercase tracking-wider">Admin Workspace</h2>
              <span className="text-[10px] text-gray-500 font-semibold">{user?.email}</span>
            </div>
          </div>

          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-bold uppercase tracking-wide transition-colors ${
                      isActive
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/10'
                        : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-gray-850 pt-4 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded text-xs font-bold uppercase tracking-wide text-gray-400 hover:bg-gray-900 hover:text-white"
          >
            <Home className="h-4 w-4 shrink-0" />
            <span>Go to Website</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-bold uppercase tracking-wide text-rose-400 hover:bg-rose-955/20 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#0b0c10] p-6 sm:p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
