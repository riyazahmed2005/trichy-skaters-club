'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, FileText, Award, Image as ImageIcon, Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalPosts: number;
  pendingPosts: number;
  approvedPosts: number;
  totalAchievements: number;
  pendingAchievements: number;
  totalGalleryImages: number;
  upcomingEvents: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const json = await res.json();
          setStats(json.stats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="text-sm text-gray-400">Loading admin metrics...</span>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10 border-blue-500/20',
      link: '/admin/users',
    },
    {
      title: 'Total Posts',
      value: stats?.totalPosts || 0,
      icon: FileText,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10 border-orange-500/20',
      link: '/admin/posts',
    },
    {
      title: 'Pending Review (Posts)',
      value: stats?.pendingPosts || 0,
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/20',
      link: '/admin/posts?status=PENDING',
    },
    {
      title: 'Approved Posts',
      value: stats?.approvedPosts || 0,
      icon: CheckCircle,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      link: '/admin/posts?status=APPROVED',
    },
    {
      title: 'Total Achievements',
      value: stats?.totalAchievements || 0,
      icon: Award,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10 border-purple-500/20',
      link: '/admin/achievements',
    },
    {
      title: 'Pending Achievements',
      value: stats?.pendingAchievements || 0,
      icon: AlertTriangle,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10 border-rose-500/20',
      link: '/admin/achievements?status=PENDING',
    },
    {
      title: 'Gallery Images',
      value: stats?.totalGalleryImages || 0,
      icon: ImageIcon,
      color: 'text-pink-500',
      bg: 'bg-pink-500/10 border-pink-500/20',
      link: '/admin/gallery',
    },
    {
      title: 'Upcoming Events',
      value: stats?.upcomingEvents || 0,
      icon: Calendar,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      link: '/admin/events',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">SYSTEM SUMMARY</h1>
        <p className="text-sm text-gray-400">Review status pending items and user submissions.</p>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <Link
              key={idx}
              href={c.link}
              className={`p-6 rounded-lg border ${c.bg} flex items-center justify-between hover:scale-[1.02] transition-transform duration-200`}
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{c.title}</span>
                <div className="text-3xl font-extrabold text-white">{c.value}</div>
              </div>
              <div className={`p-3 rounded-full bg-gray-900 border border-gray-800 ${c.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
