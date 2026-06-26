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
import { TopBar } from '@/components/TopBar';
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
  'century': { name: 'Century', description: 'Earn 100 XP' },
  'scholar': { name: 'Scholar', description: 'Earn 500 XP' },
};

export default function ProgressPage() {
  const progress = getProgress();
  const overallProgress = getProgressPercentage();
  const level = calculateLevel(progress.xp);
  const levelTitle = getLevelTitle(level);

  const totalQuizzes = Object.keys(progress.quizScores).length;
  const perfectQuizzes = Object.values(progress.quizScores).filter((q) => q.score === q.total).length;
  const totalAnswered = Object.values(progress.quizScores).reduce((acc, q) => acc + q.total, 0);
  const totalCorrect = Object.values(progress.quizScores).reduce((acc, q) => acc + q.score, 0);
  const averageScore = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const nextLevelXP = level === 1 ? 100 : level === 2 ? 250 : level === 3 ? 500 : level === 4 ? 1000 : 2000;
  const xpToNextLevel = Math.max(0, nextLevelXP - progress.xp);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <TopBar />
      <div className="p-6 space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Your Progress</h1>
          <p className="text-slate-600">Track your learning journey</p>
        </div>

        {/* Level Card */}
        <div className="animate-fade-in rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white card-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                <Award className="h-8 w-8" />
              </div>
              <div>
                <p className="text-blue-100">Current Level</p>
                <h2 className="text-3xl font-bold">Level {level} — {levelTitle}</h2>
                <p className="text-blue-100 mt-1">{progress.xp} XP earned</p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-blue-100">Next Level</p>
              <p className="text-xl font-semibold">{xpToNextLevel} XP to go</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: CheckCircle, bg: 'bg-green-100', iconClass: 'text-green-600', label: 'Completed Lessons', value: progress.completedLessons.length, sub: `of ${lessons.length} total` },
            { icon: Flame, bg: 'bg-amber-100', iconClass: 'text-amber-600', label: 'Current Streak', value: progress.streak, sub: 'consecutive days' },
            { icon: Target, bg: 'bg-purple-100', iconClass: 'text-purple-600', label: 'Quiz Accuracy', value: `${averageScore}%`, sub: `${perfectQuizzes} perfect scores` },
            { icon: TrendingUp, bg: 'bg-teal-100', iconClass: 'text-teal-600', label: 'Overall Progress', value: `${overallProgress}%`, sub: 'learning complete' },
          ].map((stat, i) => (
            <div key={i} className="animate-fade-in rounded-xl bg-white p-5 card-shadow" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`rounded-lg p-2.5 ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconClass}`} />
                </div>
                <span className="text-sm font-medium text-slate-600">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Phase Progress */}
        <div className="animate-fade-in">
          <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Phase Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(badgeInfo).map(([badgeId, badge]) => {
              const isEarned = progress.badges.includes(badgeId);
              return (
                <div
                  key={badgeId}
                  className={`rounded-xl p-4 text-center transition-transform duration-150 ${isEarned ? 'bg-white card-shadow hover:scale-105' : 'bg-slate-100'}`}
                >
                  <div className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl ${isEarned ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    {isEarned ? <Star className="h-6 w-6" /> : <span className="text-xs font-bold">?</span>}
                  </div>
                  <p className={`text-sm font-medium ${isEarned ? 'text-slate-900' : 'text-slate-400'}`}>{badge.name}</p>
                  <p className={`text-xs mt-0.5 ${isEarned ? 'text-slate-500' : 'text-slate-400'}`}>{badge.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="animate-fade-in rounded-xl bg-white p-6 card-shadow">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-400" />
            Learning Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-slate-500">Started Learning</p>
              <p className="text-lg font-semibold text-slate-900">{new Date(progress.startedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total XP</p>
              <p className="text-lg font-semibold text-slate-900 flex items-center gap-1">
                <Zap className="h-4 w-4 text-amber-500" />{progress.xp}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Quizzes Completed</p>
              <p className="text-lg font-semibold text-slate-900">{totalQuizzes}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Lessons Completed</p>
              <p className="text-lg font-semibold text-slate-900">{progress.completedLessons.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
