import Link from 'next/link';
import Image from 'next/image';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const footerNavigation = {
  ministry: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Mission', href: '/about#mission' },
    { name: 'Leadership', href: '/about#leadership' },
    { name: 'Contact', href: '/contact' },
  ],
  resources: [
    { name: 'Find Help', href: '/resources' },
    { name: 'Shelters', href: '/resources?type=shelter' },
    { name: 'Food Banks', href: '/resources?type=food_bank' },
    { name: 'Health Services', href: '/resources?type=clinic' },
  ],
  getInvolved: [
    { name: 'Volunteer', href: '/volunteer' },
    { name: 'Donate', href: '/give' },
    { name: 'Partner Churches', href: '/partners' },
    { name: 'Events Calendar', href: '/calendar' },
  ],
  faith: [
    { name: 'Sermons', href: '/teaching?type=sermon' },
    { name: 'Devotionals', href: '/teaching?type=devotional' },
    { name: 'Testimonies', href: '/teaching?type=testimony' },
    { name: 'Prayer Requests', href: '/prayer' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand section */}
          <div className="space-y-8">
            <Link href="/" className="inline-block">
              <Image
                src="/images/branding/logo.png"
                alt="Acts 29 Ministry"
                width={180}
                height={54}
                className="h-14 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm leading-6 text-gray-300">
              Connecting churches, volunteers, and communities to serve the unsheltered and share the
              transforming love of Jesus Christ.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Springfield, Illinois</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(217) 555-0129</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@acts29ministry.org</span>
              </div>
            </div>
          </div>

          {/* Navigation sections */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  Ministry
                </h3>
                <ul role="list" className="mt-4 space-y-3">
                  {footerNavigation.ministry.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-400 hover:text-white transition"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  Resources
                </h3>
                <ul role="list" className="mt-4 space-y-3">
                  {footerNavigation.resources.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-400 hover:text-white transition"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  Get Involved
                </h3>
                <ul role="list" className="mt-4 space-y-3">
                  {footerNavigation.getInvolved.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-400 hover:text-white transition"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  Faith & Teaching
                </h3>
                <ul role="list" className="mt-4 space-y-3">
                  {footerNavigation.faith.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-400 hover:text-white transition"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Acts 29 Church for the Unsheltered. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-xs text-gray-400">
              Made with <Heart className="h-3 w-3 text-red-500" /> for the glory of God
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
