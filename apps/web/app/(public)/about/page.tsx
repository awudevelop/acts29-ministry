import React from 'react';
import Link from 'next/link';
import {
  Heart,
  Users,
  Utensils,
  Shirt,
  Clock,
  DollarSign,
  MapPin,
  Church,
  HeartHandshake,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              About Acts 29
            </h1>
            <p className="mt-6 text-lg leading-8 text-primary-100">
              Acts 29 Church for the Unsheltered is a registered 501(c)(3) nonprofit organization
              dedicated to providing both spiritual and basic life essentials to individuals
              experiencing homelessness.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
                Our Mission
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Serving the Whole Person
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                At its core, Acts 29 exists to provide both spiritual and basic life essentials
                to individuals experiencing homelessness. We accomplish this by hosting church
                services at three locations in Springfield and one location in Jacksonville.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                We believe that true transformation comes through addressing both the physical
                needs and the spiritual wounds that many experiencing homelessness carry with them.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatCard icon={<Church className="h-6 w-6" />} value="4" label="Service Locations" />
              <StatCard icon={<Utensils className="h-6 w-6" />} value="6,500+" label="Meals Annually" />
              <StatCard icon={<Users className="h-6 w-6" />} value="100%" label="Volunteer-Run" />
              <StatCard icon={<DollarSign className="h-6 w-6" />} value="100%" label="Funds to Ministry" />
            </div>
          </div>
        </div>
      </section>

      {/* Spiritual Essentials Section */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
              Spiritual Essentials
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Restoring Identity Through Truth
            </h2>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-8 shadow-md">
              <BookOpen className="h-10 w-10 text-primary-600" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">The Need</h3>
              <p className="mt-4 text-gray-600">
                The vast majority of individuals experiencing homelessness have endured significant
                trauma at some point in their lives—often mental, physical, sexual, or emotional abuse.
                The cumulative impact of this trauma frequently results in a deeply broken sense of identity.
              </p>
              <blockquote className="mt-4 border-l-4 border-primary-500 pl-4 italic text-gray-700">
                "As a man thinks in his heart, so is he."
                <cite className="mt-1 block text-sm font-semibold text-primary-600">— Proverbs 23:7</cite>
              </blockquote>
              <p className="mt-4 text-gray-600">
                One's identity profoundly shapes life choices and behaviors. When that identity has been
                shattered by abuse and feelings of worthlessness, it often manifests in self-destructive
                decisions and, in many cases, substance addiction.
              </p>
            </div>

            <div className="rounded-xl bg-white p-8 shadow-md">
              <Heart className="h-10 w-10 text-primary-600" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Our Response</h3>
              <p className="mt-4 text-gray-600">
                During our services, we share gospel-centered messages focused on restoring identity
                through biblical truth and offer opportunities for individual prayer.
              </p>
              <p className="mt-4 text-gray-600">
                We consistently communicate that:
              </p>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">God created each person on purpose and for a purpose</span>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">They are deeply loved and forgiven</span>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">God desires a relationship with them regardless of their past or present circumstances</span>
                </li>
              </ul>
              <p className="mt-4 text-gray-600">
                Our volunteers also demonstrate Christ's love by offering prayer, encouragement,
                and Christ-centered relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Basic Life Essentials Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
              Basic Life Essentials
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Love in Action
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We believe love is best expressed through action. Our ministry addresses practical
              needs as a demonstration of God's love.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                <Utensils className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Meals</h3>
              <p className="mt-4 text-gray-600">
                At each of our services in Springfield and Jacksonville, we serve a hot meal.
                Additionally, we partner with My Brother's Keeper to provide food directly to
                individuals living on the streets of Springfield from April through November.
              </p>
              <p className="mt-4 text-gray-600">
                Food meets a basic need and often serves as a bridge to deeper ministry engagement.
              </p>
              <p className="mt-4 text-2xl font-bold text-primary-600">~6,500 meals served annually</p>
            </div>

            <div className="rounded-xl border border-gray-200 p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                <Shirt className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Clothing</h3>
              <p className="mt-4 text-gray-600">
                We provide clothing at our church services. Guests are welcome to select items
                from a free clothing table, and we also accept individual clothing requests.
              </p>
              <p className="mt-4 text-gray-600">
                These requests are fulfilled and distributed as personalized clothing care
                packages during our services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="bg-primary-900 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-300">
              Get Involved
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Five Ways to Engage
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              There are many ways churches and individuals can participate in addressing homelessness.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <EngagementCard
              icon={<HeartHandshake className="h-6 w-6" />}
              title="Prayer"
              description="We covet prayer for God's provision, protection, and continued guidance."
            />
            <EngagementCard
              icon={<Shirt className="h-6 w-6" />}
              title="Clothing"
              description="Gently used clothing can greatly benefit those we serve."
            />
            <EngagementCard
              icon={<Utensils className="h-6 w-6" />}
              title="Food"
              description="Protein, serving containers, and carbohydrates are always appreciated."
            />
            <EngagementCard
              icon={<Clock className="h-6 w-6" />}
              title="Time"
              description="Volunteers are vital to demonstrate God's grace and mercy in practical ways."
            />
            <EngagementCard
              icon={<DollarSign className="h-6 w-6" />}
              title="Treasure"
              description="All funds received are used directly to support the unsheltered."
            />
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/get-involved"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary-700 shadow-lg transition hover:bg-primary-50"
            >
              Learn How to Get Involved
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">
              Our Locations
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Where We Serve
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We host church services at four locations to reach those experiencing homelessness.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { city: 'Springfield', location: 'Location 1' },
              { city: 'Springfield', location: 'Location 2' },
              { city: 'Springfield', location: 'Location 3' },
              { city: 'Jacksonville', location: 'Location 1' },
            ].map((loc, index) => (
              <div key={index} className="rounded-xl border border-gray-200 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{loc.city}</h3>
                <p className="text-sm text-gray-500">{loc.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-accent-500 to-accent-600 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-white">Join Us in This Ministry</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            Should God move your heart to participate through any of these engagement opportunities,
            we would welcome the chance to connect with you.
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
              href="/prayer"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              <HeartHandshake className="h-5 w-5" />
              Submit a Prayer Request
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
    <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
        {icon}
      </div>
      <p className="mt-4 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

function EngagementCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-white/10 p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-primary-200">{description}</p>
    </div>
  );
}
