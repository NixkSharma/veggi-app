
import ProductList, { ProductListSkeleton } from '@/components/ProductList';
import HomeView from '@/components/HomeView'; // Import the Client Component
import { getProducts, getCategories } from '@/lib/products';
import type { Product } from '@/lib/types';
import { Suspense } from 'react';

// HomePage is a Server Component by default (no 'use client' at the top of the file)
export default async function HomePage({
  searchParams: searchParamsProp,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Await searchParams if Next.js requires it for async Server Components
  const resolvedSearchParams = searchParamsProp ? await searchParamsProp : {};

  const qParam = resolvedSearchParams?.q;
  const categoryParam = resolvedSearchParams?.category;

  let searchTerm = '';
  if (Array.isArray(qParam)) {
    searchTerm = qParam[0] ?? '';
  } else if (typeof qParam === 'string') {
    searchTerm = qParam;
  }

  let category = 'All';
  if (Array.isArray(categoryParam)) {
    category = categoryParam[0] ?? 'All';
  } else if (typeof categoryParam === 'string') {
    category = categoryParam;
  }
  
  if (category === '' || category === undefined) {
    category = 'All';
  }
  
  // Fetch initial data directly in the Server Component
  const [initialProducts, initialCategories] = await Promise.all([
    getProducts(searchTerm, category),
    getCategories()
  ]);
  
  const homeViewKey = `${searchTerm}-${category}`;

  return (
    <Suspense fallback={<ProductListSkeleton />}>
      <HomeView 
        key={homeViewKey}
        initialProducts={initialProducts} 
        initialCategories={initialCategories}
        initialSearchTerm={searchTerm} // Pass initial search term for controlled input
        initialCategory={category} // Pass initial category for controlled select
      />
    </Suspense>
  );
}
