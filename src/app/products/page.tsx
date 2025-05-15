
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page can act as a dedicated "shop" page or redirect to the homepage
// with specific filters or a "view all" state.
// For simplicity, we'll redirect to the homepage, which already handles product listing.
export default function AllProductsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/'); // Redirect to homepage
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-semibold">Loading All Vegetables...</h1>
      <p className="mt-2 text-muted-foreground">You will be redirected shortly.</p>
    </div>
  );
}
