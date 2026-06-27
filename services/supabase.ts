import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cookie-based storage adapter so middleware can detect auth state
const cookieStorage = {
  getItem(key: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${key}=`));
    return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
  },
  setItem(key: string, value: string): void {
    if (typeof document === 'undefined') return;
    const maxAge = 60 * 60 * 24 * 365; // 1 year
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  },
  removeItem(key: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${key}=; path=/; max-age=0`;
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? cookieStorage : undefined,
  },
});
