'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Zap, ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);

    const { error } = await resetPassword(email);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand">
            <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold text-slate-900">TechPath</span>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>

        {sent ? (
          <div className="text-center py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-4">
              <CheckCircle className="h-7 w-7 text-emerald-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Check your email</h1>
            <p className="text-sm text-slate-500 mb-1">
              We sent a password reset link to
            </p>
            <p className="text-sm font-semibold text-slate-900 mb-6">{email}</p>
            <p className="text-xs text-slate-400">
              Didn&apos;t receive it?{' '}
              <button
                onClick={() => setSent(false)}
                className="text-accent hover:underline"
              >
                Try again
              </button>
            </p>
          </div>
        ) : (
          <>
            <div className="mb-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 mb-4">
                <Mail className="h-6 w-6 text-slate-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Forgot your password?</h1>
              <p className="text-sm text-slate-500 mt-1">
                Enter your email and we&apos;ll send a reset link.
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-lg bg-red-50 border border-red-200 p-3 mb-4 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-xs font-medium text-slate-700">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="mt-1.5"
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !email}
              >
                {loading ? 'Sending link...' : 'Send reset link'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Remember your password?{' '}
              <Link href="/login" className="text-accent font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
