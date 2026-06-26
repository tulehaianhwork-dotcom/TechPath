'use client';

import { Lightbulb, BookOpen, GitBranch, Zap, Target, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonSectionProps {
  title: string;
  icon: 'lightbulb' | 'book' | 'branch' | 'help' | 'zap' | 'target' | 'alert';
  children: React.ReactNode;
  className?: string;
}

export function LessonCard({ title, icon, children, className }: LessonSectionProps) {
  const icons = {
    lightbulb: { component: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-50' },
    book: { component: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
    branch: { component: GitBranch, color: 'text-purple-500', bg: 'bg-purple-50' },
    help: { component: GitBranch, color: 'text-teal-500', bg: 'bg-teal-50' },
    zap: { component: Zap, color: 'text-orange-500', bg: 'bg-orange-50' },
    target: { component: Target, color: 'text-green-500', bg: 'bg-green-50' },
    alert: { component: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
  };

  const config = icons[icon];
  const Icon = config.component;

  return (
    <div className={cn('animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 card-shadow', className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className={cn('rounded-xl p-2.5', config.bg)}>
          <Icon className={cn('h-5 w-5', config.color)} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="text-slate-600 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
