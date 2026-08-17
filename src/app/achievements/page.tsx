'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Award, Trophy, Calendar, Search } from 'lucide-react';

interface Achievement {
  id: string;
  skaterName: string;
  competitionName: string;
  position: 'GOLD' | 'SILVER' | 'BRONZE' | 'PARTICIPATION';
  category: string;
  eventDate: string;
  description: string;
  photoUrl?: string;
  certificateUrl?: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filtered, setFiltered] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('ALL');

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const res = await fetch('/api/public/achievements');
        if (res.ok) {
          const json = await res.json();
          setAchievements(json.achievements || []);
          setFiltered(json.achievements || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAchievements();
  }, []);

  useEffect(() => {
    let result = achievements;

    if (searchTerm) {
      result = result.filter(
        (ach) =>
          ach.skaterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ach.competitionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ach.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (positionFilter !== 'ALL') {
      result = result.filter((ach) => ach.position === positionFilter);
    }

    setFiltered(result);
  }, [searchTerm, positionFilter, achievements]);

  const getPositionBadge = (pos: string) => {
    switch (pos) {
      case 'GOLD':
        return <span className="bg-amber-500/10 text-amber-500 border border-amber-500/30 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 shrink-0"><Trophy className="h-4 w-4" /> Gold / 1st</span>;
      case 'SILVER':
        return <span className="bg-slate-300/10 text-slate-300 border border-slate-300/30 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 shrink-0"><Trophy className="h-4 w-4" /> Silver / 2nd</span>;
      case 'BRONZE':
        return <span className="bg-amber-700/10 text-amber-705 border border-amber-700/30 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 shrink-0"><Trophy className="h-4 w-4" /> Bronze / 3rd</span>;
      default:
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs px-3 py-1 rounded-full font-bold shrink-0">Participation</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        <span className="text-sm text-gray-400">Loading achievements board...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 py-16 px-4 max-w-7xl mx-auto space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-wider">
          Skating <span className="text-orange-500">Achievements</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Celebrating the hard work, speed, and podium finishes of our skaters across district and national championships.
        </p>
        <div className="h-1 w-20 bg-orange-500 mx-auto mt-2"></div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-gray-950 p-4 rounded-lg border border-gray-800 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by skater name or competition..."
            className="w-full bg-[#0b0c10] border border-gray-800 rounded pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
          {['ALL', 'GOLD', 'SILVER', 'BRONZE', 'PARTICIPATION'].map((pos) => (
            <button
              key={pos}
              onClick={() => setPositionFilter(pos)}
              className={`text-xs font-bold uppercase py-2 px-3 rounded border transition-colors ${
                positionFilter === pos
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-[#0b0c10] border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-gray-950 rounded-lg border border-gray-800 space-y-3">
          <Award className="h-12 w-12 text-gray-600 mx-auto" />
          <p className="text-gray-400">No achievements match your search parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((ach) => (
            <div
              key={ach.id}
              className="p-6 rounded-lg bg-gray-950 border border-gray-800 flex flex-col sm:flex-row gap-6 items-start hover:border-orange-500/30 transition-all duration-300"
            >
              {ach.photoUrl ? (
                <div className="relative w-full sm:w-32 h-32 shrink-0 overflow-hidden rounded bg-gray-900 border border-gray-800">
                  <Image
                    src={ach.photoUrl}
                    alt={ach.skaterName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full sm:w-32 h-32 shrink-0 rounded bg-gray-900 border border-gray-800 flex items-center justify-center text-orange-500">
                  <Award className="h-12 w-12" />
                </div>
              )}
              
              <div className="flex-1 space-y-3 w-full">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-white leading-snug">{ach.skaterName}</h2>
                    <p className="text-xs text-orange-500 font-semibold uppercase tracking-wider">{ach.competitionName}</p>
                  </div>
                  {getPositionBadge(ach.position)}
                </div>
                
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-blue-400">
                  <span>Category: {ach.category}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(ach.eventDate).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm text-gray-400 leading-relaxed">{ach.description}</p>

                {ach.certificateUrl && (
                  <div className="pt-2">
                    <a
                      href={ach.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 font-bold underline"
                    >
                      View Certificate (PDF / Image)
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
