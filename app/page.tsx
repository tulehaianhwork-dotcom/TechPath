'use client';

import Link from 'next/link';
import {
  BookOpen,
  Trophy,
  Flame,
  Target,
  ArrowRight,
  Clock,
  Award,
  TrendingUp,
} from 'lucide-react';
import { PhaseCard } from '@/components/PhaseCard';
import { XPBadge } from '@/components/XPBadge';
import {
  getProgress,
  getProgressPercentage,
  getPhaseProgress,
  getNextLesson,
  calculateLevel,
  getLevelTitle,
} from '@/lib/progress';
import { phases, lessons } from '@/data/lessons';

export default function Dashboard() {
  const progress = getProgress();
  const overallProgress = getProgressPercentage();
  const nextLesson = getNextLesson();
  const level = calculateLevel(progress.xp);
  const levelTitle = getLevelTitle(level);

  const currentPhaseData = phases.find((p) => p.id === progress.currentPhase);

  return (
    <div className="space-y-6">
        {/* Welcome Section */}
        <div className="animate-fade-in rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
              <p className="text-blue-100 mb-4">You are making great progress. Keep learning!</p>

              {nextLesson && (
                <Link href={`/lesson/${nextLesson}`}>
                  <button className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-blue-600 font-medium shadow-sm transition-transform duration-150 hover:scale-105 active:scale-95">
                    Continue Learning
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              )}
            </div>

            <div className="hidden md:block text-right">
              <div className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 mb-3">
                <Award className="h-5 w-5" />
                <span className="font-medium">Level {level}</span>
                <span className="text-blue-100">- {levelTitle}</span>
              </div>
              <div><XPBadge amount={progress.xp} size="lg" /></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, bg: 'bg-green-100', iconClass: 'text-green-600', label: 'Completed Lessons', value: `${progress.completedLessons.length}/${lessons.length}` },
            { icon: Flame, bg: 'bg-amber-100', iconClass: 'text-amber-600', label: 'Current Streak', value: `${progress.streak} days` },
            { icon: Trophy, bg: 'bg-blue-100', iconClass: 'text-blue-600', label: 'Badges Earned', value: String(progress.badges.length) },
            { icon: TrendingUp, bg: 'bg-purple-100', iconClass: 'text-purple-600', label: 'Overall Progress', value: `${overallProgress}%` },
          ].map((stat, i) => (
            <div key={i} className="animate-fade-in rounded-xl bg-white p-4 card-shadow" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2.5 ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconClass}`} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current Phase */}
        {currentPhaseData && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Current Phase
            </h2>
            <PhaseCard
              phase={currentPhaseData}
              progress={getPhaseProgress(progress.currentPhase)}
              isCompleted={getPhaseProgress(progress.currentPhase) === 100}
              isLocked={false}
              isCurrent={true}
            />
          </div>
        )}

        {/* All Phases */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-400" />
            Learning Journey
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {phases.map((phase, index) => {
              const phaseProgress = getPhaseProgress(phase.id);
              const isCompleted = phaseProgress === 100;
              const isCurrent = phase.id === progress.currentPhase;
              const isLocked = phase.isLocked || index > phases.findIndex((p) => p.id === progress.currentPhase) + 1;

              return (
                <div key={phase.id} style={{ animationDelay: `${index * 50}ms` }}>
                  <PhaseCard
                    phase={phase}
                    progress={phaseProgress}
                    isCompleted={isCompleted}
                    isLocked={isLocked}
                    isCurrent={isCurrent}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
  );
}
