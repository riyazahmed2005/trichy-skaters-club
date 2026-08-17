'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Trash2, Loader2, Edit2, X, Check } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  slug: string;
  description: string;
  date: string;
  time: string;
  location: string;
  coverImage: string | null;
  createdAt: string;
}

const emptyForm = { name: '', description: '', date: '', time: '', location: '', coverImage: '' };

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/events');
      if (res.ok) {
        const json = await res.json();
        setEvents(json.events || []);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          coverImage: form.coverImage || undefined,
        }),
      });
      if (res.ok) {
        setForm(emptyForm);
        setShowForm(false);
        fetchEvents();
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent(id: string) {
    if (!confirm('Delete this event permanently?')) return;
    setActing(id);
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    } finally {
      setActing(null);
    }
  }

  const isPast = (dateStr: string) => new Date(dateStr) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Calendar className="h-6 w-6 text-cyan-500" /> Events Management
          </h1>
          <p className="text-sm text-gray-400">{events.length} events created</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Create Event'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Create New Event</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Annual State Speed Skating Championship"
                  className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded-lg p-2.5 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded-lg p-2.5 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Time</label>
                <input
                  type="text"
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  placeholder="e.g. 8:00 AM onwards"
                  className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded-lg p-2.5 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Location / Venue</label>
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. SDAT Skating Rink, Chennai"
                  className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded-lg p-2.5 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Cover Image URL (Optional)</label>
                <input
                  type="url"
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded-lg p-2.5 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Description</label>
                <textarea
                  rows={4}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed event description..."
                  className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded-lg p-2.5 text-sm focus:border-orange-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {saving ? 'Creating...' : 'Create Event'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500" />
          <span className="text-sm text-gray-400">Loading events...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-800 rounded-lg">
          <Calendar className="h-12 w-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No events yet. Create the first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const past = isPast(event.date);
            return (
              <div
                key={event.id}
                className={`bg-gray-900/40 border rounded-lg p-4 hover:border-gray-700 transition-colors ${
                  past ? 'border-gray-800 opacity-70' : 'border-cyan-500/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        past ? 'bg-gray-800 text-gray-500 border-gray-700' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      }`}>
                        {past ? 'Past' : 'Upcoming'}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm">{event.name}</h3>
                    <p className="text-xs text-gray-400">
                      📅 {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })} &nbsp;
                      🕐 {event.time} &nbsp;
                      📍 {event.location}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">{event.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => deleteEvent(event.id)}
                      disabled={acting === event.id}
                      className="flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 px-2.5 py-1.5 rounded text-xs font-bold transition-colors"
                    >
                      {acting === event.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
