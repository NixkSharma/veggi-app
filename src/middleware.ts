
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
  // These routes will not be protected.
  publicRoutes: ["/about", "/contact", "/sign-in", "/sign-up", "/api/webhooks/clerk"],

  // Routes that Clerk will completely ignore. No authentication context will be available.
  // Useful for static assets, API routes not related to Clerk, or truly static public pages
  // where no Clerk auth state is needed during SSR.
  ignoredRoutes: ["/", "/api/webhooks/clerk"], // Add root path here
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (from public)
     * - favicon.ico (from public)
     * - api/webhooks/clerk (this was already in the negative lookahead, but also explicitly ignoring it in Clerk's options is fine)
     * Matcher applies to all routes, then clerkMiddleware options (publicRoutes, ignoredRoutes) refine behavior.
     */
    "/((?!_next/static|_next/image|favicon.ico|static).*)", // Simplified matcher, clerkMiddleware will handle specifics for /api/webhooks/clerk
    // The matcher should generally cover all paths you want middleware to inspect,
    // then publicRoutes/ignoredRoutes fine-tune Clerk's behavior.
  ],
};
