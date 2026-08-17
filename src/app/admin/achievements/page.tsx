'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Award, CheckCircle, XCircle, Clock, Trash2, Search, Medal } from 'lucide-react';

interface Achievement {
  id: string;
  skaterName: string;
  competitionName: string;
  position: 'GOLD' | 'SILVER' | 'BRONZE' | 'PARTICIPATION';
  category: string;
  eventDate: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  photoUrl: string | null;
  certificateUrl: string | null;
  createdAt: string;
  submittedBy: { name: string; email: string };
}

const STATUS_FILTERS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const;
type StatusFilter = typeof STATUS_FILTERS[number];

const POSITION_COLOR: Record<string, string> = {
  GOLD: 'text-yellow-400',
  SILVER: 'text-gray-300',
  BRONZE: 'text-orange-400',
  PARTICIPATION: 'text-blue-400',
};

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('ALL');
  const [search, setSearch] = useState('');
  const [acting, setActing] = useState<string | null>(null);

  const fetchAchievements = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'ALL') params.set('status', filter);

      const res = await fetch(`/api/admin/achievements?${params}`);
      if (res.ok) {
        const json = await res.json();
        setAchievements(json.achievements || []);
      }
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  async function updateStatus(id: string, status: 'APPROVED' | 'REJECTED') {
    setActing(id);
    try {
      const res = await fetch(`/api/admin/achievements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setAchievements((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      }
    } finally {
      setActing(null);
    }
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this achievement permanently?')) return;
    setActing(id);
    try {
      const res = await fetch(`/api/admin/achievements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAchievements((prev) => prev.filter((a) => a.id !== id));
      }
    } finally {
      setActing(null);
    }
  }

  const filtered = achievements.filter(
    (a) =>
      a.skaterName.toLowerCase().includes(search.toLowerCase()) ||
      a.competitionName.toLowerCase().includes(search.toLowerCase())
  );

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
          <Award className="h-6 w-6 text-purple-500" /> Achievements Management
        </h1>
        <p className="text-sm text-gray-400">Verify and approve member achievement submissions</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-colors ${
                filter === s ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
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
            placeholder="Search skater or competition..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500" />
          <span className="text-sm text-gray-400">Loading achievements...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-800 rounded-lg">
          <Award className="h-12 w-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No achievements found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ach) => (
            <div key={ach.id} className="bg-gray-900/40 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {statusBadge(ach.status)}
                    <span className={`text-[10px] font-bold uppercase ${POSITION_COLOR[ach.position]}`}>
                      <Medal className="inline h-3 w-3 mr-0.5" />{ach.position}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm">
                    {ach.skaterName} — {ach.competitionName}
                  </h3>
                  <p className="text-xs text-gray-400">{ach.category} &middot; {new Date(ach.eventDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{ach.description}</p>
                  <p className="text-xs text-gray-600">
                    Submitted by <span className="text-gray-500">{ach.submittedBy.name}</span> on{' '}
                    {new Date(ach.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  {(ach.photoUrl || ach.certificateUrl) && (
                    <div className="flex gap-2 pt-1">
                      {ach.photoUrl && (
                        <a href={ach.photoUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:underline">
                          View Photo
                        </a>
                      )}
                      {ach.certificateUrl && (
                        <a href={ach.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:underline">
                          View Certificate
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {ach.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => updateStatus(ach.id, 'APPROVED')}
                        disabled={acting === ach.id}
                        className="flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 px-2.5 py-1.5 rounded text-xs font-bold transition-colors"
                      >
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => updateStatus(ach.id, 'REJECTED')}
                        disabled={acting === ach.id}
                        className="flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 px-2.5 py-1.5 rounded text-xs font-bold transition-colors"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </button>
                    </>
                  )}
                  {ach.status !== 'PENDING' && (
                    <button
                      onClick={() => updateStatus(ach.id, ach.status === 'APPROVED' ? 'REJECTED' : 'APPROVED')}
                      disabled={acting === ach.id}
                      className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700 px-2.5 py-1.5 rounded text-xs font-bold transition-colors"
                    >
                      <Clock className="h-3.5 w-3.5" /> Toggle
                    </button>
                  )}
                  <button
                    onClick={() => deleteItem(ach.id)}
                    disabled={acting === ach.id}
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
