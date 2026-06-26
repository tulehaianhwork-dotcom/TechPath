'use client';

import Link from 'next/link';
import { CheckCircle, Lock, Circle, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { lessons } from '@/data/lessons';

interface JourneyNodeProps {
  lessonSlug: string;
  isCompleted: boolean;
  isLocked: boolean;
  isCurrent: boolean;
  showLine?: boolean;
  index: number;
}

export function JourneyNode({
  lessonSlug,
  isCompleted,
  isLocked,
  isCurrent,
  showLine = true,
  index,
}: JourneyNodeProps) {
  const lesson = lessons.find(l => l.slug === lessonSlug);
  if (!lesson) return null;

  const state = isCompleted ? 'completed' : isLocked ? 'locked' : isCurrent ? 'current' : 'available';

  const stateConfig = {
    completed: { bg: 'bg-green-500', border: 'border-green-500', ring: 'ring-green-200', icon: CheckCircle, iconClass: 'text-white' },
    current: { bg: 'bg-blue-500', border: 'border-blue-500', ring: 'ring-blue-200', icon: Play, iconClass: 'text-white' },
    locked: { bg: 'bg-slate-200', border: 'border-slate-300', ring: 'ring-slate-100', icon: Lock, iconClass: 'text-slate-400' },
    available: { bg: 'bg-white', border: 'border-slate-300', ring: 'ring-slate-100', icon: Circle, iconClass: 'text-slate-400' },
  };

  const config = stateConfig[state];
  const Icon = config.icon;

  const content = (
    <div
      className={cn('group relative flex items-center gap-4', isLocked && 'cursor-not-allowed')}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {showLine && (
        <div className="absolute left-6 top-14 h-full w-0.5 bg-slate-200">
          {isCompleted && <div className="w-full h-full bg-green-500 transition-all duration-500" />}
        </div>
      )}

      <div
        className={cn(
          'relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 transition-transform duration-150',
          config.bg,
          config.border,
          !isLocked && 'ring-4 ring-offset-2',
          config.ring,
          !isLocked && 'group-hover:scale-105 active:scale-95'
        )}
      >
        <Icon className={cn('h-5 w-5', config.iconClass)} />
        {isCurrent && (
          <span className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-75" />
        )}
      </div>

      <div
        className={cn(
          'flex-1 rounded-lg border bg-white p-3 card-shadow transition-shadow duration-200',
          !isLocked && 'group-hover:card-shadow-hover',
          isLocked && 'opacity-60'
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className={cn('font-medium text-sm', isCompleted && 'text-green-700', isLocked && 'text-slate-400')}>
              {lesson.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{lesson.readingTime} min read</p>
          </div>
          {isCompleted && (
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Complete</span>
          )}
          {isLocked && <span className="text-xs text-slate-400">Locked</span>}
        </div>
      </div>
    </div>
  );

  if (isLocked) return <div className="relative pb-6 animate-fade-in">{content}</div>;

  return (
    <Link href={`/lesson/${lessonSlug}`} className="block pb-6 animate-fade-in">
      {content}
    </Link>
  );
}
