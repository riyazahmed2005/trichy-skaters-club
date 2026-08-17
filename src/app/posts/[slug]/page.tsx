'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowLeft, BookOpen } from 'lucide-react';

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

export default function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPostDetail() {
      try {
        const res = await fetch(`/api/public/posts/${slug}`);
        if (res.ok) {
          const json = await res.json();
          setPost(json.post);
        } else {
          setError('Article not found or not approved yet.');
        }
      } catch (err) {
        setError('Failed to load article.');
      } finally {
        setLoading(false);
      }
    }
    fetchPostDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        <span className="text-sm text-gray-400">Loading article...</span>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <BookOpen className="h-12 w-12 text-gray-600" />
        <span className="text-sm text-gray-400">{error || 'Article not found.'}</span>
        <Link href="/posts" className="text-orange-500 font-bold hover:underline">
          Back to Articles
        </Link>
      </div>
    );
  }

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
    <div className="flex-1 py-12 px-4 max-w-4xl mx-auto space-y-8">
      
      {/* Back button */}
      <div>
        <Link
          href="/posts"
          className="inline-flex items-center text-xs font-bold uppercase text-gray-400 hover:text-white gap-1 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Articles
        </Link>
      </div>

      {/* Main image banner */}
      <div className="relative h-64 sm:h-96 w-full rounded-xl overflow-hidden border border-gray-800 bg-gray-900">
        <Image
          src={img}
          alt={post.title}
          fill
          className="object-cover"
        />
        <span className="absolute top-4 left-4 bg-orange-600 text-white text-xs uppercase font-bold px-3 py-1 rounded">
          {post.category}
        </span>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-gray-400 border-y border-gray-800 py-3">
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-orange-500" />
            <span>Author: {post.author.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-orange-500" />
            <span>Published: {new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="text-gray-300 leading-relaxed text-base sm:text-lg whitespace-pre-wrap font-serif">
        {post.content}
      </div>

    </div>
  );
}
