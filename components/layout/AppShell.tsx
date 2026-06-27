'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useAuth } from '@/contexts/AuthContext';

const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];

function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" stroke="currentColor" strokeWidth={2.5}>
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));

  useEffect(() => {
    if (loading) return;
    if (!user && !isAuthRoute) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
    if (user && isAuthRoute) {
      router.replace('/');
    }
  }, [user, loading, isAuthRoute, pathname, router]);

  // Show loading while checking auth
  if (loading) return <LoadingScreen />;

  // Auth pages — clean centered layout
  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-slate-50">
        {children}
      </div>
    );
  }

  // Protected app pages — require auth
  if (!user) return <LoadingScreen />;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col ml-64">
        <TopBar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
