'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Trophy } from 'lucide-react';
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

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (!quiz) return;
      if (selectedAnswers[currentQuestion] !== undefined) return;
      const isCorrect = answerIndex === quiz.questions[currentQuestion].correctAnswer;
      const newAnswers = [...selectedAnswers];
      newAnswers[currentQuestion] = answerIndex;
      setSelectedAnswers(newAnswers);
      if (isCorrect) setCurrentScore((prev) => prev + 1);
      setShowResult(true);
    },
    [currentQuestion, selectedAnswers, quiz]
  );

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
    const next = getNextLesson(slug);
    router.push(next ? `/lesson/${next.slug}` : '/progress');
  }, [slug, currentScore, quiz, router]);

  if (!lesson || !quiz) {
    return (
      <div className="max-w-2xl mx-auto rounded-xl bg-white p-8 text-center card-shadow">
        <h1 className="text-xl font-semibold text-slate-900 mb-4">Quiz not found</h1>
        <Button onClick={() => router.push('/journey')}>Back to Journey</Button>
      </div>
    );
  }

  if (quizComplete) {
    const xp = calculateXP(currentScore, quiz.questions.length);
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/lesson/${slug}`)}
          className="gap-1.5 text-slate-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to lesson
        </Button>
        <QuizResults
          score={currentScore}
          total={quiz.questions.length}
          xp={xp}
          onRetry={handleRetry}
          onContinue={handleContinue}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/lesson/${slug}`)}
          className="gap-1.5 text-slate-500 mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to lesson
        </Button>
        <h1 className="text-xl font-bold text-slate-900">{lesson.title} — Quiz</h1>
        <p className="text-sm text-slate-500">
          Test your understanding of {lesson.title.toLowerCase()}
        </p>
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
        <div className="flex justify-end animate-fade-in">
          <Button onClick={handleNextQuestion} className="gap-2">
            {currentQuestion < quiz.questions.length - 1 ? (
              <>
                Next Question
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                See Results
                <Trophy className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
