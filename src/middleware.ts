
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/cart(.*)',
  '/checkout(.*)',
  '/order-confirmation(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect(); // Protect the route if it matches
  }
}, {
  // Routes that can be visited by both signed-in and signed-out users.
  // These routes will not be protected by Clerk's default behavior.
  // The root '/' landing page is public.
  publicRoutes: ["/", "/about", "/contact", "/sign-in", "/sign-up"],

  // Routes that Clerk will completely ignore. No authentication context will be available.
  // Useful for static assets, API routes not related to Clerk, or truly static public pages
  // where no Clerk auth state is needed during SSR.
  // Clerk webhooks typically handle their own auth and should be ignored by the middleware.
  ignoredRoutes: ["/api/webhooks/clerk"],
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (from public)
     * - favicon.ico (from public)
     * Matcher applies to all routes, then clerkMiddleware options (publicRoutes, ignoredRoutes) refine behavior.
     */
    "/((?!_next/static|_next/image|favicon.ico|static).*)",
  ],
};
