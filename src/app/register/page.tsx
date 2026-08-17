'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Lock, Mail, User, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast('Password must be at least 6 characters long.', 'error');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        toast(`Account created! Welcome, ${data.user.name}.`, 'success');
        login(data.user);
        router.push('/dashboard');
      } else {
        toast(data.error || 'Registration failed.', 'error');
      }
    } catch (err) {
      toast('An unexpected error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-gray-950 p-8 rounded-lg border border-gray-800 space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wider">
            Join <span className="text-orange-500">Club</span>
          </h1>
          <p className="text-xs text-gray-400">Register to submit achievements and post blogs</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rohan Dev"
                className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="skater@gmail.com"
                className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 text-white font-bold p-2.5 rounded text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Register'}
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 border-t border-gray-850 pt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-orange-500 hover:underline font-semibold">
            Log In
          </Link>
        </div>

      </div>
    </div>
  );
}
