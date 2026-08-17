import React from 'react';
import Image from 'next/image';
import { Target, Heart, Award, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex-1 py-16 px-4 max-w-7xl mx-auto space-y-16">
      
      {/* Title */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
          About <span className="text-orange-500">Trichy Skaters</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Nurturing roller sports passion, fitness, and champions in Tiruchirappalli since our foundation.
        </p>
        <div className="h-1 w-20 bg-orange-500 mx-auto mt-2"></div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white leading-tight">
            Our Vision: Building a Legacy of Fast & Focused Athletes
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            At Trichy Skaters, we operate on three pillars: Safety, Discipline, and Progress. We provide specialized coaching to students from age 4 onwards, helping them learn basic quad balance all the way to professional speed skating crossovers and marathon pacing.
          </p>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Our members train regularly at the public Anna Stadium Roller Skating rink and hold special early morning sessions on verified smooth-surface road routes in Trichy. We prepare candidates for District, State, and National selection trials under the Roller Skating Federation of India (RSFI).
          </p>
        </div>
        <div className="flex justify-center">
          <div className="relative w-80 h-80 rounded-2xl overflow-hidden border-2 border-orange-500/20 bg-gray-950 p-6 flex items-center justify-center">
            <Image
              src="/logo.jpg"
              alt="Trichy Skaters Logo"
              width={300}
              height={300}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Coaching staff & Pillars */}
      <div className="space-y-8 pt-8">
        <h2 className="text-xl sm:text-3xl font-extrabold text-center text-white uppercase tracking-wider">
          Core Pillars of Training
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-lg bg-gray-950 border border-gray-800 space-y-3">
            <Target className="h-8 w-8 text-orange-500" />
            <h3 className="text-white font-bold text-base">Elite Techniques</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Continuous focus on the straightaway push, lean mechanics, and pacing tactics.</p>
          </div>
          <div className="p-6 rounded-lg bg-gray-950 border border-gray-800 space-y-3">
            <Heart className="h-8 w-8 text-blue-400" />
            <h3 className="text-white font-bold text-base">Fun & Fitness</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Fostering active lifestyles, core physical strength, and coordination exercises.</p>
          </div>
          <div className="p-6 rounded-lg bg-gray-950 border border-gray-800 space-y-3">
            <Award className="h-8 w-8 text-amber-500" />
            <h3 className="text-white font-bold text-base">Championship Prep</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Mock time-trials and race simulation to boost student confidence.</p>
          </div>
          <div className="p-6 rounded-lg bg-gray-950 border border-gray-800 space-y-3">
            <ShieldCheck className="h-8 w-8 text-emerald-400" />
            <h3 className="text-white font-bold text-base">Safety First</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Full check of protective guards and helmets prior to stepping on tracks.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
