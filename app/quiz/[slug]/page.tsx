'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Trophy } from 'lucide-react';
import { TopBar } from '@/components/TopBar';
import { QuizCard, QuizResults } from '@/components/QuizCard';
import { Button } from '@/components/ui/button';
import { getLessonBySlug, getNextLesson } from '@/data/lessons';
import { getQuizByLessonId, calculateXP } from '@/data/quizzes';
import { saveQuizResult } from '@/lib/progress';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const lesson = getLessonBySlug(slug);
  const quiz = getQuizByLessonId(slug);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  const handleAnswer = useCallback((answerIndex: number) => {
    if (!quiz) return;
    const newAnswers = [...selectedAnswers];
    if (newAnswers[currentQuestion] !== undefined) return;

    const isCorrect = answerIndex === quiz.questions[currentQuestion].correctAnswer;
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    if (isCorrect) setCurrentScore((prev) => prev + 1);
    setShowResult(true);
  }, [currentQuestion, selectedAnswers, quiz]);

  const handleNextQuestion = useCallback(() => {
    if (!quiz) return;
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  }, [currentQuestion, quiz]);

  const handleRetry = useCallback(() => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResult(false);
    setQuizComplete(false);
    setCurrentScore(0);
  }, []);

  const handleContinue = useCallback(() => {
    if (quiz) {
      const xp = calculateXP(currentScore, quiz.questions.length);
      saveQuizResult(slug, currentScore, quiz.questions.length, xp);
    }
    const nextLesson = getNextLesson(slug);
    if (nextLesson) {
      router.push(`/lesson/${nextLesson.slug}`);
    } else {
      router.push('/progress');
    }
  }, [slug, currentScore, quiz, router]);

  if (!lesson || !quiz) {
    return (
      <div className="min-h-screen bg-slate-50/50">
        <TopBar />
        <div className="p-6">
          <div className="max-w-2xl mx-auto rounded-2xl bg-white p-8 text-center card-shadow">
            <h1 className="text-xl font-semibold text-slate-900 mb-2">Quiz not found</h1>
            <Button onClick={() => router.push('/journey')}>Back to Journey</Button>
          </div>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const xp = calculateXP(currentScore, quiz.questions.length);
    return (
      <div className="min-h-screen bg-slate-50/50">
        <TopBar />
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <Button variant="ghost" onClick={() => router.push(`/lesson/${slug}`)} className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Lesson
            </Button>
            <QuizResults
              score={currentScore}
              total={quiz.questions.length}
              xp={xp}
              onRetry={handleRetry}
              onContinue={handleContinue}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <TopBar />
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => router.push(`/lesson/${slug}`)} className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Lesson
          </Button>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{lesson.title} Quiz</h1>
            <p className="text-slate-600">Test your understanding of {lesson.title.toLowerCase()}</p>
          </div>

          <QuizCard
            key={currentQuestion}
            question={quiz.questions[currentQuestion]}
            questionNumber={currentQuestion + 1}
            totalQuestions={quiz.questions.length}
            onAnswer={handleAnswer}
            showResult={showResult}
            selectedAnswer={selectedAnswers[currentQuestion]}
          />

          {showResult && (
            <div className="mt-4 flex justify-end animate-fade-in">
              <Button onClick={handleNextQuestion} className="gap-2">
                {currentQuestion < quiz.questions.length - 1 ? (
                  <>Next Question<ArrowRight className="h-4 w-4" /></>
                ) : (
                  <>See Results<Trophy className="h-4 w-4" /></>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
