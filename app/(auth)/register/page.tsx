'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

const requirements = [
  { label: 'At least 8 characters', check: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', check: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', check: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const passwordStrength = requirements.filter((r) => r.check(password)).length;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordStrength < requirements.length) {
      setError('Please meet all password requirements.');
      return;
    }
    setLoading(true);
    setError(null);

    const { error } = await signUp(email, password, fullName);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/'), 1500);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-5/12 gradient-brand flex-col justify-between p-10 text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
            <Zap className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight">TechPath</span>
        </div>

        <div className="space-y-5">
          <h2 className="text-2xl font-bold">Start your learning journey today</h2>
          <div className="space-y-3">
            {[
              'Structured paths curated for engineers',
              'Gamified progress with XP and badges',
              'Bite-sized lessons you can finish in minutes',
              'Built-in quiz engine with instant feedback',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2.5 text-sm text-blue-100">
                <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {['Free to start', 'No credit card', 'Lifetime access'].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand">
              <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold text-slate-900">TechPath</span>
          </div>

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="text-sm text-slate-500 mt-1">Start learning in under 2 minutes</p>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle className="h-7 w-7 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Account created!</h2>
              <p className="text-sm text-slate-500">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 mb-5"
                onClick={handleGoogle}
                disabled={googleLoading || loading}
              >
                <GoogleIcon />
                {googleLoading ? 'Redirecting...' : 'Sign up with Google'}
              </Button>

              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-slate-50 px-3 text-slate-400">or with email</span>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 rounded-lg bg-red-50 border border-red-200 p-3 mb-4 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-xs font-medium text-slate-700">Full name</Label>
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Smith"
                    className="mt-1.5"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-xs font-medium text-slate-700">Email address</Label>
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

                <div>
                  <Label htmlFor="password" className="text-xs font-medium text-slate-700">Password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="pr-10"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {password && (
                    <div className="mt-2 space-y-1.5">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              i < passwordStrength
                                ? passwordStrength === 1 ? 'bg-red-400'
                                  : passwordStrength === 2 ? 'bg-amber-400'
                                  : 'bg-emerald-500'
                                : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      {requirements.map((req) => (
                        <div key={req.label} className={`flex items-center gap-1.5 text-[11px] ${req.check(password) ? 'text-emerald-600' : 'text-slate-400'}`}>
                          <CheckCircle className="h-3 w-3" />
                          {req.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={loading || !fullName || !email || !password}
                >
                  {loading ? 'Creating account...' : (
                    <>Create account <ArrowRight className="h-4 w-4" /></>
                  )}
                </Button>
              </form>

              <p className="mt-5 text-center text-xs text-slate-400">
                By creating an account, you agree to our{' '}
                <span className="text-slate-600 font-medium">Terms of Service</span>
                {' '}and{' '}
                <span className="text-slate-600 font-medium">Privacy Policy</span>.
              </p>

              <p className="mt-4 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link href="/login" className="text-accent font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
