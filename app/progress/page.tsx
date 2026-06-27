'use client';

import {
  Trophy,
  Award,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  Star,
  Flame,
  BookOpen,
  Zap,
} from 'lucide-react';
import { ProgressCard } from '@/components/ProgressCard';
import {
  getProgress,
  getProgressPercentage,
  getPhaseProgress,
  calculateLevel,
  getLevelTitle,
} from '@/lib/progress';
import { phases, lessons } from '@/data/lessons';

const badgeInfo: Record<string, { name: string; description: string }> = {
  'first-lesson': { name: 'First Steps', description: 'Complete your first lesson' },
  'phase-1-complete': { name: 'Foundation Builder', description: 'Complete Phase 1' },
  'quiz-master': { name: 'Quiz Master', description: 'Get 5 perfect quiz scores' },
  'week-warrior': { name: 'Week Warrior', description: 'Maintain a 7-day streak' },
  century: { name: 'Century', description: 'Earn 100 XP' },
  scholar: { name: 'Scholar', description: 'Earn 500 XP' },
};

export default function ProgressPage() {
  const progress = getProgress();
  const overallProgress = getProgressPercentage();
  const level = calculateLevel(progress.xp);
  const levelTitle = getLevelTitle(level);

  const totalQuizzes = Object.keys(progress.quizScores).length;
  const perfectQuizzes = Object.values(progress.quizScores).filter(
    (q) => q.score === q.total
  ).length;
  const totalAnswered = Object.values(progress.quizScores).reduce((acc, q) => acc + q.total, 0);
  const totalCorrect = Object.values(progress.quizScores).reduce((acc, q) => acc + q.score, 0);
  const averageScore = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const nextLevelXP =
    level === 1 ? 100 : level === 2 ? 250 : level === 3 ? 500 : level === 4 ? 1000 : 2000;
  const xpToNextLevel = Math.max(0, nextLevelXP - progress.xp);

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Progress</h1>
        <p className="text-slate-500 text-sm">Track your learning journey and milestones</p>
      </div>

      {/* Level Banner */}
      <div className="animate-fade-in rounded-xl gradient-brand p-6 text-white card-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15">
              <Award className="h-7 w-7" />
            </div>
            <div>
              <p className="text-blue-200 text-sm">Current Level</p>
              <h2 className="text-2xl font-bold">
                Level {level} — {levelTitle}
              </h2>
              <p className="text-blue-200 text-sm mt-0.5">{progress.xp} XP earned</p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-blue-200 text-sm">Next Level</p>
            <p className="text-xl font-semibold">{xpToNextLevel} XP to go</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: CheckCircle,
            bg: 'bg-emerald-50',
            iconClass: 'text-emerald-600',
            label: 'Lessons Done',
            value: progress.completedLessons.length,
            sub: `of ${lessons.length}`,
          },
          {
            icon: Flame,
            bg: 'bg-amber-50',
            iconClass: 'text-amber-600',
            label: 'Streak',
            value: progress.streak,
            sub: 'days',
          },
          {
            icon: Target,
            bg: 'bg-blue-50',
            iconClass: 'text-blue-600',
            label: 'Quiz Accuracy',
            value: `${averageScore}%`,
            sub: `${perfectQuizzes} perfect`,
          },
          {
            icon: TrendingUp,
            bg: 'bg-violet-50',
            iconClass: 'text-violet-600',
            label: 'Overall',
            value: `${overallProgress}%`,
            sub: 'complete',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="animate-fade-in rounded-xl bg-white p-5 card-shadow"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`inline-flex rounded-lg p-2.5 ${stat.bg} mb-3`}>
              <stat.icon className={`h-5 w-5 ${stat.iconClass}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {stat.label} {stat.sub && <span className="text-slate-400">· {stat.sub}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Phase Progress */}
      <div className="animate-fade-in">
        <h2 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-slate-400" />
          Phase Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {phases.map((phase) => (
            <ProgressCard
              key={phase.id}
              title={phase.title}
              current={phase.lessons.filter((s) => progress.completedLessons.includes(s)).length}
              total={phase.lessons.length}
              variant={getPhaseProgress(phase.id) === 100 ? 'success' : 'default'}
            />
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="animate-fade-in">
        <h2 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(badgeInfo).map(([badgeId, badge]) => {
            const isEarned = progress.badges.includes(badgeId);
            return (
              <div
                key={badgeId}
                className={`rounded-xl p-4 text-center transition-all duration-150 ${
                  isEarned ? 'bg-white card-shadow hover:scale-105' : 'bg-slate-50'
                }`}
              >
                <div
                  className={`mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl ${
                    isEarned
                      ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isEarned ? <Star className="h-5 w-5" /> : <span className="text-xs font-bold">?</span>}
                </div>
                <p className={`text-xs font-semibold ${isEarned ? 'text-slate-900' : 'text-slate-400'}`}>
                  {badge.name}
                </p>
                <p className={`text-[10px] mt-0.5 ${isEarned ? 'text-slate-500' : 'text-slate-400'}`}>
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistics */}
      <div className="animate-fade-in rounded-xl bg-white p-5 card-shadow">
        <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-400" />
          Learning Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-slate-500 mb-1">Started</p>
            <p className="text-sm font-semibold text-slate-900">
              {new Date(progress.startedAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Total XP</p>
            <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              {progress.xp}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Quizzes</p>
            <p className="text-sm font-semibold text-slate-900">{totalQuizzes}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Lessons</p>
            <p className="text-sm font-semibold text-slate-900">{progress.completedLessons.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
