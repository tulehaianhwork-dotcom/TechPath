'use client';

import { CheckCircle, XCircle, ArrowRight, RotateCcw, CheckCheck, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { QuizQuestion } from '@/data/quizzes';
import { XPBadge } from './XPBadge';

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedAnswer: number) => void;
  showResult?: boolean;
  selectedAnswer?: number;
}

export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  showResult = false,
  selectedAnswer,
}: QuizCardProps) {
  const progressWidth = `${(questionNumber / totalQuestions) * 100}%`;

  return (
    <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 card-shadow">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-blue-600">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm text-slate-500">
            {Math.round((questionNumber / totalQuestions) * 100)}% complete
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: progressWidth }}
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-slate-900 mb-6">{question.question}</h2>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          const showCorrect = showResult && isCorrect;
          const showIncorrect = showResult && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => !showResult && onAnswer(index)}
              disabled={showResult}
              className={cn(
                'w-full rounded-xl border-2 p-4 text-left transition-all duration-150',
                !showResult && 'hover:border-blue-300 hover:bg-blue-50 hover:translate-x-1',
                !showResult && isSelected && 'border-blue-500 bg-blue-50',
                showCorrect && 'border-green-500 bg-green-50',
                showIncorrect && 'border-red-500 bg-red-50',
                showResult && 'cursor-default',
                !showResult && !isSelected && 'border-slate-200 bg-white active:scale-99'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium',
                    !showResult && !isSelected && 'border-slate-300 text-slate-500',
                    !showResult && isSelected && 'border-blue-500 bg-blue-500 text-white',
                    showCorrect && 'border-green-500 bg-green-500 text-white',
                    showIncorrect && 'border-red-500 bg-red-500 text-white'
                  )}
                >
                  {showCorrect && <CheckCircle className="h-4 w-4" />}
                  {showIncorrect && <XCircle className="h-4 w-4" />}
                  {!showCorrect && !showIncorrect && String.fromCharCode(65 + index)}
                </div>
                <span
                  className={cn(
                    'font-medium',
                    showCorrect && 'text-green-700',
                    showIncorrect && 'text-red-700',
                    !showCorrect && !showIncorrect && 'text-slate-700'
                  )}
                >
                  {option}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="mt-6 animate-fade-in">
          <div
            className={cn(
              'rounded-lg p-4',
              selectedAnswer === question.correctAnswer
                ? 'bg-green-50 border border-green-200'
                : 'bg-amber-50 border border-amber-200'
            )}
          >
            <div className="flex items-start gap-2">
              {selectedAnswer === question.correctAnswer ? (
                <CheckCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-medium mb-1">
                  {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Not quite right'}
                </p>
                <p className="text-sm text-slate-600">{question.explanation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface QuizResultsProps {
  score: number;
  total: number;
  xp: number;
  onRetry: () => void;
  onContinue: () => void;
}

export function QuizResults({ score, total, xp, onRetry, onContinue }: QuizResultsProps) {
  const percentage = Math.round((score / total) * 100);
  const isPerfect = score === total;
  const isPassing = score >= 3;

  return (
    <div className="animate-scale-in rounded-2xl border border-slate-200 bg-white p-8 card-shadow text-center">
      <div
        className={cn(
          'mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full',
          isPerfect ? 'bg-green-100' : isPassing ? 'bg-blue-100' : 'bg-amber-100'
        )}
      >
        {isPerfect ? (
          <CheckCircle className="h-10 w-10 text-green-600" />
        ) : isPassing ? (
          <CheckCircle className="h-10 w-10 text-blue-600" />
        ) : (
          <RotateCcw className="h-10 w-10 text-amber-600" />
        )}
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        {isPerfect ? 'Perfect Score!' : isPassing ? 'Good Job!' : 'Keep Learning'}
      </h2>

      <p className="text-slate-600 mb-6">
        You got {score} out of {total} questions correct ({percentage}%)
      </p>

      <div className="inline-block mb-6">
        <XPBadge amount={xp} size="lg" showAnimation />
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={onRetry} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Button onClick={onContinue} className="gap-2">
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
