'use client';

import React, { useEffect, useState } from 'react';
import { Megaphone, Pin, Plus, Trash2, Loader2, X, Check } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  isPin: boolean;
  createdAt: string;
}

const emptyForm = { title: '', content: '', isPin: false };

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/announcements');
      if (res.ok) {
        const json = await res.json();
        setAnnouncements(json.announcements || []);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm(emptyForm);
        setShowForm(false);
        fetchAnnouncements();
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteAnnouncement(id: string) {
    if (!confirm('Delete this announcement permanently?')) return;
    setActing(id);
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      }
    } finally {
      setActing(null);
    }
  }

  async function togglePin(ann: Announcement) {
    setActing(ann.id);
    try {
      const res = await fetch(`/api/admin/announcements/${ann.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPin: !ann.isPin }),
      });
      if (res.ok) {
        setAnnouncements((prev) =>
          prev.map((a) => (a.id === ann.id ? { ...a, isPin: !a.isPin } : a))
        );
      }
    } finally {
      setActing(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-amber-500" /> Announcements
          </h1>
          <p className="text-sm text-gray-400">{announcements.length} announcements published</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'New Announcement'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Create Announcement</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Announcement headline"
                className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded-lg p-2.5 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Content</label>
              <textarea
                rows={4}
                required
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write announcement details..."
                className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded-lg p-2.5 text-sm focus:border-orange-500 focus:outline-none resize-none"
              />
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div
                onClick={() => setForm({ ...form, isPin: !form.isPin })}
                className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                  form.isPin ? 'bg-orange-500 border-orange-500' : 'border-gray-700 bg-transparent'
                }`}
              >
                {form.isPin && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className="text-sm text-gray-300">Pin this announcement (shows at top)</span>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {saving ? 'Publishing...' : 'Publish Announcement'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500" />
          <span className="text-sm text-gray-400">Loading announcements...</span>
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-800 rounded-lg">
          <Megaphone className="h-12 w-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`bg-gray-900/40 border rounded-lg p-4 hover:border-gray-700 transition-colors ${
                ann.isPin ? 'border-amber-500/30' : 'border-gray-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {ann.isPin && (
                      <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        <Pin className="h-3 w-3" /> Pinned
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-sm">{ann.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-3">{ann.content}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(ann.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => togglePin(ann)}
                    disabled={acting === ann.id}
                    className={`flex items-center gap-1 border px-2.5 py-1.5 rounded text-xs font-bold transition-colors ${
                      ann.isPin
                        ? 'bg-amber-500/10 hover:bg-gray-800 text-amber-400 border-amber-500/30'
                        : 'bg-gray-800 hover:bg-amber-500/10 text-gray-400 hover:text-amber-400 border-gray-700 hover:border-amber-500/30'
                    }`}
                  >
                    <Pin className="h-3.5 w-3.5" />
                    {ann.isPin ? 'Unpin' : 'Pin'}
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    disabled={acting === ann.id}
                    className="flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 px-2.5 py-1.5 rounded text-xs font-bold transition-colors"
                  >
                    {acting === ann.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    Delete
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
