'use client';

import { useState } from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';
import { JourneyNode } from '@/components/JourneyNode';
import { getProgress, getPhaseProgress } from '@/lib/progress';
import { phases, lessons } from '@/data/lessons';
import { cn } from '@/lib/utils';

export default function JourneyPage() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>('phase-1');
  const progress = getProgress();

  return (
    <div className="space-y-4">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Learning Journey</h1>
        <p className="text-slate-500 text-sm">Your structured path to technology mastery</p>
      </div>

      {phases.map((phase, phaseIndex) => {
        const phaseProgress = getPhaseProgress(phase.id);
        const isExpanded = expandedPhase === phase.id;
        const isCompleted = phaseProgress === 100;
        const currentPhaseIndex = phases.findIndex((p) => p.id === progress.currentPhase);
        const isLocked = phase.isLocked || phaseIndex > currentPhaseIndex + 1;

        return (
          <div
            key={phase.id}
            className="animate-fade-in rounded-xl border border-slate-200 bg-white overflow-hidden card-shadow"
            style={{ animationDelay: `${phaseIndex * 80}ms` }}
          >
            <button
              onClick={() => !isLocked && setExpandedPhase(isExpanded ? null : phase.id)}
              disabled={isLocked}
              className={cn(
                'w-full p-5 flex items-center justify-between text-left',
                isLocked
                  ? 'cursor-not-allowed opacity-60'
                  : 'cursor-pointer hover:bg-slate-50/80 transition-colors'
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-xl font-bold text-base',
                    isCompleted
                      ? 'gradient-success text-white'
                      : isLocked
                      ? 'bg-slate-100 text-slate-400'
                      : 'gradient-accent text-white'
                  )}
                >
                  {isCompleted ? <BookOpen className="h-5 w-5" /> : phase.order}
                </div>
                <div>
                  <h3
                    className={cn(
                      'font-semibold text-sm',
                      isCompleted
                        ? 'text-green-700'
                        : isLocked
                        ? 'text-slate-400'
                        : 'text-slate-900'
                    )}
                  >
                    {phase.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{phase.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p
                    className={cn(
                      'text-lg font-bold',
                      isCompleted ? 'text-green-600' : 'text-slate-400'
                    )}
                  >
                    {phaseProgress}%
                  </p>
                  <p className="text-xs text-slate-400">{phase.lessons.length} lessons</p>
                </div>
                {!isLocked && (
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-slate-400 transition-transform duration-200',
                      isExpanded ? 'rotate-180' : ''
                    )}
                  />
                )}
              </div>
            </button>

            {isExpanded && !isLocked && (
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-5 animate-fade-in">
                <div className="max-w-md mx-auto">
                  {phase.lessons.map((lessonSlug, lessonIndex) => {
                    const lesson = lessons.find((l) => l.slug === lessonSlug);
                    if (!lesson) return null;

                    const isLessonCompleted = progress.completedLessons.includes(lessonSlug);
                    const prevLessonSlug = lessonIndex > 0 ? phase.lessons[lessonIndex - 1] : null;
                    const isPrevCompleted = prevLessonSlug
                      ? progress.completedLessons.includes(prevLessonSlug) ||
                        !!progress.quizScores[prevLessonSlug]
                      : true;
                    const isLessonLocked = !isPrevCompleted && !isLessonCompleted;
                    const isCurrent = !isLessonCompleted && !isLessonLocked;

                    return (
                      <JourneyNode
                        key={lessonSlug}
                        lessonSlug={lessonSlug}
                        isCompleted={isLessonCompleted}
                        isLocked={isLessonLocked}
                        isCurrent={isCurrent}
                        showLine={lessonIndex < phase.lessons.length - 1}
                        index={lessonIndex}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
