
import ProductList, { ProductListSkeleton } from '@/components/ProductList';
import HomeView from '@/components/HomeView';
import { getProducts, getCategoriesWithIds } from '@/lib/products';
import type { Product, CategoryWithId } from '@/lib/types';
import { Suspense } from 'react';

// This is the main dashboard page where products are listed and browsable.
// It was formerly the content of src/app/page.tsx
export default async function DashboardPage({
  searchParams: searchParamsProp,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const resolvedSearchParams = searchParamsProp ? await searchParamsProp : {};

  const qParam = resolvedSearchParams?.q;
  const categoryParam = resolvedSearchParams?.category;

  let searchTerm = '';
  if (Array.isArray(qParam)) {
    searchTerm = qParam[0] ?? '';
  } else if (typeof qParam === 'string') {
    searchTerm = qParam;
  }

  let categoryFilterName = 'All'; // This refers to the name of the category for filtering
  if (Array.isArray(categoryParam)) {
    categoryFilterName = categoryParam[0] ?? 'All';
  } else if (typeof categoryParam === 'string') {
    categoryFilterName = categoryParam;
  }
  
  if (categoryFilterName === '' || categoryFilterName === undefined) {
    categoryFilterName = 'All';
  }
  
  // Fetch initial data directly in the Server Component
  // For HomeView, we now pass detailed categories (CategoryWithId[])
  const [initialProducts, allCategoriesDetailed] = await Promise.all([
    getProducts(searchTerm, categoryFilterName), // getProducts filters by category name string
    getCategoriesWithIds() // Fetches CategoryWithId[] for the filter dropdown
  ]);
  
  const homeViewKey = `${searchTerm}-${categoryFilterName}`;

  return (
    <Suspense fallback={<ProductListSkeleton />}>
      <HomeView 
        key={homeViewKey}
        initialProducts={initialProducts} 
        initialCategories={allCategoriesDetailed} // Pass detailed categories (name, id, imageUrl)
        initialSearchTerm={searchTerm}
        initialCategory={categoryFilterName} // The active category filter name
      />
    </Suspense>
  );
}
