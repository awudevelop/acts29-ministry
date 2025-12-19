'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@acts29/ui';
import { Alert } from '@acts29/admin-ui';
import { Eye, EyeOff, Mail, Lock, Zap } from 'lucide-react';

// Demo credentials
const DEMO_EMAIL = 'robert@helpinghands.org';
const DEMO_PASSWORD = 'demo123456';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/admin';

  const [email, setEmail] = React.useState(DEMO_EMAIL);
  const [password, setPassword] = React.useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Demo mode - accept any credentials and redirect
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push(redirect);
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.push('/admin');
    } catch {
      setError('An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-8 shadow-lg">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold text-gray-900">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-600">
          Sign in to access your admin dashboard
        </p>
      </div>

      {/* Quick Demo Access */}
      <div className="mb-6">
        <Button
          type="button"
          onClick={handleDemoLogin}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
          loading={isLoading}
        >
          <Zap className="mr-2 h-4 w-4" />
          Enter Demo Admin Portal
        </Button>
        <p className="mt-2 text-center text-xs text-gray-500">
          Click above to instantly access all admin features
        </p>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">or sign in manually</span>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-10 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="remember"
            type="checkbox"
            defaultChecked
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
            Remember me for 30 days
          </label>
        </div>

        <Button type="submit" variant="outline" className="w-full" loading={isLoading}>
          Sign in with credentials
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* Demo info */}
      <div className="mt-6 rounded-lg bg-primary-50 p-4 border border-primary-100">
        <p className="text-xs text-primary-800">
          <strong>Demo Mode Active:</strong> Pre-filled with demo credentials. Click &quot;Enter Demo Admin Portal&quot; for instant access to all admin features including donations, tax receipts, volunteers, events, cases, and user management.
        </p>
      </div>
    </div>
  );
}
