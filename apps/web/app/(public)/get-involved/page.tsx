'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Heart,
  HeartHandshake,
  Droplets,
  Utensils,
  Shirt,
  Users,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  ArrowRight,
  ArrowDown,
  Shield,
  Package,
  Info,
} from 'lucide-react';
import {
  mockVolunteerShifts,
  mockResources,
  mockStats,
  mockPrayerRequests,
} from '@acts29/database';
import {
  calculateDonationWithFees,
  DEFAULT_FEE_COVERAGE_PERCENTAGE,
} from '@acts29/validators';

const donationAmounts = [25, 50, 100, 250, 500, 1000];

const goodsNeeded = [
  {
    icon: <Droplets className="h-6 w-6" />,
    title: 'Bottled Water',
    description: 'Cases of water for street outreach and day services',
    priority: 'high',
  },
  {
    icon: <Utensils className="h-6 w-6" />,
    title: 'Non-Perishable Food',
    description: 'Canned goods, granola bars, peanut butter, etc.',
    priority: 'high',
  },
  {
    icon: <Shirt className="h-6 w-6" />,
    title: 'Clothing',
    description: 'Gently used or new coats, socks, underwear, shoes',
    priority: 'medium',
  },
  {
    icon: <Package className="h-6 w-6" />,
    title: 'Hygiene Items',
    description: 'Toiletries, feminine products, diapers, wipes',
    priority: 'medium',
  },
];

const volunteerRoles = [
  {
    icon: <Utensils className="h-6 w-6" />,
    title: 'Meal Service',
    description: 'Prepare and serve meals at shelters',
    commitment: '2-4 hours/week',
  },
  {
    icon: <Shirt className="h-6 w-6" />,
    title: 'Clothing Closet',
    description: 'Sort donations and help guests find clothing',
    commitment: '2-3 hours/week',
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: 'Street Outreach',
    description: 'Bring supplies and compassion to those on the streets',
    commitment: '3-4 hours/week',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Case Support',
    description: 'Help individuals navigate resources',
    commitment: '4-6 hours/week',
  },
];

export default function GetInvolvedPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time');
  const [coverFees, setCoverFees] = useState(true);

  const baseAmount = customAmount ? parseInt(customAmount, 10) : selectedAmount;

  const donationDetails = useMemo(() => {
    if (!baseAmount || baseAmount <= 0) {
      return null;
    }
    return calculateDonationWithFees(baseAmount, coverFees, DEFAULT_FEE_COVERAGE_PERCENTAGE);
  }, [baseAmount, coverFees]);

  const upcomingShifts = mockVolunteerShifts
    .filter((shift) => new Date(shift.start_time) > new Date())
    .slice(0, 3);

  const recentPrayers = mockPrayerRequests.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <HeartHandshake className="mx-auto h-16 w-16 text-white/80" />
            <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">
              Get Involved
            </h1>
            <p className="mt-6 text-lg text-primary-100">
              Every act of compassion matters. Whether through prayer, giving goods,
              volunteering your time, or financial support—you can make a difference
              in the lives of those experiencing homelessness.
            </p>
            <div className="mt-8 flex items-center justify-center gap-2 text-primary-200">
              <ArrowDown className="h-5 w-5 animate-bounce" />
              <span className="text-sm font-medium">Find your way to help</span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Links */}
      <section className="bg-white py-6 border-b">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center justify-center gap-6 md:gap-12 overflow-x-auto pb-2">
            <a href="#pray" className="text-sm font-medium text-gray-600 hover:text-primary-600 whitespace-nowrap">Pray</a>
            <a href="#goods" className="text-sm font-medium text-gray-600 hover:text-primary-600 whitespace-nowrap">Donate Goods</a>
            <a href="#volunteer" className="text-sm font-medium text-gray-600 hover:text-primary-600 whitespace-nowrap">Volunteer</a>
            <a href="#give" className="text-sm font-medium text-gray-600 hover:text-primary-600 whitespace-nowrap">Give</a>
          </div>
        </div>
      </section>

      {/* LEVEL 1: PRAY */}
      <section id="pray" className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Pray With Us</h2>
              <p className="mt-4 text-lg text-gray-600">
                Prayer is the foundation of everything we do. We believe God moves when His
                people pray, and we need your prayers covering this ministry, our volunteers,
                and most importantly—those we serve.
              </p>
              <blockquote className="mt-6 border-l-4 border-primary-500 pl-4 italic text-gray-700">
                &ldquo;The prayer of a righteous person is powerful and effective.&rdquo;
                <cite className="mt-2 block text-sm font-medium text-primary-700">— James 5:16</cite>
              </blockquote>
              <div className="mt-8">
                <Link
                  href="/prayer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700"
                >
                  <Heart className="h-5 w-5" />
                  View Prayer Requests
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Current Prayer Needs</h3>
              {recentPrayers.map((prayer) => (
                <div key={prayer.id} className="rounded-xl bg-white p-5 shadow-md">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-gray-900">{prayer.title}</h4>
                    {prayer.is_answered && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        Answered!
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{prayer.description}</p>
                  <div className="mt-3 flex items-center gap-1 text-sm text-primary-600">
                    <Heart className="h-4 w-4" />
                    {prayer.prayer_count} prayers
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LEVEL 2: DONATE GOODS */}
      <section id="goods" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Donate Water, Food & Clothing</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              We all have extra food, clothing, or could afford a case of water. These
              basic necessities are always needed and make an immediate impact in
              someone&apos;s life.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {goodsNeeded.map((item) => (
              <div
                key={item.title}
                className="group rounded-xl border-2 border-gray-200 bg-white p-6 transition hover:border-accent-500 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-100 text-accent-600 transition group-hover:bg-accent-600 group-hover:text-white">
                    {item.icon}
                  </div>
                  {item.priority === 'high' && (
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                      Urgent Need
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl bg-accent-50 p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900">Drop-Off Locations</h3>
            <p className="mt-2 text-gray-600">
              Donations can be dropped off at any of our partner ministry locations during regular hours.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 rounded-lg bg-accent-600 px-6 py-3 font-semibold text-white transition hover:bg-accent-700"
              >
                <MapPin className="h-5 w-5" />
                Find Drop-Off Locations
              </Link>
              <button className="inline-flex items-center gap-2 rounded-lg border-2 border-accent-600 px-6 py-3 font-semibold text-accent-700 transition hover:bg-accent-50">
                <Package className="h-5 w-5" />
                Schedule a Pickup
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LEVEL 3: VOLUNTEER */}
      <section id="volunteer" className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Volunteer to Serve</h2>
              <p className="mt-4 text-lg text-gray-600">
                Join our community of {mockStats.activeVolunteers}+ volunteers who have
                contributed over {mockStats.volunteerHours.toLocaleString()} hours of service.
                Your time and presence can transform lives.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {volunteerRoles.map((role) => (
                  <div key={role.title} className="rounded-lg bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                        {role.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{role.title}</h4>
                        <p className="text-xs text-gray-500">{role.commitment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <button className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700">
                  <CheckCircle className="h-5 w-5" />
                  Register as Volunteer
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Upcoming Opportunities</h3>
              <div className="mt-4 space-y-4">
                {upcomingShifts.map((shift) => {
                  const resource = mockResources.find((r) => r.id === shift.resource_id);
                  const startDate = new Date(shift.start_time);
                  const endDate = new Date(shift.end_time);

                  return (
                    <div key={shift.id} className="rounded-xl bg-white p-5 shadow-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{shift.role}</h4>
                          {resource && (
                            <p className="text-sm text-gray-500">{resource.name}</p>
                          )}
                        </div>
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          Open
                        </span>
                      </div>
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {startDate.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </div>
                      <button className="mt-4 w-full rounded-lg bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 transition hover:bg-primary-100">
                        Sign Up
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEVEL 4: DONATE MONEY */}
      <section id="give" className="bg-gradient-to-br from-accent-500 to-accent-700 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="text-white">
              <h2 className="text-3xl font-bold">Make a Financial Gift</h2>
              <p className="mt-4 text-lg text-white/90">
                Your financial gift enables us to provide shelter, meals, case management,
                and share the hope of the Gospel with those who need it most.
              </p>

              <div className="mt-8 space-y-4">
                <ImpactItem amount={25} impact="Provides 10 meals for someone in need" />
                <ImpactItem amount={50} impact="Supplies hygiene kits for 5 people" />
                <ImpactItem amount={100} impact="Covers one night of emergency shelter" />
                <ImpactItem amount={250} impact="Funds job training for one individual" />
              </div>

              <div className="mt-8 rounded-xl bg-white/10 p-6">
                <p className="text-sm font-medium uppercase tracking-wider text-white/80">
                  Together We&apos;ve Raised
                </p>
                <p className="mt-2 text-4xl font-bold">
                  ${mockStats.totalDonations.toLocaleString()}
                </p>
                <p className="mt-2 text-white/80">
                  Serving {mockStats.totalPeopleServed.toLocaleString()} people across Springfield
                </p>
              </div>
            </div>

            {/* Donation Form */}
            <div className="rounded-2xl bg-white p-8 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900">Make a Donation</h3>

              {/* Donation Type Toggle */}
              <div className="mt-6 flex rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => setDonationType('one-time')}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                    donationType === 'one-time'
                      ? 'bg-white text-gray-900 shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  One-Time Gift
                </button>
                <button
                  onClick={() => setDonationType('monthly')}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                    donationType === 'monthly'
                      ? 'bg-white text-gray-900 shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Monthly Giving
                </button>
              </div>

              {/* Amount Selection */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">Select Amount</label>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  {donationAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                      className={`rounded-lg border-2 py-3 text-center font-semibold transition ${
                        selectedAmount === amount && !customAmount
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                <div className="relative mt-4">
                  <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              </div>

              {/* Fee Coverage Option */}
              <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="coverFees"
                    checked={coverFees}
                    onChange={(e) => setCoverFees(e.target.checked)}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <label htmlFor="coverFees" className="block cursor-pointer font-medium text-gray-900">
                      Cover processing fees
                    </label>
                    <p className="mt-1 text-sm text-gray-600">
                      Add {DEFAULT_FEE_COVERAGE_PERCENTAGE}% so 100% of your gift goes to the ministry.
                    </p>
                    {donationDetails && baseAmount && baseAmount > 0 && (
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <Info className="h-4 w-4 text-primary-600" />
                        {coverFees ? (
                          <span className="text-gray-700">
                            ${baseAmount} + <span className="text-primary-600">${donationDetails.feeAmount.toFixed(2)}</span> = <span className="font-semibold text-green-600">${donationDetails.totalAmount.toFixed(2)}</span>
                          </span>
                        ) : (
                          <span className="text-gray-500">Your donation: <span className="font-semibold">${baseAmount}</span></span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Donation Button */}
              <button
                disabled={!baseAmount || baseAmount <= 0}
                className="mt-6 w-full rounded-lg bg-primary-600 py-4 text-lg font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {donationType === 'monthly' ? 'Give Monthly' : 'Give'}{' '}
                {donationDetails ? `$${donationDetails.totalAmount.toFixed(2)}` : baseAmount ? `$${baseAmount}` : ''}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Secure donation powered by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tax Info */}
      <section className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <p className="text-sm text-gray-600">
            Acts29 Ministry is a registered 501(c)(3) nonprofit organization. Your donation is
            tax-deductible to the full extent allowed by law.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary-900 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-white">Every Act of Compassion Matters</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-200">
            Whether you pray, give goods, volunteer, or donate—you are part of bringing
            hope and the love of Christ to those in need.
          </p>
          <div className="mt-8">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-primary-300 transition hover:text-white"
            >
              Learn more about our mission
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ImpactItem({ amount, impact }: { amount: number; impact: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle className="h-5 w-5 text-white/80" />
      <span className="text-white">
        <span className="font-semibold">${amount}</span> — {impact}
      </span>
    </div>
  );
}
