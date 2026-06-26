'use client';

import { CheckCircle, Lock, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Phase } from '@/data/lessons';

interface PhaseCardProps {
  phase: Phase;
  progress: number;
  isCompleted: boolean;
  isLocked: boolean;
  isCurrent: boolean;
}

export function PhaseCard({ phase, progress, isCompleted, isLocked, isCurrent }: PhaseCardProps) {
  const status = isCompleted ? 'completed' : isLocked ? 'locked' : isCurrent ? 'current' : 'available';

  const statusConfig = {
    completed: { bg: 'bg-green-50 border-green-200', icon: CheckCircle, iconBg: 'bg-green-100', iconClass: 'text-green-500', titleClass: 'text-green-700', barColor: 'bg-green-500' },
    current: { bg: 'bg-blue-50 border-blue-200', icon: BookOpen, iconBg: 'bg-blue-100', iconClass: 'text-blue-500', titleClass: 'text-blue-700', barColor: 'bg-blue-500' },
    locked: { bg: 'bg-slate-50 border-slate-200', icon: Lock, iconBg: 'bg-slate-100', iconClass: 'text-slate-400', titleClass: 'text-slate-500', barColor: 'bg-slate-300' },
    available: { bg: 'bg-white border-slate-200', icon: BookOpen, iconBg: 'bg-slate-100', iconClass: 'text-slate-400', titleClass: 'text-slate-700', barColor: 'bg-slate-400' },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'animate-fade-in rounded-xl border-2 p-5 transition-shadow duration-200',
        config.bg,
        !isLocked && 'hover:shadow-md'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn('rounded-lg p-2', config.iconBg)}>
            <Icon className={cn('h-5 w-5', config.iconClass)} />
          </div>
          <div>
            <h3 className={cn('font-semibold', config.titleClass)}>{phase.title}</h3>
            <p className="mt-0.5 text-sm text-slate-500">{phase.description}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={cn('text-2xl font-bold', isCompleted ? 'text-green-600' : 'text-slate-400')}>
            {progress}%
          </span>
          <p className="text-xs text-slate-500">{phase.lessons.length} lessons</p>
        </div>
      </div>

      {!isLocked && !isCompleted && (
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/50">
            <div
              className={cn('h-full rounded-full transition-all duration-500', config.barColor)}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {isLocked && (
        <p className="mt-4 text-center text-sm text-slate-400">Complete previous phases to unlock</p>
      )}
    </div>
  );
}
