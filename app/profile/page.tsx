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
  RotateCcw,
  Shield,
} from 'lucide-react';
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
import { useAuth } from '@/contexts/AuthContext';

const badgeInfo: Record<string, { name: string; description: string }> = {
  'first-lesson': { name: 'First Steps', description: 'Complete your first lesson' },
  'phase-1-complete': { name: 'Foundation Builder', description: 'Complete Phase 1' },
  'quiz-master': { name: 'Quiz Master', description: 'Get 5 perfect quiz scores' },
  'week-warrior': { name: 'Week Warrior', description: 'Maintain a 7-day streak' },
  century: { name: 'Century', description: 'Earn 100 XP' },
  scholar: { name: 'Scholar', description: 'Earn 500 XP' },
};

function UserAvatar({
  name,
  avatarUrl,
  size = 'lg',
}: {
  name: string | null;
  avatarUrl: string | null;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClass = { sm: 'h-10 w-10 text-sm', md: 'h-14 w-14 text-lg', lg: 'h-20 w-20 text-2xl' }[size];
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name ?? 'User'} className={`${sizeClass} rounded-2xl object-cover`} />;
  }
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';
  return (
    <div className={`flex flex-shrink-0 items-center justify-center rounded-2xl gradient-brand text-white font-bold ${sizeClass}`}>
      {initials}
    </div>
  );
}

export default function ProfilePage() {
  const { profile, user } = useAuth();
  const progress = getProgress();
  const overallProgress = getProgressPercentage();
  const level = calculateLevel(progress.xp);
  const levelTitle = getLevelTitle(level);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalQuizzes = Object.keys(progress.quizScores).length;
  const perfectQuizzes = Object.values(progress.quizScores).filter(
    (q) => q.score === q.total
  ).length;
  const totalAnswered = Object.values(progress.quizScores).reduce((acc, q) => acc + q.total, 0);
  const totalCorrect = Object.values(progress.quizScores).reduce((acc, q) => acc + q.score, 0);
  const averageScore = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const displayName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'Learner';
  const email = profile?.email ?? user?.email ?? '';

  const handleReset = () => {
    if (showResetConfirm) {
      resetProgress();
      window.location.reload();
    } else {
      setShowResetConfirm(true);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Profile</h1>
        <p className="text-slate-500 text-sm">Your learning identity and achievements</p>
      </div>

      {/* Profile Hero */}
      <div className="animate-fade-in rounded-xl bg-white p-6 card-shadow">
        <div className="flex items-center gap-5 pb-5 border-b border-slate-100">
          <UserAvatar name={displayName} avatarUrl={profile?.avatar_url ?? null} size="lg" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-slate-900">{displayName}</h2>
              {profile?.role === 'admin' && (
                <span className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent uppercase tracking-wide">
                  <Shield className="h-2.5 w-2.5" />
                  Admin
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">{email}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-amber-600 text-sm">
                <Zap className="h-4 w-4" />
                <span className="font-semibold">{progress.xp} XP</span>
              </div>
              <div className="flex items-center gap-1.5 text-orange-500 text-sm">
                <Flame className="h-4 w-4" />
                <span className="font-semibold">{progress.streak} day streak</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                <Award className="h-4 w-4" />
                <span className="font-semibold">Level {level} · {levelTitle}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
          {[
            { icon: CheckCircle, color: 'text-emerald-600', label: 'Lessons', value: `${progress.completedLessons.length}/${lessons.length}` },
            { icon: Target, color: 'text-blue-600', label: 'Accuracy', value: `${averageScore}%` },
            { icon: Trophy, color: 'text-amber-600', label: 'Badges', value: `${progress.badges.length}/${Object.keys(badgeInfo).length}` },
            { icon: TrendingUp, color: 'text-violet-600', label: 'Progress', value: `${overallProgress}%` },
          ].map((stat, i) => (
            <div key={i} className="rounded-lg bg-slate-50 px-4 py-3">
              <div className={`flex items-center gap-1.5 mb-1 ${stat.color}`}>
                <stat.icon className="h-3.5 w-3.5" />
                <span className="text-xs font-medium text-slate-600">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Achievements */}
        <div className="animate-fade-in lg:col-span-2 rounded-xl bg-white p-5 card-shadow">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" />
            Achievements
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(badgeInfo).map(([badgeId, badge]) => {
              const isEarned = progress.badges.includes(badgeId);
              return (
                <div
                  key={badgeId}
                  className={`flex items-center gap-3 rounded-lg p-3 ${
                    isEarned ? 'bg-amber-50 border border-amber-100' : 'bg-slate-50'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                      isEarned
                        ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isEarned ? <Star className="h-5 w-5" /> : <span className="text-xs font-bold">?</span>}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${isEarned ? 'text-slate-900' : 'text-slate-400'}`}>
                      {badge.name}
                    </p>
                    <p className={`text-[10px] mt-0.5 ${isEarned ? 'text-slate-500' : 'text-slate-400'}`}>
                      {badge.description}
                    </p>
                  </div>
                  {isEarned && <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 ml-auto" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity */}
        <div className="animate-fade-in rounded-xl bg-white p-5 card-shadow">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            Activity
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Started', value: new Date(progress.startedAt).toLocaleDateString() },
              { label: 'Last active', value: progress.lastActivityDate ? new Date(progress.lastActivityDate).toLocaleDateString() : 'Today' },
              { label: 'Quizzes taken', value: String(totalQuizzes) },
              { label: 'Perfect scores', value: String(perfectQuizzes) },
              { label: 'Total XP', value: String(progress.xp) },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-xs text-slate-500">{item.label}</span>
                <span className="text-xs font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}

            <div className="pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                className={`w-full gap-2 text-xs ${
                  showResetConfirm ? 'border-red-300 text-red-600 hover:bg-red-50' : ''
                }`}
                onClick={handleReset}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {showResetConfirm ? 'Confirm reset' : 'Reset progress'}
              </Button>
              {showResetConfirm && (
                <p className="text-[10px] text-red-500 text-center mt-1">
                  This cannot be undone
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Stats */}
      <div className="animate-fade-in rounded-xl bg-white p-5 card-shadow">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-400" />
          Learning Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { value: progress.completedLessons.length, label: 'Lessons Completed' },
            { value: progress.xp, label: 'XP Earned' },
            { value: totalQuizzes, label: 'Quizzes Taken' },
            { value: `${averageScore}%`, label: 'Avg Accuracy' },
            { value: progress.streak, label: 'Day Streak' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
