
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page now redirects to the new /dashboard route.
export default function AllProductsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard'); // Redirect to dashboard
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-semibold">Loading All Vegetables...</h1>
      <p className="mt-2 text-muted-foreground">You will be redirected to our main shop page shortly.</p>
    </div>
  );
}
