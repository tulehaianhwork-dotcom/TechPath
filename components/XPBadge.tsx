'use client';

import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface XPBadgeProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
}

export function XPBadge({ amount, size = 'md', showAnimation = false }: XPBadgeProps) {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-amber-50 font-medium text-amber-600',
        sizes[size],
        showAnimation && 'animate-scale-in'
      )}
    >
      <Zap className={cn(iconSizes[size])} />
      <span>+{amount} XP</span>
    </div>
  );
}
