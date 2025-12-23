'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@acts29/ui';
import { Alert } from '@acts29/admin-ui';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Users,
  Shield,
  UserCog,
  Briefcase,
  Heart,
} from 'lucide-react';
import { DEMO_USERS, type DemoUser, getRoleDisplayName, getRoleColor, useAuth } from '@/lib/auth';

// Icon mapping for roles
const roleIcons = {
  super_admin: Shield,
  org_admin: UserCog,
  staff: Briefcase,
  volunteer: Heart,
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/admin';
  const { login, loginAsUser, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<DemoUser | null>(null);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(redirect);
    }
  }, [authLoading, isAuthenticated, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push(redirect);
      } else {
        setError('Invalid email or password. Try one of the demo accounts below.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (user: DemoUser) => {
    setSelectedUser(user);
    setEmail(user.email);
    setPassword(user.password);
    setIsLoading(true);

    try {
      loginAsUser(user);
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.push(redirect);
    } catch {
      setError('An error occurred.');
    } finally {
      setIsLoading(false);
      setSelectedUser(null);
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  // Don't show login form if already authenticated (will redirect)
  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to admin portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Demo Users Quick Access */}
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary-600" />
          <h2 className="font-semibold text-gray-900">Quick Demo Access</h2>
        </div>
        <p className="mb-4 text-sm text-gray-600">
          Select a demo account to explore the portal with different permission levels:
        </p>

        <div className="grid gap-3">
          {DEMO_USERS.map((user) => {
            const Icon = roleIcons[user.role];
            const isSelected = selectedUser?.id === user.id;

            return (
              <button
                key={user.id}
                onClick={() => handleDemoLogin(user)}
                disabled={isLoading}
                className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all hover:border-primary-300 hover:bg-primary-50 disabled:opacity-50 ${
                  isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${getRoleColor(
                    user.role
                  )}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {getRoleDisplayName(user.role)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{user.organization}</p>
                </div>
                {isSelected && isLoading && (
                  <svg
                    className="h-5 w-5 animate-spin text-primary-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Login Form */}
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">or sign in manually</span>
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-4 w-4 text-gray-400" aria-hidden="true" />
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
                <Lock className="h-4 w-4 text-gray-400" aria-hidden="true" />
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" loading={isLoading && !selectedUser}>
            Sign in
          </Button>
        </form>

        <div className="mt-4 text-center">
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
      </div>

      {/* Demo credentials hint */}
      <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
        <p className="text-xs text-blue-800">
          <strong>Demo Mode:</strong> All demo accounts use password{' '}
          <code className="rounded bg-blue-100 px-1 py-0.5">demo123</code> (except Super Admin
          which uses <code className="rounded bg-blue-100 px-1 py-0.5">admin123</code>).
        </p>
      </div>
    </div>
  );
}
