'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  BookOpen,
  AlertTriangle,
  Trophy,
} from 'lucide-react';
import { useEffect } from 'react';
import { TopBar } from '@/components/TopBar';
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
      <div className="min-h-screen bg-slate-50/50">
        <TopBar />
        <div className="p-6">
          <div className="rounded-2xl bg-white p-8 text-center card-shadow">
            <h1 className="text-xl font-semibold text-slate-900 mb-2">Lesson not found</h1>
            <Button onClick={() => router.push('/journey')}>Back to Journey</Button>
          </div>
        </div>
      </div>
    );
  }

  const handleComplete = () => {
    completeLesson(slug);
    router.push(`/quiz/${slug}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <TopBar />

      {/* Progress Header */}
      <div className="sticky top-14 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h1 className="font-semibold text-slate-900">{lesson.title}</h1>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{lesson.readingTime} min read</span>
                  {isCompleted && (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <span className="text-sm text-slate-500">{currentIndex + 1}/{totalLessons}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / totalLessons) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Title Card */}
        <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 card-shadow">
          <h2 className="text-2xl font-bold text-slate-900">{lesson.title}</h2>
        </div>

        <LessonCard title="Why should I care?" icon="lightbulb">
          <p>{lesson.whyShouldICare}</p>
        </LessonCard>

        <LessonCard title="Simple Definition" icon="book">
          <p>{lesson.simpleDefinition}</p>
        </LessonCard>

        <LessonCard title="Everyday Analogy" icon="zap">
          <p className="font-medium text-slate-700 mb-2">Think of it like: {lesson.everydayAnalogy.scenario}</p>
          <p>{lesson.everydayAnalogy.explanation}</p>
        </LessonCard>

        <LessonCard title="Real-world Example" icon="target">
          <p className="font-medium text-slate-700 mb-2">{lesson.realWorldExample.title}</p>
          <p className="mb-3">{lesson.realWorldExample.description}</p>
          <ul className="space-y-2">
            {lesson.realWorldExample.details.map((detail, index) => (
              <li key={index} className="flex items-start gap-2">
                <ChevronRight className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </LessonCard>

        <LessonCard title="Visual Diagram" icon="branch">
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <p className="font-medium text-slate-700 mb-2">{lesson.visualDiagram.title}</p>
            <p className="text-slate-500 text-sm mb-4">{lesson.visualDiagram.description}</p>
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-600">Input</div>
              <span className="text-slate-300 font-bold">→</span>
              <div className="px-3 py-1.5 rounded-lg bg-blue-100 border border-blue-200 text-sm text-blue-700">Process</div>
              <span className="text-slate-300 font-bold">→</span>
              <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-600">Output</div>
            </div>
          </div>
        </LessonCard>

        <LessonCard title="Common Misconceptions" icon="alert">
          <div className="space-y-4">
            {lesson.commonMisconceptions.map((item, index) => (
              <div key={index} className="rounded-lg bg-slate-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-full bg-red-100 p-1">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </div>
                  <p className="font-medium text-slate-700 text-sm">Misconception</p>
                </div>
                <p className="text-slate-600 mb-3 pl-8 text-sm">{item.misconception}</p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-full bg-green-100 p-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="font-medium text-slate-700 text-sm">Reality</p>
                </div>
                <p className="text-slate-600 pl-8 text-sm">{item.reality}</p>
              </div>
            ))}
          </div>
        </LessonCard>

        <LessonCard title="Challenge" icon="target">
          <p className="font-medium text-slate-700 mb-2">{lesson.challenge.title}</p>
          <p className="mb-3">{lesson.challenge.description}</p>
          <ul className="space-y-2">
            {lesson.challenge.tasks.map((task, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                  {index + 1}
                </div>
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </LessonCard>

        <LessonCard title="Related Concepts" icon="branch">
          <div className="flex flex-wrap gap-2">
            {lesson.relatedConcepts.map((concept, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {concept}
              </span>
            ))}
          </div>
        </LessonCard>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          {prevLesson ? (
            <Button variant="outline" onClick={() => router.push(`/lesson/${prevLesson.slug}`)} className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
          ) : (
            <div />
          )}

          {!isCompleted ? (
            <Button onClick={handleComplete} className="gap-2">
              Complete & Take Quiz
              <ChevronRight className="h-4 w-4" />
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
    </div>
  );
}
