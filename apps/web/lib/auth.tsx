'use client';

import * as React from 'react';

// Demo users with credentials
export const DEMO_USERS = [
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    email: 'robert@helpinghands.org',
    password: 'demo123',
    firstName: 'Robert',
    lastName: 'Gillespie',
    role: 'org_admin' as const,
    organization: 'Helping Hands of Springfield',
    avatarUrl: null,
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440002',
    email: 'david@innercitymission.org',
    password: 'demo123',
    firstName: 'David',
    lastName: 'Thompson',
    role: 'org_admin' as const,
    organization: 'Inner City Mission',
    avatarUrl: null,
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440005',
    email: 'angela@helpinghands.org',
    password: 'demo123',
    firstName: 'Angela',
    lastName: 'Wilson',
    role: 'staff' as const,
    organization: 'Helping Hands of Springfield',
    avatarUrl: null,
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440004',
    email: 'jennifer@volunteer.org',
    password: 'demo123',
    firstName: 'Jennifer',
    lastName: 'Martinez',
    role: 'volunteer' as const,
    organization: 'Helping Hands of Springfield',
    avatarUrl: null,
  },
  {
    id: 'super-admin-001',
    email: 'admin@acts29.org',
    password: 'admin123',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'super_admin' as const,
    organization: 'Acts29 Ministry',
    avatarUrl: null,
  },
] as const;

export type DemoUser = (typeof DEMO_USERS)[number];
export type UserRole = DemoUser['role'];

interface AuthContextType {
  user: DemoUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsUser: (user: DemoUser) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'acts29_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<DemoUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);

  // Handle hydration - only access localStorage after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Load user from localStorage on mount
  React.useEffect(() => {
    if (!mounted) return;

    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Verify it's a valid demo user
        const demoUser = DEMO_USERS.find((u) => u.id === parsed.id);
        if (demoUser) {
          setUser(demoUser);
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setIsLoading(false);
  }, [mounted]);

  const login = React.useCallback(async (email: string, password: string): Promise<boolean> => {
    // Find matching demo user
    const matchedUser = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (matchedUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matchedUser));
      setUser(matchedUser);
      return true;
    }

    return false;
  }, []);

  const loginAsUser = React.useCallback((demoUser: DemoUser) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
  }, []);

  const logout = React.useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    // Navigation is handled by the component calling logout
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      loginAsUser,
      logout,
    }),
    [user, isLoading, login, loginAsUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook to require authentication
export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  return { isAuthenticated, isLoading };
}

// Role-based access check
export function hasAccess(userRole: UserRole | undefined, requiredRoles: UserRole[]): boolean {
  if (!userRole) return false;

  // Super admin has access to everything
  if (userRole === 'super_admin') return true;

  return requiredRoles.includes(userRole);
}

// Get role display name
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    super_admin: 'Super Admin',
    org_admin: 'Administrator',
    staff: 'Staff',
    volunteer: 'Volunteer',
  };
  return names[role] || role;
}

// Get role color for badges
export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    super_admin: 'bg-purple-100 text-purple-800',
    org_admin: 'bg-blue-100 text-blue-800',
    staff: 'bg-green-100 text-green-800',
    volunteer: 'bg-amber-100 text-amber-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
}
