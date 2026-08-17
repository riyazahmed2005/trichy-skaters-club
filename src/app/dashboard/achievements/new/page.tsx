'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';

export default function CreateAchievementPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [skaterName, setSkaterName] = useState('');
  const [competitionName, setCompetitionName] = useState('');
  const [position, setPosition] = useState('GOLD');
  const [category, setCategory] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const positions = [
    { label: 'Gold / 1st', value: 'GOLD' },
    { label: 'Silver / 2nd', value: 'SILVER' },
    { label: 'Bronze / 3rd', value: 'BRONZE' },
    { label: 'Participation', value: 'PARTICIPATION' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skaterName || !competitionName || !position || !category || !eventDate || !description) {
      toast('Please fill all required fields.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      let photoUrl = '';
      let certificateUrl = '';

      // Upload Photo File if present
      if (photoFile) {
        const formData = new FormData();
        formData.append('file', photoFile);
        formData.append('folder', 'achievements');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          photoUrl = uploadData.url;
        } else {
          toast(uploadData.error || 'Photo upload failed', 'error');
          setSubmitting(false);
          return;
        }
      }

      // Upload Certificate File if present
      if (certFile) {
        const formData = new FormData();
        formData.append('file', certFile);
        formData.append('folder', 'certificates');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          certificateUrl = uploadData.url;
        } else {
          toast(uploadData.error || 'Certificate upload failed', 'error');
          setSubmitting(false);
          return;
        }
      }

      // Create Achievement
      const res = await fetch('/api/user/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skaterName,
          competitionName,
          position,
          category,
          eventDate,
          description,
          photoUrl,
          certificateUrl,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast('Achievement submitted! Pending admin verification.', 'success');
        router.push('/dashboard');
      } else {
        toast(data.error || 'Failed to submit achievement', 'error');
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
          <h1 className="text-xl font-bold text-white">Submit Skating Achievement</h1>
          <p className="text-xs text-gray-400">Add competition standings, medal positions, and certificates.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Skater Name</label>
              <input
                type="text"
                required
                value={skaterName}
                onChange={(e) => setSkaterName(e.target.value)}
                placeholder="e.g. Kavin Raj"
                className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded p-2.5 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Competition / Meet Name</label>
              <input
                type="text"
                required
                value={competitionName}
                onChange={(e) => setCompetitionName(e.target.value)}
                placeholder="e.g. 59th National Championships"
                className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded p-2.5 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Position Status</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded p-2.5 text-sm focus:border-orange-500 focus:outline-none"
              >
                {positions.map((pos) => (
                  <option key={pos.value} value={pos.value}>
                    {pos.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Category / Event Name</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. 500m Rink Speed quad"
                className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded p-2.5 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Event Date</label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded p-2.5 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Upload Photo (Optional)</label>
              <div className="relative border border-dashed border-gray-850 hover:border-gray-700 rounded p-2 text-center text-xs text-gray-400 transition-colors flex items-center justify-center gap-2 cursor-pointer bg-[#0b0c10]">
                <Upload className="h-4 w-4 text-gray-500" />
                <span>{photoFile ? photoFile.name : 'Select Skater Photo (Max 5MB)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Upload Certificate (Optional)</label>
              <div className="relative border border-dashed border-gray-850 hover:border-gray-700 rounded p-2 text-center text-xs text-gray-400 transition-colors flex items-center justify-center gap-2 cursor-pointer bg-[#0b0c10]">
                <Upload className="h-4 w-4 text-gray-500" />
                <span>{certFile ? certFile.name : 'Select Certificate PDF/JPG (Max 10MB)'}</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Short Description / Remarks</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Set a district record, won gold in road sprint..."
              className="w-full bg-[#0b0c10] border border-gray-800 text-white rounded p-2.5 text-sm focus:border-orange-500 focus:outline-none resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-850 text-white font-bold p-2.5 rounded text-sm transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Achievement'}
          </button>
        </form>
      </div>
    </div>
  );
}
