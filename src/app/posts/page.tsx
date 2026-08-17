'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Search, ArrowRight } from 'lucide-react';

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

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filtered, setFiltered] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Training', 'Competition', 'Event', 'Club News', 'Other'];

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/public/posts');
        if (res.ok) {
          const json = await res.json();
          setPosts(json.posts || []);
          setFiltered(json.posts || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    let result = posts;

    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }

    setFiltered(result);
  }, [searchTerm, activeCategory, posts]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        <span className="text-sm text-gray-400">Loading club posts...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 py-16 px-4 max-w-7xl mx-auto space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-wider">
          Club <span className="text-orange-500">News & Blog</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Stay up to date with training tutorials, safety tips, competition reports, and announcements.
        </p>
        <div className="h-1 w-20 bg-orange-500 mx-auto mt-2"></div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 bg-gray-950 p-4 rounded-lg border border-gray-800 justify-between items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search posts..."
            className="w-full bg-[#0b0c10] border border-gray-800 rounded pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
          />
        </div>
        
        {/* Categories scroll panel */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none justify-start md:justify-end">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-bold uppercase py-2 px-3 rounded border shrink-0 transition-colors ${
                activeCategory === cat
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-[#0b0c10] border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-gray-950 rounded-lg border border-gray-800 space-y-3">
          <BookOpen className="h-12 w-12 text-gray-600 mx-auto" />
          <p className="text-gray-400">No approved posts found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((post) => {
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
              <article
                key={post.id}
                className="rounded-lg overflow-hidden border border-gray-800 bg-gray-950 hover:border-orange-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-48 w-full bg-gray-900 border-b border-gray-800">
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
                
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-500 font-medium">
                      By {post.author.name} &bull; {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <h2 className="text-lg font-bold text-white leading-tight line-clamp-2 hover:text-orange-500 transition-colors">
                      <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                      {post.content}
                    </p>
                  </div>
                  
                  <Link
                    href={`/posts/${post.slug}`}
                    className="inline-flex items-center text-xs font-semibold text-orange-500 hover:text-orange-400 gap-1"
                  >
                    Read Full Article <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
