
import type { ReactNode } from 'react';
import SellerSidebar from '@/components/seller/SellerSidebar';
import { Card, CardContent } from '@/components/ui/card';

// This layout is protected by Clerk middleware configured in src/middleware.ts
// to only allow authenticated users access to /seller/* routes.
// Additional role-based checks to ensure ONLY the admin/seller can access
// would typically be done here using Clerk's auth() or by checking user metadata/roles
// once that part of your User model and Clerk setup is more defined.
// For now, if a user is signed in, they can reach this layout.

export default function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height,4rem))]"> {/* Adjust min-height if header has fixed height */}
      <SellerSidebar />
      <main className="flex-1 p-4 sm:p-6 bg-muted/30"> {/* Slightly lighter background */}
        <Card className="h-full shadow-lg rounded-xl overflow-hidden"> {/* Added rounded-xl and overflow-hidden */}
          <CardContent className="p-4 sm:p-6">
            {children}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
