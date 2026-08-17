'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Lock, Mail, Loader2 } from 'lucide-react';

function LoginForm() {
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        toast(`Welcome back, ${data.user.name}!`, 'success');
        login(data.user);
        
        // Redirect logic
        if (callbackUrl) {
          router.push(callbackUrl);
        } else if (data.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        toast(data.error || 'Login failed', 'error');
      }
    } catch (err) {
      toast('An unexpected error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="••••••••"
            className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 text-white font-bold p-2.5 rounded text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Log In'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-gray-950 p-8 rounded-lg border border-gray-800 space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wider">
            Skaters <span className="text-orange-500">Login</span>
          </h1>
          <p className="text-xs text-gray-400">Access your skater dashboard and announcements</p>
        </div>

        <Suspense fallback={<div className="text-center py-4 text-gray-400"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>}>
          <LoginForm />
        </Suspense>

        <div className="text-center text-xs text-gray-400 border-t border-gray-850 pt-4">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-orange-500 hover:underline font-semibold">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
}
