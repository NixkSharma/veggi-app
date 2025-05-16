import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', // Protects /dashboard and all its sub-routes
  '/admin(.*)', // Protects /admin and all its sub-routes (for future use)
  '/cart(.*)', // Optionally protect cart
  '/checkout(.*)', // Optionally protect checkout
  '/order-confirmation(.*)', // Optionally protect order confirmation
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect(); // Protect the route if it matches
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (from public)
     * - favicon.ico (from public)
     * - api (API routes, if you want to protect them individually or handle auth differently)
     * - trpc (if using tRPC)
     */
    "/((?!_next/static|_next/image|favicon.ico|static|api/webhooks/clerk).*)",
    "/" // Ensure the root is matched for public/protected logic
  ],
};
