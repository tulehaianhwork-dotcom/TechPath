import { NextRequest, NextResponse } from 'next/server';

const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static files pass through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check for any Supabase session cookies
  // Note: Supabase stores session in localStorage by default, which middleware can't access
  // This is a best-effort check - the real protection is client-side in AppShell
  const cookies = request.cookies.getAll();
  const hasSessionCookie = cookies.some(
    (c) => c.name.includes('sb-') && c.name.includes('-auth-token')
  );

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));

  // If user has a session cookie and visits auth page, redirect to home
  if (isAuthRoute && hasSessionCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // For protected routes: if NO session cookie, redirect to login
  // But be lenient - if there's any sb- cookie, let it through and let client-side handle it
  if (!isAuthRoute && !hasSessionCookie) {
    // Check if there are ANY supabase-related cookies
    const hasAnySbCookie = cookies.some((c) => c.name.startsWith('sb-') || c.name.startsWith('supabase'));

    if (!hasAnySbCookie) {
      // No Supabase cookies at all, redirect to login
      const loginUrl = new URL('/login', request.url);
      if (pathname !== '/') loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
