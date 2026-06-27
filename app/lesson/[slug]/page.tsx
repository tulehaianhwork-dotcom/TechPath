'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { LessonCard } from '@/components/LessonCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getLessonBySlug, lessons, getNextLesson, getPreviousLesson } from '@/data/lessons';
import { getProgress, completeLesson } from '@/lib/progress';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const lesson = getLessonBySlug(slug);
  const progress = getProgress();
  const isCompleted = progress.completedLessons.includes(slug);
  const nextLesson = getNextLesson(slug);
  const prevLesson = getPreviousLesson(slug);
  const currentIndex = lessons.findIndex((l) => l.slug === slug);
  const totalLessons = lessons.length;

  if (!lesson) {
    return (
      <div className="rounded-xl bg-white p-8 text-center card-shadow">
        <h1 className="text-xl font-semibold text-slate-900 mb-4">Lesson not found</h1>
        <Button onClick={() => router.push('/journey')}>Back to Journey</Button>
      </div>
    );
  }

  const handleComplete = () => {
    completeLesson(slug);
    router.push(`/quiz/${slug}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {prevLesson && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/lesson/${prevLesson.slug}`)}
              className="gap-1.5 text-slate-500"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
          )}
          <div>
            <h1 className="text-xl font-bold text-slate-900">{lesson.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs text-slate-500">{lesson.readingTime} min read</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">
                {currentIndex + 1} of {totalLessons}
              </span>
              {isCompleted && (
                <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[10px]">
                  <CheckCircle className="h-2.5 w-2.5 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / totalLessons) * 100}%` }}
        />
      </div>

      {/* Lesson content */}
      <LessonCard title="Why should I care?" icon="lightbulb">
        <p>{lesson.whyShouldICare}</p>
      </LessonCard>

      <LessonCard title="Simple Definition" icon="book">
        <p>{lesson.simpleDefinition}</p>
      </LessonCard>

      <LessonCard title="Everyday Analogy" icon="zap">
        <p className="font-medium text-slate-700 mb-2">
          Think of it like: {lesson.everydayAnalogy.scenario}
        </p>
        <p>{lesson.everydayAnalogy.explanation}</p>
      </LessonCard>

      <LessonCard title="Real-world Example" icon="target">
        <p className="font-medium text-slate-700 mb-2">{lesson.realWorldExample.title}</p>
        <p className="mb-3">{lesson.realWorldExample.description}</p>
        <ul className="space-y-2">
          {lesson.realWorldExample.details.map((detail, index) => (
            <li key={index} className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </LessonCard>

      <LessonCard title="Common Misconceptions" icon="alert">
        <div className="space-y-4">
          {lesson.commonMisconceptions.map((item, index) => (
            <div key={index} className="rounded-lg bg-slate-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-full bg-red-100 p-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                </div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Misconception</p>
              </div>
              <p className="text-sm text-slate-600 mb-3 pl-7">{item.misconception}</p>
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-full bg-green-100 p-1">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                </div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Reality</p>
              </div>
              <p className="text-sm text-slate-600 pl-7">{item.reality}</p>
            </div>
          ))}
        </div>
      </LessonCard>

      <LessonCard title="Challenge" icon="target">
        <p className="font-medium text-slate-700 mb-2">{lesson.challenge.title}</p>
        <p className="mb-3">{lesson.challenge.description}</p>
        <ol className="space-y-2">
          {lesson.challenge.tasks.map((task, index) => (
            <li key={index} className="flex items-start gap-2.5">
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-[10px] font-bold text-accent">
                {index + 1}
              </div>
              <span>{task}</span>
            </li>
          ))}
        </ol>
      </LessonCard>

      <LessonCard title="Related Concepts" icon="branch">
        <div className="flex flex-wrap gap-2">
          {lesson.relatedConcepts.map((concept, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors cursor-default"
            >
              {concept}
            </span>
          ))}
        </div>
      </LessonCard>

      {/* Footer actions */}
      <div className="flex items-center justify-between pt-2 pb-6">
        {prevLesson ? (
          <Button variant="outline" onClick={() => router.push(`/lesson/${prevLesson.slug}`)} className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Previous Lesson
          </Button>
        ) : (
          <div />
        )}

        {!isCompleted ? (
          <Button onClick={handleComplete} className="gap-2">
            Complete &amp; Take Quiz
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : nextLesson ? (
          <Button onClick={() => router.push(`/lesson/${nextLesson.slug}`)} className="gap-2">
            Next Lesson
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => router.push('/progress')} className="gap-2">
            View Progress
            <Trophy className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
