
import type { ReactNode } from 'react';
import SellerSidebar from '@/components/seller/SellerSidebar';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers'; // Ensure dynamic context

export const dynamic = 'force-dynamic'; // Ensure layout is dynamic for auth checks

export default async function SellerLayout({ children }: { children: ReactNode }) {
  headers(); // Opt-in to dynamic rendering
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    // console.log("SellerLayout: No session or user is not ADMIN. Redirecting to /login.");
    redirect('/login?callbackUrl=/seller/dashboard'); // Or to an unauthorized page
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <SellerSidebar />
      <main className="flex-1 p-6 sm:p-8">
        {children}
      </main>
    </div>
  );
}
