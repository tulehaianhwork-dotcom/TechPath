'use client';

import { lessons, phases } from '@/data/lessons';

export interface UserProgress {
  completedLessons: string[];
  quizScores: Record<string, { score: number; total: number; xp: number }>;
  currentPhase: string;
  xp: number;
  streak: number;
  lastActivityDate: string | null;
  badges: string[];
  startedAt: string;
}

const STORAGE_KEY = 'tech-literacy-progress';

const defaultProgress: UserProgress = {
  completedLessons: [],
  quizScores: {},
  currentPhase: 'phase-1',
  xp: 0,
  streak: 0,
  lastActivityDate: null,
  badges: [],
  startedAt: new Date().toISOString(),
};

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProgress));
    return defaultProgress;
  }

  return JSON.parse(stored);
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function completeLesson(lessonId: string): UserProgress {
  let progress = getProgress();

  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    progress.xp += 25; // 25 XP for completing a lesson
    progress = updateStreak(progress);
    progress = checkBadges(progress);
    progress = checkPhaseCompletion(progress);
  }

  saveProgress(progress);
  return progress;
}

export function saveQuizResult(lessonId: string, score: number, total: number, xp: number): UserProgress {
  let progress = getProgress();

  // Only save if better than previous or first attempt
  const previous = progress.quizScores[lessonId];
  if (!previous || xp > previous.xp) {
    progress.quizScores[lessonId] = { score, total, xp };
    progress.xp += xp;
    progress = updateStreak(progress);
    progress = checkBadges(progress);
  }

  saveProgress(progress);
  return progress;
}

function updateStreak(progress: UserProgress): UserProgress {
  const today = new Date().toISOString().split('T')[0];
  const lastActivity = progress.lastActivityDate;

  if (!lastActivity) {
    progress.streak = 1;
  } else {
    const lastDate = new Date(lastActivity);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Same day, streak unchanged
    } else if (diffDays === 1) {
      // Consecutive day
      progress.streak += 1;
    } else {
      // Missed days, reset streak
      progress.streak = 1;
    }
  }

  progress.lastActivityDate = today;
  return progress;
}

function checkPhaseCompletion(progress: UserProgress): UserProgress {
  const currentPhase = phases.find(p => p.id === progress.currentPhase);

  if (!currentPhase) return progress;

  const allLessonsComplete = currentPhase.lessons.every(
    lessonSlug => progress.completedLessons.includes(lessonSlug)
  );

  const allQuizzesPassed = currentPhase.lessons.every(
    lessonSlug => progress.quizScores[lessonSlug] && progress.quizScores[lessonSlug].score >= 3
  );

  if (allLessonsComplete && allQuizzesPassed) {
    const nextPhaseIndex = phases.findIndex(p => p.id === progress.currentPhase) + 1;
    if (nextPhaseIndex < phases.length) {
      progress.currentPhase = phases[nextPhaseIndex].id;
    }
  }

  return progress;
}

function checkBadges(progress: UserProgress): UserProgress {
  const newBadges: string[] = [];

  // First Lesson
  if (progress.completedLessons.length >= 1 && !progress.badges.includes('first-lesson')) {
    newBadges.push('first-lesson');
  }

  // Phase Complete
  if (progress.completedLessons.length >= 7 && !progress.badges.includes('phase-1-complete')) {
    newBadges.push('phase-1-complete');
  }

  // Quiz Master - 5 perfect quizzes
  const perfectQuizzes = Object.values(progress.quizScores).filter(q => q.score === q.total).length;
  if (perfectQuizzes >= 5 && !progress.badges.includes('quiz-master')) {
    newBadges.push('quiz-master');
  }

  // Week Warrior - 7 day streak
  if (progress.streak >= 7 && !progress.badges.includes('week-warrior')) {
    newBadges.push('week-warrior');
  }

  // Century - 100 XP
  if (progress.xp >= 100 && !progress.badges.includes('century')) {
    newBadges.push('century');
  }

  // Scholar - 500 XP
  if (progress.xp >= 500 && !progress.badges.includes('scholar')) {
    newBadges.push('scholar');
  }

  progress.badges = [...progress.badges, ...newBadges];
  return progress;
}

export function getProgressPercentage(): number {
  const progress = getProgress();
  const totalLessons = lessons.length;
  const completed = progress.completedLessons.length;
  return Math.round((completed / totalLessons) * 100);
}

export function getPhaseProgress(phaseId: string): number {
  const phase = phases.find(p => p.id === phaseId);
  if (!phase) return 0;

  const progress = getProgress();
  const completedInPhase = phase.lessons.filter(
    slug => progress.completedLessons.includes(slug)
  ).length;

  return Math.round((completedInPhase / phase.lessons.length) * 100);
}

export function isLessonLocked(lessonSlug: string): boolean {
  const progress = getProgress();
  const lessonIndex = lessons.findIndex(l => l.slug === lessonSlug);

  if (lessonIndex === 0) return false;

  const previousLesson = lessons[lessonIndex - 1];
  return !progress.completedLessons.includes(previousLesson.slug) &&
         !progress.quizScores[previousLesson.slug];
}

export function getNextLesson(): string | null {
  const progress = getProgress();

  for (const lesson of lessons) {
    if (!progress.completedLessons.includes(lesson.slug)) {
      return lesson.slug;
    }
  }

  return null;
}

export function getTodayGoal(): { completed: number; target: number } {
  const progress = getProgress();
  const today = new Date().toISOString().split('T')[0];

  // Count lessons completed today
  const completedToday = Object.keys(progress.quizScores).filter(lessonSlug => {
    // Simplified - if quiz completed, count as activity today if lastActivityDate is today
    return progress.lastActivityDate === today && progress.completedLessons.includes(lessonSlug);
  }).length;

  // Target: 1 lesson per day
  return {
    completed: progress.lastActivityDate === today ? 1 : 0,
    target: 1,
  };
}

export function calculateLevel(xp: number): number {
  if (xp < 100) return 1;
  if (xp < 250) return 2;
  if (xp < 500) return 3;
  if (xp < 1000) return 4;
  if (xp < 2000) return 5;
  return Math.floor(xp / 500) + 1;
}

export function getLevelTitle(level: number): string {
  const titles: Record<number, string> = {
    1: 'Beginner',
    2: 'Explorer',
    3: 'Learner',
    4: 'Achiever',
    5: 'Scholar',
    6: 'Expert',
    7: 'Master',
    8: 'Guru',
    9: 'Champion',
    10: 'Legend',
  };
  return titles[level] || 'Legend';
}
