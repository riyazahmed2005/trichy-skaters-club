'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, X, ZoomIn } from 'lucide-react';

interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  category: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [filtered, setFiltered] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Training', 'Competition', 'Events', 'Winners', 'Celebrations', 'Other'];

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch('/api/public/gallery');
        if (res.ok) {
          const json = await res.json();
          setImages(json.images || []);
          setFiltered(json.images || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFiltered(images);
    } else {
      setFiltered(images.filter((img) => img.category === activeCategory));
    }
  }, [activeCategory, images]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        <span className="text-sm text-gray-400">Loading gallery photos...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 py-16 px-4 max-w-7xl mx-auto space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-wider">
          Photo <span className="text-orange-500">Gallery</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Moments captured at the rinks - training drives, trophy celebrations, and speed races.
        </p>
        <div className="h-1 w-20 bg-orange-500 mx-auto mt-2"></div>
      </div>

      {/* Category Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center border-b border-gray-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs font-bold uppercase py-2 px-4 rounded border shrink-0 transition-colors ${
              activeCategory === cat
                ? 'bg-orange-500 border-orange-500 text-white'
                : 'bg-gray-950 border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Images Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-gray-950 rounded-lg border border-gray-800 space-y-3">
          <ImageIcon className="h-12 w-12 text-gray-600 mx-auto" />
          <p className="text-gray-400">No images uploaded under this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((img) => (
            <div
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className="group relative h-64 overflow-hidden rounded-lg border border-gray-800 bg-gray-950 cursor-pointer hover:border-orange-500/40 transition-all duration-300"
            >
              <Image
                src={img.url}
                alt={img.caption}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="bg-orange-600 text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded self-start mb-2">
                  {img.category}
                </span>
                <p className="text-sm font-semibold text-white leading-snug line-clamp-2">{img.caption}</p>
                <span className="text-[10px] text-orange-400 font-medium mt-1 flex items-center gap-1">
                  <ZoomIn className="h-3.5 w-3.5" /> Click to zoom
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-gray-900 border border-gray-800 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center">
            <Image
              src={selectedImage.url}
              alt={selectedImage.caption}
              width={1200}
              height={800}
              className="max-h-full w-auto object-contain rounded border border-gray-850"
            />
          </div>

          <div className="text-center mt-4 max-w-lg space-y-1">
            <span className="text-xs uppercase text-orange-500 font-bold tracking-wider">{selectedImage.category}</span>
            <p className="text-sm text-gray-300 font-medium">{selectedImage.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}
