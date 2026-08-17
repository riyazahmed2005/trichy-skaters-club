'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

interface ClubEvent {
  id: string;
  name: string;
  slug: string;
  description: string;
  date: string;
  time: string;
  location: string;
  coverImage?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [upcoming, setUpcoming] = useState<ClubEvent[]>([]);
  const [past, setPast] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/public/events');
        if (res.ok) {
          const json = await res.json();
          const list: ClubEvent[] = json.events || [];
          setEvents(list);
          
          const now = new Date();
          now.setHours(0, 0, 0, 0); // start of today
          
          const up = list.filter((e) => new Date(e.date) >= now);
          const pa = list.filter((e) => new Date(e.date) < now);
          
          setUpcoming(up);
          setPast(pa);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        <span className="text-sm text-gray-400">Loading events...</span>
      </div>
    );
  }

  const renderEventCard = (evt: ClubEvent) => {
    const img = evt.coverImage || '/logo.jpg';
    return (
      <div
        key={evt.id}
        className="p-6 rounded-lg bg-gray-950 border border-gray-800 flex flex-col sm:flex-row gap-6 items-start hover:border-orange-500/30 transition-all duration-300"
      >
        <div className="relative w-full sm:w-40 h-28 shrink-0 overflow-hidden rounded bg-gray-900 border border-gray-800">
          <Image
            src={img}
            alt={evt.name}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex-1 space-y-3 w-full">
          <h3 className="text-lg font-bold text-white leading-tight hover:text-orange-500 transition-colors">
            <Link href={`/events/${evt.slug}`}>{evt.name}</Link>
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{evt.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-orange-500" />
              <span>{new Date(evt.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-orange-500" />
              <span>{evt.time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-orange-500" />
              <span className="line-clamp-1">{evt.location}</span>
            </div>
          </div>
          
          <div className="pt-2">
            <Link
              href={`/events/${evt.slug}`}
              className="inline-flex items-center text-xs font-semibold text-orange-500 hover:text-orange-400 gap-1"
            >
              Event Details <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 py-16 px-4 max-w-7xl mx-auto space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-wider">
          Club <span className="text-orange-500">Events</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Tournament trials, weekend clinics, roller hockey workshops, and member skates.
        </p>
        <div className="h-1 w-20 bg-orange-500 mx-auto mt-2"></div>
      </div>

      {/* Upcoming Events */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-orange-500 pl-3">
          Upcoming Events
        </h2>
        {upcoming.length === 0 ? (
          <div className="p-8 rounded-lg bg-gray-950 border border-gray-800 text-center text-gray-400 text-sm">
            No upcoming events scheduled. Stay tuned!
          </div>
        ) : (
          <div className="space-y-6">{upcoming.map(renderEventCard)}</div>
        )}
      </div>

      {/* Past Events */}
      <div className="space-y-6 pt-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-400 border-l-4 border-gray-800 pl-3">
          Completed / Past Events
        </h2>
        {past.length === 0 ? (
          <div className="p-8 rounded-lg bg-gray-950 border border-gray-850 text-center text-gray-500 text-sm">
            No past events recorded.
          </div>
        ) : (
          <div className="space-y-6 opacity-80">{past.map(renderEventCard)}</div>
        )}
      </div>

    </div>
  );
}
