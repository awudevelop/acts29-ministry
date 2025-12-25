'use client';

import { useState } from 'react';
import {
  Heart,
  Plus,
  CheckCircle,
  Clock,
  Users,
  Send,
} from 'lucide-react';
import { mockPrayerRequests, type PrayerRequest } from '@acts29/database';

export function PrayerContent() {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'answered'>('all');

  const filteredPrayers = mockPrayerRequests.filter((prayer) => {
    if (filter === 'active') return !prayer.is_answered;
    if (filter === 'answered') return prayer.is_answered;
    return true;
  });

  const totalPrayers = mockPrayerRequests.reduce((sum, p) => sum + p.prayer_count, 0);
  const answeredCount = mockPrayerRequests.filter((p) => p.is_answered).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <Heart className="mx-auto h-12 w-12 text-primary-300" />
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Prayer Wall</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-200">
            Share your prayer requests and join us in lifting up the needs of our community.
            Together, we believe in the power of prayer.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-primary-700 shadow-lg transition hover:bg-primary-50"
          >
            <Plus className="h-5 w-5" />
            Submit Prayer Request
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-8 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary-600">{mockPrayerRequests.length}</p>
              <p className="text-sm text-gray-600">Prayer Requests</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-600">{totalPrayers}</p>
              <p className="text-sm text-gray-600">Prayers Offered</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{answeredCount}</p>
              <p className="text-sm text-gray-600">Prayers Answered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Filters */}
          <div className="mb-8 flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Requests
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === 'active'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Clock className="h-4 w-4" />
              Active
            </button>
            <button
              onClick={() => setFilter('answered')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === 'answered'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              Answered
            </button>
          </div>

          {/* Prayer Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrayers.map((prayer) => (
              <PrayerCard key={prayer.id} prayer={prayer} />
            ))}
          </div>

          {filteredPrayers.length === 0 && (
            <div className="rounded-xl bg-white py-12 text-center shadow-md">
              <Heart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No prayer requests found</h3>
              <p className="mt-2 text-gray-600">
                {filter === 'answered'
                  ? 'No answered prayers yet. Keep praying!'
                  : 'Be the first to submit a prayer request.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Scripture */}
      <section className="bg-primary-900 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <blockquote className="text-xl italic text-primary-100">
            &ldquo;Do not be anxious about anything, but in every situation, by prayer and
            petition, with thanksgiving, present your requests to God.&rdquo;
          </blockquote>
          <cite className="mt-4 block font-semibold text-white">— Philippians 4:6</cite>
        </div>
      </section>

      {/* Prayer Request Modal */}
      {showForm && (
        <PrayerRequestModal onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

function PrayerCard({ prayer }: { prayer: PrayerRequest }) {
  const [prayed, setPrayed] = useState(false);
  const [prayerCount, setPrayerCount] = useState(prayer.prayer_count);

  const handlePray = () => {
    if (!prayed) {
      setPrayed(true);
      setPrayerCount((prev) => prev + 1);
    }
  };

  const createdDate = new Date(prayer.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-gray-900">{prayer.title}</h3>
        {prayer.is_answered && (
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
            <CheckCircle className="h-3 w-3" />
            Answered
          </span>
        )}
      </div>

      <p className="mt-3 text-sm text-gray-600">{prayer.description}</p>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {prayer.is_anonymous ? 'Anonymous' : 'Community Member'}
          </span>
          <span>{createdDate}</span>
        </div>

        <button
          onClick={handlePray}
          disabled={prayed}
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition ${
            prayed
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700'
          }`}
        >
          <Heart className={`h-4 w-4 ${prayed ? 'fill-primary-600' : ''}`} />
          {prayed ? 'Prayed' : 'Pray'} ({prayerCount})
        </button>
      </div>
    </div>
  );
}

function PrayerRequestModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to the backend
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">Prayer Request Submitted</h3>
          <p className="mt-2 text-gray-600">
            Thank you for sharing. Our community will be lifting you up in prayer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Submit Prayer Request</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Brief title for your prayer request"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prayer Request
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Share your prayer request..."
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-700">
              Submit anonymously
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700"
            >
              <Send className="h-4 w-4" />
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
