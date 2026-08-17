'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Plus, Trash2, Loader2, Upload, X } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category: string;
  createdAt: string;
  uploadedBy: { name: string };
}

const CATEGORIES = ['Training', 'Competition', 'Events', 'Winners', 'Celebrations', 'Other'];
const CATEGORY_FILTERS = ['All', ...CATEGORIES];

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState('All');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('Training');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/gallery');
      if (res.ok) {
        const json = await res.json();
        setImages(json.images || []);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !caption || !category) return;

    setUploading(true);
    try {
      // Upload file first
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'gallery');

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        alert(uploadData.error || 'Upload failed');
        return;
      }

      // Create gallery record
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: uploadData.url, caption, category }),
      });

      if (res.ok) {
        setCaption('');
        setCategory('Training');
        setFile(null);
        setShowForm(false);
        fetchImages();
      }
    } finally {
      setUploading(false);
    }
  }

  async function deleteImage(id: string) {
    if (!confirm('Delete this gallery image permanently?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  }

  const filtered = filterCat === 'All' ? images : images.filter((img) => img.category === filterCat);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-pink-500" /> Gallery Management
          </h1>
          <p className="text-sm text-gray-400">{images.length} images in gallery</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Add Image'}
        </button>
      </div>

      {/* Upload Form */}
      {showForm && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Upload New Gallery Image</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div
              className="border-2 border-dashed border-gray-700 hover:border-orange-500/50 rounded-lg p-8 text-center cursor-pointer transition-colors relative"
            >
              {file ? (
                <p className="text-sm text-orange-400 font-medium">{file.name}</p>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-gray-600 mx-auto" />
                  <p className="text-sm text-gray-400">Click or drag to upload image</p>
                  <p className="text-xs text-gray-600">JPG, PNG, WEBP (Max 5MB)</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Caption</label>
                <input
                  type="text"
                  required
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Image caption"
                  className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded-lg p-2.5 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded-lg p-2.5 text-sm focus:border-orange-500 focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading || !file}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-1 flex-wrap bg-gray-900 border border-gray-800 rounded-lg p-1 w-fit">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
              filterCat === cat ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500" />
          <span className="text-sm text-gray-400">Loading gallery...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-800 rounded-lg">
          <ImageIcon className="h-12 w-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No images in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((img) => (
            <div key={img.id} className="group relative rounded-lg overflow-hidden border border-gray-800 bg-gray-900 aspect-square">
              <img
                src={img.url}
                alt={img.caption}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="text-right">
                  <button
                    onClick={() => deleteImage(img.id)}
                    disabled={deleting === img.id}
                    className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors"
                  >
                    {deleting === img.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                <div>
                  <p className="text-white text-xs font-semibold leading-tight">{img.caption}</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">{img.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
