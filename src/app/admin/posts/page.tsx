'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { FileText, CheckCircle, XCircle, Clock, Trash2, Search, Eye } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  category: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  author: { name: string; email: string };
  images: string[];
}

const STATUS_FILTERS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const;
type StatusFilter = typeof STATUS_FILTERS[number];

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('ALL');
  const [search, setSearch] = useState('');
  const [acting, setActing] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'ALL') params.set('status', filter);
      if (search) params.set('query', search);

      const res = await fetch(`/api/admin/posts?${params}`);
      if (res.ok) {
        const json = await res.json();
        setPosts(json.posts || []);
      }
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    const t = setTimeout(fetchPosts, 300);
    return () => clearTimeout(t);
  }, [fetchPosts]);

  async function updateStatus(id: string, status: 'APPROVED' | 'REJECTED') {
    setActing(id);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
      }
    } finally {
      setActing(null);
    }
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post permanently?')) return;
    setActing(id);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } finally {
      setActing(null);
    }
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      APPROVED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      REJECTED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${map[status] || ''}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <FileText className="h-6 w-6 text-orange-500" /> Posts Management
        </h1>
        <p className="text-sm text-gray-400">Review and moderate user-submitted posts</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-colors ${
                filter === s
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500" />
          <span className="text-sm text-gray-400">Loading posts...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-800 rounded-lg">
          <FileText className="h-12 w-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No posts found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-gray-900/40 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {statusBadge(post.status)}
                    <span className="text-[10px] uppercase font-semibold text-gray-500 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm leading-snug">{post.title}</h3>
                  <p className="text-xs text-gray-500">
                    By <span className="text-gray-400">{post.author.name}</span> ({post.author.email}) &middot;{' '}
                    {new Date(post.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {post.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => updateStatus(post.id, 'APPROVED')}
                        disabled={acting === post.id}
                        className="flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 px-2.5 py-1.5 rounded text-xs font-bold transition-colors"
                      >
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => updateStatus(post.id, 'REJECTED')}
                        disabled={acting === post.id}
                        className="flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 px-2.5 py-1.5 rounded text-xs font-bold transition-colors"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </button>
                    </>
                  )}
                  {post.status !== 'PENDING' && (
                    <button
                      onClick={() => updateStatus(post.id, post.status === 'APPROVED' ? 'REJECTED' : 'APPROVED')}
                      disabled={acting === post.id}
                      className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700 px-2.5 py-1.5 rounded text-xs font-bold transition-colors"
                    >
                      <Clock className="h-3.5 w-3.5" /> Toggle
                    </button>
                  )}
                  <button
                    onClick={() => deletePost(post.id)}
                    disabled={acting === post.id}
                    className="flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 px-2.5 py-1.5 rounded text-xs font-bold transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
