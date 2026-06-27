'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Flame,
  Zap,
  ChevronDown,
  Settings,
  LogOut,
  User,
  Bell,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getProgress } from '@/lib/progress';

function UserAvatar({ name, avatarUrl }: { name: string | null; avatarUrl: string | null }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name ?? 'User'}
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-brand text-white text-xs font-semibold">
      {initials}
    </div>
  );
}

export function TopBar() {
  const { profile, user, signOut } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = getProgress();

  const displayName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'User';
  const email = profile?.email ?? user?.email ?? '';
  const isAdmin = profile?.role === 'admin';

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-sm px-6">
      {/* Left — breadcrumb or empty */}
      <div />

      {/* Right — stats + user menu */}
      <div className="flex items-center gap-3">
        {/* Streak */}
        <div className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-600">
          <Flame className="h-3.5 w-3.5" />
          {progress.streak}d streak
        </div>

        {/* XP */}
        <div className="flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600">
          <Zap className="h-3.5 w-3.5" />
          {progress.xp} XP
        </div>

        {/* Notifications placeholder */}
        <button className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
          <Bell className="h-4 w-4" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-50 transition-colors"
          >
            <UserAvatar name={displayName} avatarUrl={profile?.avatar_url ?? null} />
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-none mb-0.5">{displayName}</p>
              {isAdmin && (
                <span className="text-[9px] font-medium uppercase tracking-wider text-accent">Admin</span>
              )}
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-40 mt-1.5 w-64 rounded-lg border border-slate-200 bg-white py-1 card-shadow-md animate-scale-in">
                {/* User info */}
                <div className="px-3 py-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <UserAvatar name={displayName} avatarUrl={profile?.avatar_url ?? null} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
                      <p className="text-xs text-slate-500 truncate">{email}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-accent">
                      <Shield className="h-3 w-3" />
                      Admin access
                    </div>
                  )}
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    View Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    Settings
                  </Link>
                </div>

                <div className="border-t border-slate-100 py-1">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
