
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', // Protects /dashboard and all its sub-routes
  '/admin(.*)', // Protects /admin and all its sub-routes
  '/cart(.*)', 
  '/checkout(.*)', 
  '/order-confirmation(.*)', 
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect(); // Protect the route if it matches
  }
}, {
  publicRoutes: ["/", "/about", "/contact", "/sign-in", "/sign-up"], // Explicitly list all public routes, including the landing page
  ignoredRoutes: ["/api/webhooks/clerk"], // Clerk webhooks should be ignored by auth protection
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (from public)
     * - favicon.ico (from public)
     * - api/webhooks/clerk (explicitly ignore this specific API route for Clerk)
     */
    "/((?!_next/static|_next/image|favicon.ico|static|api/webhooks/clerk).*)",
    "/" // Ensure the root is matched for public/protected logic
  ],
};
