import type { ReactNode } from 'react';
import SellerSidebar from '@/components/seller/SellerSidebar';
import { Card, CardContent } from '@/components/ui/card';

// This layout will be protected by middleware.
// Additional role checks can be done here if needed, using Clerk's auth() helper.
// For example, redirecting if the user is not an admin/seller.

export default function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SellerSidebar />
      <main className="flex-1 p-6 bg-muted/40">
        <Card className="h-full shadow-lg">
          <CardContent className="p-6">
            {children}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
