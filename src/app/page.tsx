'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Award, Trophy, Clock, ArrowRight, Zap, Target, Shield, Users } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  images: any;
  createdAt: string;
  author: { name: string };
}

interface Achievement {
  id: string;
  skaterName: string;
  competitionName: string;
  position: 'GOLD' | 'SILVER' | 'BRONZE' | 'PARTICIPATION';
  category: string;
  eventDate: string;
  description: string;
  photoUrl?: string;
}

interface Event {
  id: string;
  name: string;
  slug: string;
  description: string;
  date: string;
  time: string;
  location: string;
  coverImage?: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface HomeData {
  latestPosts: Post[];
  featuredAchievements: Achievement[];
  upcomingEvents: Event[];
  pinnedAnnouncements: Announcement[];
  stats: {
    skatersCount: number;
    approvedPosts: number;
    approvedAchievements: number;
    totalEvents: number;
  };
}

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const res = await fetch('/api/public/home');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <span className="text-sm font-medium text-gray-400">Loading Trichy Skaters Community...</span>
      </div>
    );
  }

  // Fallbacks if backend fails
  const latestPosts = data?.latestPosts || [];
  const featuredAchievements = data?.featuredAchievements || [];
  const upcomingEvents = data?.upcomingEvents || [];
  const pinnedAnnouncements = data?.pinnedAnnouncements || [];
  const stats = data?.stats || { skatersCount: 25, approvedPosts: 0, approvedAchievements: 0, totalEvents: 0 };

  const getPositionBadge = (pos: string) => {
    switch (pos) {
      case 'GOLD':
        return <span className="bg-amber-500/10 text-amber-500 border border-amber-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shrink-0"><Trophy className="h-3.5 w-3.5" /> Gold / 1st</span>;
      case 'SILVER':
        return <span className="bg-slate-300/10 text-slate-300 border border-slate-300/30 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shrink-0"><Trophy className="h-3.5 w-3.5" /> Silver / 2nd</span>;
      case 'BRONZE':
        return <span className="bg-amber-700/10 text-amber-700 border border-amber-700/30 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shrink-0"><Trophy className="h-3.5 w-3.5" /> Bronze / 3rd</span>;
      default:
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold shrink-0">Participation</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Pinned Announcements Banner */}
      {pinnedAnnouncements.length > 0 && (
        <div className="bg-orange-600/90 text-white py-2.5 px-4 text-center text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 relative z-10">
          <Zap className="h-4 w-4 shrink-0 animate-bounce" />
          <span>
            <strong>Latest Update:</strong> {pinnedAnnouncements[0].title} - {pinnedAnnouncements[0].content}
          </span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/40 via-[#0b0c10] to-[#0b0c10] py-20 lg:py-28 px-4 border-b border-gray-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
          
          {/* Hero text */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-semibold">
              <Zap className="h-3.5 w-3.5" /> Unleash Speed. Perfect Grace.
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Ride the Speed with <span className="text-orange-500">Trichy Skaters</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Welcome to Tiruchirappalli&apos;s premier roller skating club. Nurturing speed skaters, roller hockey competitors, and fitness enthusiasts of all ages. Join our championship-winning squad today!
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                href="/register"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-md shadow-lg shadow-orange-500/20 transition-all duration-200 flex items-center gap-2"
              >
                Join the Club <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/about"
                className="border border-gray-700 hover:bg-gray-800 text-gray-300 font-bold px-6 py-3 rounded-md transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Hero Image (Logo Display / Visual Mockup) */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full overflow-hidden border-4 border-orange-500/30 shadow-2xl shadow-orange-500/10 bg-gray-950 p-6 flex items-center justify-center">
              <Image
                src="/logo.jpg"
                alt="Trichy Skaters Action Logo"
                width={380}
                height={380}
                className="object-contain hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>

        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-[#0b0c10] py-8 px-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
            <div className="text-3xl font-extrabold text-orange-500 mb-1">{stats.skatersCount}</div>
            <div className="text-xs uppercase text-gray-400 tracking-wider">Active Skaters</div>
          </div>
          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
            <div className="text-3xl font-extrabold text-blue-500 mb-1">{stats.approvedAchievements}</div>
            <div className="text-xs uppercase text-gray-400 tracking-wider">Medals & Trophies</div>
          </div>
          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
            <div className="text-3xl font-extrabold text-white mb-1">{stats.approvedPosts}</div>
            <div className="text-xs uppercase text-gray-400 tracking-wider">Articles & News</div>
          </div>
          <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
            <div className="text-3xl font-extrabold text-orange-500 mb-1">{stats.totalEvents}</div>
            <div className="text-xs uppercase text-gray-400 tracking-wider">Events Conducted</div>
          </div>
        </div>
      </section>

      {/* Intro section */}
      <section className="py-16 px-4 bg-gray-950">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-wider">
            Who We Are
          </h2>
          <div className="h-1 w-20 bg-orange-500 mx-auto"></div>
          <p className="text-gray-400 leading-relaxed text-base sm:text-lg max-w-3xl mx-auto">
            At <strong>Trichy Skaters</strong>, we offer systematic coaching classes at the Anna Stadium track and private rinks in Anna Nagar, Trichy. Our coaches hold national certifications and specialize in speed inline skating, quad speed skating, and roller hockey coordination. We believe in building confidence, physical fitness, and core discipline in every student.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
            <div className="p-6 rounded-lg bg-[#0b0c10] border border-gray-800 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-white font-bold mb-2">Targeted Coaching</h3>
              <p className="text-xs text-gray-400 text-center leading-relaxed">Personalized focus on footwork, cross-over lean, and track strategy.</p>
            </div>
            <div className="p-6 rounded-lg bg-[#0b0c10] border border-gray-800 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-white font-bold mb-2">Safety Standards</h3>
              <p className="text-xs text-gray-400 text-center leading-relaxed">Mandatory safety gears and controlled tracks to secure all skaters.</p>
            </div>
            <div className="p-6 rounded-lg bg-[#0b0c10] border border-gray-800 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-white font-bold mb-2">Active Community</h3>
              <p className="text-xs text-gray-400 text-center leading-relaxed">Supportive environment for skaters to share milestones, certificates, and photos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Achievements */}
      <section className="py-16 px-4 bg-[#0b0c10]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                FEATURED ACHIEVEMENTS
              </h2>
              <p className="text-sm text-gray-400 mt-1">Celebrating our skaters&apos; excellence in district & national levels.</p>
            </div>
            <Link href="/achievements" className="text-orange-500 hover:text-orange-400 font-semibold text-sm flex items-center gap-1 group">
              View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {featuredAchievements.length === 0 ? (
            <div className="text-center py-12 rounded-lg border border-gray-800 bg-gray-950">
              <Award className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No featured achievements approved yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredAchievements.map((ach) => (
                <div key={ach.id} className="p-6 rounded-lg bg-gray-950 border border-gray-800 flex flex-col sm:flex-row gap-4 items-start hover:border-orange-500/40 transition-colors duration-300">
                  {ach.photoUrl ? (
                    <div className="relative w-full sm:w-28 h-28 shrink-0 overflow-hidden rounded bg-gray-900 border border-gray-800">
                      <Image
                        src={ach.photoUrl}
                        alt={ach.skaterName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full sm:w-28 h-28 shrink-0 rounded bg-gray-900 border border-gray-800 flex items-center justify-center text-orange-500">
                      <Award className="h-10 w-10" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-white text-base leading-snug">{ach.skaterName}</h3>
                      {getPositionBadge(ach.position)}
                    </div>
                    <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider">{ach.competitionName}</p>
                    <p className="text-xs text-blue-400">{ach.category} &bull; {new Date(ach.eventDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Posts & Announcements */}
      <section className="py-16 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Posts grid */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                  LATEST FROM THE CLUB
                </h2>
                <p className="text-sm text-gray-400 mt-1">Training guides, race reviews, and community insights.</p>
              </div>
              <Link href="/posts" className="text-orange-500 hover:text-orange-400 font-semibold text-sm flex items-center gap-1 group">
                View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {latestPosts.length === 0 ? (
              <div className="text-center py-12 rounded-lg border border-gray-850 bg-[#0b0c10]">
                <p className="text-gray-400 text-sm">No approved posts found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {latestPosts.map((post) => {
                  let img = '/logo.jpg';
                  if (post.images && Array.isArray(post.images) && post.images.length > 0) {
                    img = post.images[0];
                  } else if (post.images && typeof post.images === 'string') {
                    try {
                      const parsed = JSON.parse(post.images);
                      if (Array.isArray(parsed) && parsed.length > 0) img = parsed[0];
                    } catch {}
                  }

                  return (
                    <article key={post.id} className="rounded-lg overflow-hidden border border-gray-800 bg-[#0b0c10] hover:border-orange-500/30 transition-all duration-300 flex flex-col">
                      <div className="relative h-44 w-full bg-gray-900 border-b border-gray-800">
                        <Image
                          src={img}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute top-3 left-3 bg-orange-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                          {post.category}
                        </span>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-bold text-white text-base hover:text-orange-500 transition-colors line-clamp-2">
                            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                          </h3>
                          <p className="text-xs text-gray-500">By {post.author.name} &bull; {new Date(post.createdAt).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{post.content}</p>
                        </div>
                        <Link
                          href={`/posts/${post.slug}`}
                          className="text-xs font-semibold text-orange-500 hover:text-orange-400 flex items-center gap-1.5 pt-2"
                        >
                          Read More <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming Events Panel */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-wide uppercase">
                UPCOMING EVENTS
              </h2>
              <p className="text-sm text-gray-400 mt-1">Mark your calendars for upcoming skates.</p>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="p-6 rounded-lg border border-gray-850 bg-[#0b0c10] text-center">
                <Calendar className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No upcoming events scheduled.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((evt) => (
                  <div key={evt.id} className="p-4 rounded-lg bg-[#0b0c10] border border-gray-800 hover:border-blue-500/30 transition-all duration-300 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-white text-sm sm:text-base leading-tight hover:text-blue-400 transition-colors">
                        <Link href={`/events/${evt.slug}`}>{evt.name}</Link>
                      </h3>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                        <span>{new Date(evt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-3.5 w-3.5 text-orange-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{evt.location}</span>
                      </div>
                    </div>
                    <Link
                      href={`/events/${evt.slug}`}
                      className="inline-flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300 gap-1"
                    >
                      Event Details <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-orange-600 to-amber-500 py-16 px-4 text-center text-white border-t border-orange-500/20">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Accelerate Your Journey?
          </h2>
          <p className="text-sm sm:text-base text-orange-100 max-w-xl mx-auto leading-relaxed">
            Create an account, submit your achievements, check training logs, and stay connected with the top speed roller skaters in Tamil Nadu.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/register"
              className="bg-white hover:bg-orange-50 text-orange-600 font-bold px-6 py-3 rounded-md shadow-md transition-colors"
            >
              Sign Up Now
            </Link>
            <Link
              href="/about"
              className="border-2 border-white hover:bg-white/10 text-white font-bold px-6 py-3 rounded-md transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
