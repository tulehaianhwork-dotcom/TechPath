'use client';

import {
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Flame,
  Star,
  Target,
  Trophy,
  TrendingUp,
  Zap,
  BookOpen,
  RotateCcw,
} from 'lucide-react';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/ui/button';
import {
  getProgress,
  getProgressPercentage,
  calculateLevel,
  getLevelTitle,
  resetProgress,
} from '@/lib/progress';
import { lessons } from '@/data/lessons';
import { useState } from 'react';

const badgeInfo: Record<string, { name: string; description: string }> = {
  'first-lesson': { name: 'First Steps', description: 'Complete your first lesson' },
  'phase-1-complete': { name: 'Foundation Builder', description: 'Complete Phase 1' },
  'quiz-master': { name: 'Quiz Master', description: 'Get 5 perfect quiz scores' },
  'week-warrior': { name: 'Week Warrior', description: 'Maintain a 7-day streak' },
  'century': { name: 'Century', description: 'Earn 100 XP' },
  'scholar': { name: 'Scholar', description: 'Earn 500 XP' },
};

export default function ProfilePage() {
  const progress = getProgress();
  const overallProgress = getProgressPercentage();
  const level = calculateLevel(progress.xp);
  const levelTitle = getLevelTitle(level);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalQuizzes = Object.keys(progress.quizScores).length;
  const perfectQuizzes = Object.values(progress.quizScores).filter((q) => q.score === q.total).length;
  const totalAnswered = Object.values(progress.quizScores).reduce((acc, q) => acc + q.total, 0);
  const totalCorrect = Object.values(progress.quizScores).reduce((acc, q) => acc + q.score, 0);
  const averageScore = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const handleReset = () => {
    if (showResetConfirm) {
      resetProgress();
      window.location.reload();
    } else {
      setShowResetConfirm(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <TopBar />
      <div className="p-6 space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile</h1>
          <p className="text-slate-600">Your learning identity and achievements</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <div className="animate-fade-in lg:col-span-2 rounded-2xl bg-white p-6 card-shadow">
            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-100">
              <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="text-center">
                  <span className="text-3xl font-bold">{level}</span>
                  <p className="text-xs text-blue-100">Level</p>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{levelTitle}</h2>
                <p className="text-slate-500 mb-2">Tech Literacy Learner</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-amber-600">
                    <Zap className="h-4 w-4" />
                    <span className="font-semibold">{progress.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <Flame className="h-4 w-4" />
                    <span className="font-semibold">{progress.streak} day streak</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: CheckCircle, iconClass: 'text-green-600', label: 'Lessons', value: `${progress.completedLessons.length}/${lessons.length}` },
                { icon: Target, iconClass: 'text-purple-600', label: 'Accuracy', value: `${averageScore}%` },
                { icon: Trophy, iconClass: 'text-blue-600', label: 'Badges', value: `${progress.badges.length}/${Object.keys(badgeInfo).length}` },
                { icon: TrendingUp, iconClass: 'text-teal-600', label: 'Progress', value: `${overallProgress}%` },
              ].map((stat, i) => (
                <div key={i} className="rounded-lg bg-slate-50 p-4">
                  <div className={`flex items-center gap-2 mb-1 ${stat.iconClass}`}>
                    <stat.icon className="h-4 w-4" />
                    <span className="text-sm font-medium text-slate-600">{stat.label}</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Card */}
          <div className="animate-fade-in rounded-2xl bg-white p-6 card-shadow">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-slate-400" />
              Activity
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Started', value: new Date(progress.startedAt).toLocaleDateString() },
                { label: 'Last Active', value: progress.lastActivityDate ? new Date(progress.lastActivityDate).toLocaleDateString() : 'Today' },
                { label: 'Quizzes Taken', value: String(totalQuizzes) },
                { label: 'Perfect Scores', value: String(perfectQuizzes) },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <span className="text-sm font-medium text-slate-900">{item.value}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  className={`w-full gap-2 ${showResetConfirm ? 'border-red-300 text-red-600 hover:bg-red-50' : ''}`}
                  onClick={handleReset}
                >
                  <RotateCcw className="h-4 w-4" />
                  {showResetConfirm ? 'Click again to confirm' : 'Reset Progress'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="animate-fade-in rounded-2xl bg-white p-6 card-shadow">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(badgeInfo).map(([badgeId, badge]) => {
              const isEarned = progress.badges.includes(badgeId);
              return (
                <div
                  key={badgeId}
                  className={`rounded-xl p-4 flex items-center gap-4 ${isEarned ? 'bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200' : 'bg-slate-50'}`}
                >
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${isEarned ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    {isEarned ? <Star className="h-6 w-6" /> : <span className="text-xs font-bold">?</span>}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isEarned ? 'text-slate-900' : 'text-slate-400'}`}>{badge.name}</p>
                    <p className={`text-sm ${isEarned ? 'text-slate-600' : 'text-slate-400'}`}>{badge.description}</p>
                  </div>
                  {isEarned && <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Learning Stats */}
        <div className="animate-fade-in rounded-2xl bg-white p-6 card-shadow">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-400" />
            Learning Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { value: progress.completedLessons.length, label: 'Lessons Completed' },
              { value: progress.xp, label: 'XP Earned' },
              { value: totalQuizzes, label: 'Quizzes Completed' },
              { value: `${averageScore}%`, label: 'Average Accuracy' },
              { value: progress.streak, label: 'Day Streak' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
