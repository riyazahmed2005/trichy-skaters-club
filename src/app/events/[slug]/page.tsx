'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, MapPin, ArrowLeft, CalendarDays } from 'lucide-react';

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

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [event, setEvent] = useState<ClubEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEventDetail() {
      try {
        const res = await fetch(`/api/public/events/${slug}`);
        if (res.ok) {
          const json = await res.json();
          setEvent(json.event);
        } else {
          setError('Event details not found.');
        }
      } catch (err) {
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    }
    fetchEventDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        <span className="text-sm text-gray-400">Loading event details...</span>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <CalendarDays className="h-12 w-12 text-gray-600" />
        <span className="text-sm text-gray-400">{error || 'Event not found.'}</span>
        <Link href="/events" className="text-orange-500 font-bold hover:underline">
          Back to Events List
        </Link>
      </div>
    );
  }

  const img = event.coverImage || '/logo.jpg';

  return (
    <div className="flex-1 py-12 px-4 max-w-4xl mx-auto space-y-8">
      
      {/* Back button */}
      <div>
        <Link
          href="/events"
          className="inline-flex items-center text-xs font-bold uppercase text-gray-400 hover:text-white gap-1 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Events List
        </Link>
      </div>

      {/* Main Image Banner */}
      <div className="relative h-64 sm:h-96 w-full rounded-xl overflow-hidden border border-gray-800 bg-gray-900">
        <Image
          src={img}
          alt={event.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Event Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Info details */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            {event.name}
          </h1>
          <div className="h-1 w-16 bg-orange-500"></div>
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
            {event.description}
          </p>
        </div>

        {/* Right: Timing Card */}
        <div className="p-6 rounded-lg bg-gray-950 border border-gray-800 space-y-4 h-fit">
          <h2 className="text-white font-bold text-base border-b border-gray-800 pb-2">Event Schedule</h2>
          
          <ul className="space-y-4">
            <li className="flex gap-2.5 items-start">
              <Calendar className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-400">
                <strong className="text-white block mb-0.5">Date</strong>
                {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </li>
            <li className="flex gap-2.5 items-start">
              <Clock className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-400">
                <strong className="text-white block mb-0.5">Time</strong>
                {event.time}
              </div>
            </li>
            <li className="flex gap-2.5 items-start">
              <MapPin className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-400">
                <strong className="text-white block mb-0.5">Location</strong>
                {event.location}
              </div>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}
