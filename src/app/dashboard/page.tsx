'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { User, FileText, Award, Plus, Edit3, Settings, LogOut, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  category: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

interface Achievement {
  id: string;
  skaterName: string;
  competitionName: string;
  position: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export default function DashboardPage() {
  const { user, refresh, logout } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'posts' | 'achievements'>('profile');
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [postsRes, achRes] = await Promise.all([
          fetch('/api/user/posts'),
          fetch('/api/user/achievements'),
        ]);

        if (postsRes.ok) {
          const json = await postsRes.json();
          setPosts(json.posts || []);
        }
        if (achRes.ok) {
          const json = await achRes.json();
          setAchievements(json.achievements || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStats(false);
      }
    }
    fetchDashboardData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profileName, email: profileEmail }),
      });

      const data = await res.json();
      if (res.ok) {
        toast('Profile updated successfully!', 'success');
        refresh();
      } else {
        toast(data.error || 'Failed to update profile', 'error');
      }
    } catch {
      toast('An unexpected error occurred.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded font-semibold"><CheckCircle className="h-3 w-3" /> Approved</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] px-2 py-0.5 rounded font-semibold"><AlertTriangle className="h-3 w-3" /> Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded font-semibold"><Clock className="h-3 w-3" /> Pending</span>;
    }
  };

  return (
    <div className="flex-1 py-12 px-4 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* Dashboard sidebar info */}
      <div className="lg:col-span-1 space-y-6">
        <div className="p-6 rounded-lg bg-gray-950 border border-gray-800 space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-850 pb-4">
            <div className="h-12 w-12 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 font-extrabold text-lg uppercase">
              {user?.name.substring(0, 2)}
            </div>
            <div>
              <h2 className="font-bold text-white leading-tight">{user?.name}</h2>
              <span className="text-[10px] bg-orange-600/20 text-orange-400 px-2 py-0.5 rounded uppercase font-semibold">
                {user?.role}
              </span>
            </div>
          </div>
          
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm font-semibold transition-colors text-left ${
                  activeTab === 'profile' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
              >
                <Settings className="h-4 w-4" /> Profile Settings
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('posts')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm font-semibold transition-colors text-left ${
                  activeTab === 'posts' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
              >
                <FileText className="h-4 w-4" /> My Posts ({posts.length})
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm font-semibold transition-colors text-left ${
                  activeTab === 'achievements' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
              >
                <Award className="h-4 w-4" /> My Achievements ({achievements.length})
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3">
        {activeTab === 'profile' && (
          <div className="p-8 rounded-lg bg-gray-950 border border-gray-800 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="h-5 w-5 text-orange-500" /> Edit Profile Details
            </h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded p-2.5 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded p-2.5 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
              
              <button
                type="submit"
                disabled={savingProfile}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-850 text-white font-bold px-4 py-2 rounded text-sm transition-colors"
              >
                {savingProfile ? 'Saving...' : 'Update Details'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="p-8 rounded-lg bg-gray-950 border border-gray-800 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-500" /> My Blog Submissions
              </h2>
              <Link
                href="/dashboard/posts/new"
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase py-2 px-3 rounded flex items-center gap-1 shrink-0"
              >
                <Plus className="h-4 w-4" /> Create Post
              </Link>
            </div>

            {loadingStats ? (
              <p className="text-sm text-gray-500">Checking records...</p>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 rounded border border-dashed border-gray-850">
                <p className="text-sm text-gray-400">You haven&apos;t written any blog posts yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-850 text-gray-400 uppercase text-[10px] tracking-wider">
                      <th className="pb-3 font-semibold">Title</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Submitted On</th>
                      <th className="pb-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-850">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-900/30">
                        <td className="py-4 text-white font-medium">{post.title}</td>
                        <td className="py-4 text-gray-400">{post.category}</td>
                        <td className="py-4 text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 text-right">{getStatusBadge(post.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="p-8 rounded-lg bg-gray-950 border border-gray-800 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-orange-500" /> My Achievements
              </h2>
              <Link
                href="/dashboard/achievements/new"
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase py-2 px-3 rounded flex items-center gap-1 shrink-0"
              >
                <Plus className="h-4 w-4" /> Add Achievement
              </Link>
            </div>

            {loadingStats ? (
              <p className="text-sm text-gray-500">Checking records...</p>
            ) : achievements.length === 0 ? (
              <div className="text-center py-12 rounded border border-dashed border-gray-855">
                <p className="text-sm text-gray-400">You haven&apos;t submitted any achievements yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-850 text-gray-400 uppercase text-[10px] tracking-wider">
                      <th className="pb-3 font-semibold">Skater Name</th>
                      <th className="pb-3 font-semibold">Competition</th>
                      <th className="pb-3 font-semibold">Position</th>
                      <th className="pb-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-850">
                    {achievements.map((ach) => (
                      <tr key={ach.id} className="hover:bg-gray-900/30">
                        <td className="py-4 text-white font-medium">{ach.skaterName}</td>
                        <td className="py-4 text-gray-400">{ach.competitionName}</td>
                        <td className="py-4 text-orange-400 font-semibold">{ach.position}</td>
                        <td className="py-4 text-right">{getStatusBadge(ach.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
