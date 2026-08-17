'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';

export default function CreatePostPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Training');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Training', 'Competition', 'Event', 'Club News', 'Other'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !category) {
      toast('Please fill all required fields.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      let imageUrls: string[] = [];

      // Handle file upload if present
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'posts');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          imageUrls.push(uploadData.url);
        } else {
          toast(uploadData.error || 'File upload failed', 'error');
          setSubmitting(false);
          return;
        }
      }

      // Create Post
      const res = await fetch('/api/user/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          category,
          images: imageUrls,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast('Post submitted! Pending administrator approval.', 'success');
        router.push('/dashboard');
      } else {
        toast(data.error || 'Failed to submit post', 'error');
      }
    } catch {
      toast('An unexpected error occurred.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 py-12 px-4 max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center text-xs font-bold uppercase text-gray-400 hover:text-white gap-1 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="p-8 rounded-lg bg-gray-950 border border-gray-800 space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-white">Create Club Post</h1>
          <p className="text-xs text-gray-400">All submissions are reviewed by moderators before appearing publicly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Post Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Tips on cleaning skate bearings"
              className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded p-2.5 text-sm focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded p-2.5 text-sm focus:border-orange-500 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Upload Photo (Optional)</label>
              <div className="relative border border-dashed border-gray-850 hover:border-gray-700 rounded p-2 text-center text-xs text-gray-400 transition-colors flex items-center justify-center gap-2 cursor-pointer bg-[#0b0c10]">
                <Upload className="h-4 w-4 text-gray-500" />
                <span>{file ? file.name : 'Select JPG, PNG, WEBP (Max 5MB)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Post content / description</label>
            <textarea
              rows={8}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write detailed training information, safety guide, event recap, etc..."
              className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded p-2.5 text-sm focus:border-orange-500 focus:outline-none resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-850 text-white font-bold p-2.5 rounded text-sm transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Post'}
          </button>
        </form>
      </div>
    </div>
  );
}
