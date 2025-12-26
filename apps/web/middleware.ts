import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Security Middleware
 *
 * Enforces SSL for payment routes and adds security headers
 * to protect sensitive financial transactions.
 */

// Routes that require SSL enforcement and extra security
const PAYMENT_ROUTES = [
  '/donate',
  '/api/donations',
  '/api/webhooks/hellopayments',
  '/api/webhooks/stripe',
  '/api/webhooks/payments',
  '/admin/donations/payment-links',
];

// Check if the current path matches any payment route
function isPaymentRoute(pathname: string): boolean {
  return PAYMENT_ROUTES.some(route => pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // ===========================================
  // SSL ENFORCEMENT FOR PAYMENT ROUTES
  // ===========================================
  if (isPaymentRoute(pathname)) {
    // Check if request is over HTTPS in production
    const proto = request.headers.get('x-forwarded-proto');
    const isHttps = proto === 'https' || request.nextUrl.protocol === 'https:';

    // In production, redirect HTTP to HTTPS for payment routes
    if (process.env.NODE_ENV === 'production' && !isHttps) {
      const httpsUrl = request.nextUrl.clone();
      httpsUrl.protocol = 'https:';
      return NextResponse.redirect(httpsUrl, 301);
    }

    // ===========================================
    // SECURITY HEADERS FOR PAYMENT ROUTES
    // ===========================================

    // Strict Transport Security - force HTTPS for 1 year
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );

    // Content Security Policy - restrict resource loading
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.hellopayments.com https://js.stripe.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: blob:",
        "font-src 'self' data:",
        "frame-src 'self' https://js.hellopayments.com https://js.stripe.com https://hooks.stripe.com",
        "connect-src 'self' https://api.hellopayments.com https://api.stripe.com wss://*.supabase.co https://*.supabase.co",
        "form-action 'self'",
        "base-uri 'self'",
        "frame-ancestors 'self'",
      ].join('; ')
    );

    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');

    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');

    // Enable XSS filter
    response.headers.set('X-XSS-Protection', '1; mode=block');

    // Referrer policy - don't leak payment data in referrer
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions policy - disable features not needed for payments
    response.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=(self "https://js.hellopayments.com" "https://js.stripe.com")'
    );

    // Cache control - don't cache payment pages
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  // ===========================================
  // WEBHOOK SECURITY
  // ===========================================
  if (pathname.startsWith('/api/webhooks/')) {
    // Only allow POST requests to webhooks
    if (request.method !== 'POST') {
      return new NextResponse('Method Not Allowed', { status: 405 });
    }

    // Ensure content-type is correct
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return new NextResponse('Invalid Content-Type', { status: 415 });
    }
  }

  // ===========================================
  // GENERAL SECURITY HEADERS (for all routes)
  // ===========================================

  // Prevent browsers from performing DNS prefetching
  response.headers.set('X-DNS-Prefetch-Control', 'off');

  // Prevent downloading in some browsers
  response.headers.set('X-Download-Options', 'noopen');

  // Disable some features that can be used for fingerprinting
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');

  return response;
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Payment routes
    '/donate/:path*',
    '/api/donations/:path*',
    '/api/webhooks/:path*',
    '/admin/donations/payment-links/:path*',
    // Also add middleware to all other routes for general security headers
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
