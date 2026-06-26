'use client';

import { useState } from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';
import { TopBar } from '@/components/TopBar';
import { JourneyNode } from '@/components/JourneyNode';
import { getProgress, getPhaseProgress } from '@/lib/progress';
import { phases, lessons } from '@/data/lessons';
import { cn } from '@/lib/utils';

export default function JourneyPage() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>('phase-1');
  const progress = getProgress();

  return (
    <div className="min-h-screen bg-slate-50/50">
      <TopBar />

      <div className="p-6">
        <div className="animate-fade-in mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Learning Journey</h1>
          <p className="text-slate-600">Your path to technology literacy</p>
        </div>

        <div className="space-y-4">
          {phases.map((phase, phaseIndex) => {
            const phaseProgress = getPhaseProgress(phase.id);
            const isExpanded = expandedPhase === phase.id;
            const isCompleted = phaseProgress === 100;
            const currentPhaseIndex = phases.findIndex((p) => p.id === progress.currentPhase);
            const isLocked = phase.isLocked || phaseIndex > currentPhaseIndex + 1;

            return (
              <div
                key={phase.id}
                className="animate-fade-in rounded-2xl border border-slate-200 bg-white overflow-hidden card-shadow"
                style={{ animationDelay: `${phaseIndex * 80}ms` }}
              >
                {/* Phase Header */}
                <button
                  onClick={() => !isLocked && setExpandedPhase(isExpanded ? null : phase.id)}
                  disabled={isLocked}
                  className={cn(
                    'w-full p-5 flex items-center justify-between text-left',
                    isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-slate-50 transition-colors'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl font-bold text-lg',
                        isCompleted ? 'bg-green-500 text-white' : isLocked ? 'bg-slate-200 text-slate-400' : 'bg-blue-500 text-white'
                      )}
                    >
                      {isCompleted ? <BookOpen className="h-6 w-6" /> : phase.order}
                    </div>
                    <div>
                      <h3 className={cn('font-semibold', isCompleted ? 'text-green-700' : isLocked ? 'text-slate-400' : 'text-slate-900')}>
                        {phase.title}
                      </h3>
                      <p className="text-sm text-slate-500">{phase.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className={cn('text-lg font-bold', isCompleted ? 'text-green-600' : 'text-slate-400')}>
                        {phaseProgress}%
                      </p>
                      <p className="text-xs text-slate-500">{phase.lessons.length} lessons</p>
                    </div>
                    {!isLocked && (
                      <ChevronDown
                        className={cn('h-5 w-5 text-slate-400 transition-transform duration-200', isExpanded && 'rotate-0', !isExpanded && '-rotate-90')}
                      />
                    )}
                  </div>
                </button>

                {/* Phase Content */}
                {isExpanded && !isLocked && (
                  <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-4 animate-fade-in">
                    <div className="max-w-md mx-auto">
                      {phase.lessons.map((lessonSlug, lessonIndex) => {
                        const lesson = lessons.find((l) => l.slug === lessonSlug);
                        if (!lesson) return null;

                        const isLessonCompleted = progress.completedLessons.includes(lessonSlug);
                        const prevLessonSlug = lessonIndex > 0 ? phase.lessons[lessonIndex - 1] : null;
                        const isPrevCompleted = prevLessonSlug
                          ? progress.completedLessons.includes(prevLessonSlug) || !!progress.quizScores[prevLessonSlug]
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

                {isLocked && (
                  <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-4 text-center">
                    <p className="text-sm text-slate-400">Complete previous phases to unlock</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
