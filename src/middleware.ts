import { clerkMiddleware, createRouteMatcher, getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define routes that require general authentication (both consumer and seller after login)
const isProtectedConsumerRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/cart(.*)',
  '/checkout(.*)',
  '/order-confirmation(.*)',
  // Add other consumer-specific authenticated routes here
]);

const isProtectedSellerRoute = createRouteMatcher([
  '/seller(.*)',
]);

// Define public routes accessible to everyone
const publicRoutes = [
  '/', // Landing page
  '/about',
  '/contact',
  '/products/(.*)', // Product detail pages
  '/sign-in(.*)',   // Clerk sign-in page
  '/sign-up(.*)',   // Clerk sign-up page
  // Other public utility routes if any
];

// Define routes that Clerk should completely ignore
const ignoredRoutes = [
  '/api/webhooks/clerk', // Clerk webhooks
  // "/api/some_other_public_api_route"
];

export default clerkMiddleware((auth, req: NextRequest) => {
  const { userId, sessionClaims, orgId, orgRole, orgSlug, user } = auth();

  // If the user is trying to access a protected seller route
  if (isProtectedSellerRoute(req)) {
    if (!userId) {
      // Not signed in, redirect to sign-in
      return auth().redirectToSignIn();
    }
    // User is signed in, check if they are the seller in afterAuth
  }

  // If the user is trying to access a protected consumer route
  if (isProtectedConsumerRoute(req)) {
    if (!userId) {
      // Not signed in, redirect to sign-in
      return auth().redirectToSignIn();
    }
    // User is signed in, check if they are a consumer in afterAuth
  }

  // For any other route, let it pass through for now, afterAuth will handle specifics.
  // If it's a public route, Clerk allows it.
  // If it's a protected route not yet handled, auth().protect() would typically be used,
  // but we're doing granular checks in afterAuth.
  return NextResponse.next();
}, {
  publicRoutes,
  ignoredRoutes,
  afterAuth: async (auth, req: NextRequest) => {
    const { userId, user } = auth; // `user` object is available after initial auth check
    const sellerPhoneNumber = process.env.SELLER_PHONE_NUMBER;
    const sellerEmail = process.env.SELLER_EMAIL;

    // Debugging: Log relevant information
    // console.log("afterAuth triggered. Path:", req.nextUrl.pathname);
    // console.log("User ID:", userId);
    // if (user) {
    //   console.log("User Primary Email:", user.primaryEmailAddress?.emailAddress);
    //   console.log("User Primary Phone:", user.primaryPhoneNumber?.phoneNumber);
    // }

    const isSeller = () => {
      if (!user) return false;
      const primaryEmail = user.primaryEmailAddress?.emailAddress;
      const primaryPhone = user.primaryPhoneNumber?.phoneNumber;
      const emailAddresses = user.emailAddresses?.map(e => e.emailAddress) || [];
      const phoneNumbers = user.phoneNumbers?.map(p => p.phoneNumber) || [];

      if (primaryEmail === sellerEmail || emailAddresses.includes(sellerEmail!)) {
        return true;
      }
      if (primaryPhone === sellerPhoneNumber || phoneNumbers.includes(sellerPhoneNumber!)) {
        return true;
      }
      return false;
    };

    const isSellerUser = isSeller();

    // If user is signed in
    if (userId) {
      if (isSellerUser) {
        // User is the seller
        // If they are trying to access consumer-specific protected routes, redirect to seller dashboard
        if (isProtectedConsumerRoute(req) && !req.nextUrl.pathname.startsWith('/seller')) {
          // console.log("Seller accessing consumer route, redirecting to /seller/dashboard");
          return NextResponse.redirect(new URL('/seller/dashboard', req.url));
        }
      } else {
        // User is a consumer
        // If they are trying to access seller routes, redirect to consumer dashboard
        if (isProtectedSellerRoute(req)) {
          // console.log("Consumer accessing seller route, redirecting to /dashboard");
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
      }
    } else {
      // User is not signed in
      // If trying to access any protected route (seller or consumer), Clerk's default behavior
      // (from the main middleware function or redirectToSignIn in specific checks) should handle redirection to sign-in.
      // No specific action needed here for unauthenticated access to protected routes,
      // as the main middleware part should handle it if auth().protect() were used,
      // or if specific route matchers above call redirectToSignIn().
      // This afterAuth is primarily for post-authentication role-based routing.
    }
    return NextResponse.next();
  }
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
