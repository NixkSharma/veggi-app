
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', // Protect the dashboard and its sub-routes
  '/admin(.*)',     // Protect the admin section and its sub-routes
  '/cart(.*)',
  '/checkout(.*)',
  '/order-confirmation(.*)',
  // Add any other routes that require authentication
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect(); // Protect the route if it matches the defined protected routes
  }
}, {
  publicRoutes: [
    "/", // Landing page is public
    "/about", 
    "/contact",
    "/sign-in(.*)", // Clerk's sign-in pages
    "/sign-up(.*)", // Clerk's sign-up pages
    // Add other public routes like product detail pages if they should be public:
    // "/products/(.*)" 
  ],
  ignoredRoutes: [
    "/api/webhooks/clerk", // Clerk webhooks should be ignored by this middleware
    // Add other specific API routes or static asset paths if needed
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
  ],
};
