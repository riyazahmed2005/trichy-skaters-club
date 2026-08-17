import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'e9a2636ebcde11681abdfa515c1e54911f42277d33261a8682054c7d03f0de01'
);

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // Bypass system requests
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/logo.jpg')
  ) {
    return NextResponse.next();
  }

  let session: any = null;
  if (sessionToken) {
    try {
      const { payload } = await jwtVerify(sessionToken, SECRET, {
        algorithms: ['HS256'],
      });
      session = payload;
    } catch (e) {
      // Invalid session
    }
  }

  // Route protection
  if (pathname.startsWith('/admin')) {
    if (!session || session.role !== 'ADMIN') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === '/login' || pathname === '/register') {
    if (session) {
      if (session.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login', '/register'],
};
