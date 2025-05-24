import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', // Protect the consumer dashboard and its sub-routes
  '/seller(.*)',     // Protect the entire seller section
  '/cart(.*)',
  '/checkout(.*)',
  '/order-confirmation(.*)',
  // Add any other routes that require general user authentication
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect(); // Protect the route if it matches
  }
}, {
  // Routes that should be accessible to everyone, including unauthenticated users
  publicRoutes: [
    "/", // Landing page
    "/about", 
    "/contact",
    "/products/(.*)", // Allow viewing product detail pages
    // Clerk's own auth pages are handled by its routing, but explicit listing doesn't hurt
    "/sign-in(.*)", 
    "/sign-up(.*)",
    // Other public utility routes if any
  ],
  // Routes that Clerk should completely ignore (e.g., API routes handled elsewhere, static assets)
  ignoredRoutes: [
    "/api/webhooks/clerk", // Clerk webhooks
    // "/api/some_other_public_api_route"
  ],
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static (public static assets if you have a folder named 'static' in 'public')
     * This ensures that the middleware runs on all relevant pages and API routes.
     */
    "/((?!_next/static|_next/image|favicon.ico|static).*)",
    // Explicitly include API routes that might need to be checked by middleware,
    // unless they are specifically ignored.
    "/api/(.*)"
  ],
};
