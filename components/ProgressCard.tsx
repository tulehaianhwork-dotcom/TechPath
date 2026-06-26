'use client';

import { cn } from '@/lib/utils';

interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning';
}

export function ProgressCard({
  title,
  current,
  total,
  showPercentage = true,
  variant = 'default',
}: ProgressCardProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  const variants = {
    default: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
  };

  return (
    <div className="animate-fade-in rounded-xl bg-white p-4 card-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700">{title}</span>
        {showPercentage && (
          <span className="text-sm font-semibold text-slate-900">{percentage}%</span>
        )}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn('h-full rounded-full transition-all duration-500', variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
        <span>{current} of {total}</span>
      </div>
    </div>
  );
}
