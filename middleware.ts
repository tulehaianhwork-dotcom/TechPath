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

  // Check for any Supabase session cookie (best-effort; client-side AuthGuard is definitive)
  const cookies = request.cookies.getAll();
  const hasSession = cookies.some(
    (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token') && c.value.length > 0
  );

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));

  // Authenticated users visiting auth pages → send to dashboard
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Unauthenticated users on protected routes → send to login
  if (!isAuthRoute && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/') loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
