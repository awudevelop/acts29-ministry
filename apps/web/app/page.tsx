import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  Utensils,
  Heart,
  BookOpen,
  Users,
  HeartHandshake,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { mockStats, mockContent, mockPrayerRequests } from '@acts29/database';

export default function HomePage() {
  const featuredTestimony = mockContent.find((c) => c.type === 'testimony');
  const recentPrayers = mockPrayerRequests.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-navy-900 py-20 lg:py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/branding/springfield-capitol.jpeg"
            alt="Springfield, Illinois Capitol"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900/90 via-navy-800/80 to-navy-900/90" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Acts 29 Church
              <br />
              <span className="text-gold-400">for the Unsheltered</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-200">
              Serving Springfield, Illinois and beyond—connecting churches, volunteers, and communities
              to provide hope, resources, and the transforming love of Jesus Christ to those experiencing
              homelessness.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-3 text-base font-semibold text-navy-900 shadow-lg transition hover:bg-gold-400"
              >
                <MapPin className="h-5 w-5" />
                Find Resources Near You
              </Link>
              <Link
                href="/get-involved"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                <Users className="h-5 w-5" />
                Get Involved
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-12 z-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              icon={<Users className="h-6 w-6" />}
              value={mockStats.totalPeopleServed.toLocaleString()}
              label="People Served"
            />
            <StatCard
              icon={<Utensils className="h-6 w-6" />}
              value={mockStats.mealsProvided.toLocaleString()}
              label="Meals Provided"
            />
            <StatCard
              icon={<HeartHandshake className="h-6 w-6" />}
              value={mockStats.volunteerHours.toLocaleString()}
              label="Volunteer Hours"
            />
            <StatCard
              icon={<Heart className="h-6 w-6" />}
              value={`$${(mockStats.totalDonations / 1000).toFixed(0)}K`}
              label="Donations Raised"
            />
          </div>
        </div>
      </section>

      {/* Scripture Quote */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <blockquote className="text-xl italic text-gray-700 lg:text-2xl">
            &ldquo;For I was hungry and you gave me something to eat, I was thirsty and you gave me
            something to drink, I was a stranger and you invited me in, I needed clothes and you
            clothed me, I was sick and you looked after me, I was in prison and you came to visit
            me.&rdquo;
          </blockquote>
          <cite className="mt-4 block text-lg font-semibold text-primary-700">
            — Matthew 25:35-36
          </cite>
        </div>
      </section>

      {/* Features/Services Section */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How We Serve
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Comprehensive support for those experiencing homelessness and the communities that
              serve them.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Home className="h-8 w-8" />}
              title="Resource Directory"
              description="Find shelters, food banks, clinics, and other essential services in your area."
              href="/resources"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Get Involved"
              description="Pray, donate goods, volunteer your time, or give financially to support the mission."
              href="/get-involved"
            />
            <FeatureCard
              icon={<BookOpen className="h-8 w-8" />}
              title="Gospel Teaching"
              description="Access sermons, devotionals, and spiritual resources to grow in faith."
              href="/teaching"
            />
            <FeatureCard
              icon={<HeartHandshake className="h-8 w-8" />}
              title="Case Management"
              description="Helping individuals navigate their journey from crisis to stability."
              href="/about"
            />
            <FeatureCard
              icon={<MapPin className="h-8 w-8" />}
              title="Partner Network"
              description="A growing network of churches and organizations working together."
              href="/about"
            />
          </div>
        </div>
      </section>

      {/* Testimony Section */}
      {featuredTestimony && (
        <section className="bg-primary-900 py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-primary-300">
                Testimony
              </span>
              <h2 className="mt-2 text-3xl font-bold text-white">{featuredTestimony.title}</h2>
              <p className="mt-6 text-lg leading-8 text-primary-100">
                {featuredTestimony.body?.slice(0, 300)}...
              </p>
              <Link
                href={`/teaching/${featuredTestimony.id}`}
                className="mt-8 inline-flex items-center gap-2 text-primary-300 hover:text-white transition"
              >
                Read the full story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Prayer Requests Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Prayer Requests</h2>
              <p className="mt-2 text-gray-600">Join us in lifting up these needs to the Lord.</p>
            </div>
            <Link
              href="/prayer"
              className="hidden items-center gap-2 text-primary-600 hover:text-primary-700 sm:flex"
            >
              View all requests
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPrayers.map((prayer) => (
              <PrayerCard key={prayer.id} prayer={prayer} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/prayer" className="text-primary-600 hover:text-primary-700">
              View all prayer requests →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-accent-500 to-accent-600 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-white">Ready to Make a Difference?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            Whether through prayer, giving goods, volunteering, or financial support—
            every act of compassion matters.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/get-involved"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-accent-600 shadow-lg transition hover:bg-gray-100"
            >
              <Users className="h-5 w-5" />
              Get Involved
            </Link>
            <Link
              href="/get-involved#give"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              <Heart className="h-5 w-5" />
              Make a Donation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary-100 text-primary-600 transition group-hover:bg-primary-600 group-hover:text-white">
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:text-primary-700">
        Learn more
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function PrayerCard({ prayer }: { prayer: (typeof mockPrayerRequests)[0] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-gray-900">{prayer.title}</h3>
        {prayer.is_answered && (
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
            Answered!
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-600 line-clamp-3">{prayer.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {prayer.is_anonymous ? 'Anonymous' : 'Community Member'}
        </span>
        <span className="flex items-center gap-1 text-sm text-primary-600">
          <Heart className="h-4 w-4" />
          {prayer.prayer_count} prayers
        </span>
      </div>
    </div>
  );
}
