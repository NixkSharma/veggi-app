
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const adminEmail = process.env.ADMIN_EMAIL;
  const isUserAdmin = token?.email === adminEmail;

  // Log for debugging
  // console.log('[Middleware] Path:', pathname);
  // console.log('[Middleware] Token:', token);
  // console.log('[Middleware] Is Admin User (based on email):', isUserAdmin);

  // Protect /seller routes: only admin can access
  if (pathname.startsWith('/seller')) {
    if (!token) {
      const url = new URL('/login', req.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    if (!isUserAdmin) {
      // console.log('[Middleware] Non-admin attempting to access /seller. Redirecting to /dashboard.');
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // Protect /dashboard and other consumer-authenticated routes
  const consumerProtectedPaths = ['/dashboard', '/cart', '/checkout', '/order-confirmation'];
  if (consumerProtectedPaths.some(p => pathname.startsWith(p))) {
    if (!token) {
      const url = new URL('/login', req.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    // If admin lands on consumer dashboard, redirect to seller dashboard
    if (isUserAdmin && pathname.startsWith('/dashboard')) {
        // console.log('[Middleware] Admin on /dashboard. Redirecting to /seller/dashboard.');
        return NextResponse.redirect(new URL('/seller/dashboard', req.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the root path - landing page, should be public)
     * - /login (login page)
     * - /register (register page)
     * - /about, /contact, /products (other public pages)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|register|about|contact|products).*)',
    // Include specific protected routes if the above pattern is too broad or misses some
    '/dashboard/:path*',
    '/seller/:path*',
    '/cart/:path*',
    '/checkout/:path*',
    '/order-confirmation/:path*',
  ],
};
