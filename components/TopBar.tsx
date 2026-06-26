'use client';

import { Flame, Zap, Target } from 'lucide-react';
import { getProgress, getTodayGoal } from '@/lib/progress';

export function TopBar() {
  const progress = getProgress();
  const todayGoal = getTodayGoal();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5">
            <Flame className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-600">{progress.streak} day streak</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5">
            <Zap className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600">{progress.xp} XP</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-600">Today&apos;s goal:</span>
            <span className="font-medium text-slate-900">
              {todayGoal.completed}/{todayGoal.target} lessons
            </span>
          </div>

          {todayGoal.completed >= todayGoal.target && (
            <div className="animate-scale-in rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-600">
              Goal complete!
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
