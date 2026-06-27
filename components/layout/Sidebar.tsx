'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  User,
  Settings,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/journey', label: 'Learning Journey', icon: BookOpen, exact: false },
  { href: '/progress', label: 'Progress', icon: TrendingUp, exact: false },
  { href: '/profile', label: 'Profile', icon: User, exact: false },
];

const secondaryItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
];

function NavItem({
  href,
  label,
  icon: Icon,
  exact,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <Link href={href}>
      <div
        className={cn(
          'group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-100',
          isActive
            ? 'bg-navy-900/8 text-slate-900'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        )}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-r-full bg-accent" />
        )}
        <Icon
          className={cn(
            'h-4 w-4 flex-shrink-0 transition-colors',
            isActive ? 'text-accent' : 'text-slate-400 group-hover:text-slate-600'
          )}
        />
        <span>{label}</span>
        {isActive && (
          <ChevronRight className="ml-auto h-3 w-3 text-slate-300" />
        )}
      </div>
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-slate-100 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand">
          <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <span className="text-sm font-bold tracking-tight text-slate-900">TechPath</span>
          <p className="text-[10px] leading-none text-slate-400 font-medium tracking-wide uppercase">
            Learn · Build · Grow
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-6">
          <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Platform
          </p>
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </nav>
        </div>

        <div>
          <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Account
          </p>
          <nav className="space-y-0.5">
            {secondaryItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 p-4">
        <div className="rounded-lg bg-slate-50 px-3 py-2.5">
          <p className="text-[11px] font-semibold text-slate-700">TechPath v1.0</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Empowering engineers to grow</p>
        </div>
      </div>
    </aside>
  );
}
