
"use client"; // This "use client" is for HomeView, not the default export HomePage

import ProductList from '@/components/ProductList';
import { getProducts, getCategories } from '@/lib/products';
import type { Product } from '@/lib/types';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// This internal component will fetch data on the server.
async function PageDataFetcher({ searchTerm, category }: { searchTerm: string, category: string }) {
  const [products, categories] = await Promise.all([
    getProducts(searchTerm, category),
    getCategories()
  ]);
  return { products, categories };
}

// Server component wrapper for initial data load
export default async function HomePage({
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

  let category = 'All';
  if (Array.isArray(categoryParam)) {
    category = categoryParam[0] ?? 'All';
  } else if (typeof categoryParam === 'string') {
    category = categoryParam;
  }
  
  if (category === '' || category === undefined) {
    category = 'All';
  }
  
  const initialData = await PageDataFetcher({ searchTerm, category });
  
  return (
    <Suspense fallback={<div className="text-center py-10">Loading products...</div>}>
      <HomeView initialProducts={initialData.products} initialCategories={initialData.categories} />
    </Suspense>
  );
}


// Client component to handle interactions
function HomeView({ initialProducts, initialCategories }: { initialProducts: Product[], initialCategories: string[]}) {
  const router = useRouter();
  const searchParamsHook = useSearchParams(); 

  const initialSearchTermFromUrl = searchParamsHook.get('q') || '';
  
  const [currentSearchTerm, setCurrentSearchTerm] = useState(initialSearchTermFromUrl);
  
  const products = initialProducts; 
  const categories = initialCategories;


  useEffect(() => {
    setCurrentSearchTerm(searchParamsHook.get('q') || '');
  }, [searchParamsHook]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParamsHook.toString());
    if (currentSearchTerm.trim()) {
      params.set('q', currentSearchTerm.trim());
    } else {
      params.delete('q');
    }
    router.push(`/?${params.toString()}`);
  };

  const handleCategoryChange = (newCategory: string) => {
    const params = new URLSearchParams(searchParamsHook.toString());
    if (newCategory && newCategory !== 'All') {
      params.set('category', newCategory);
    } else {
      params.delete('category'); 
    }
    router.push(`/?${params.toString()}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Welcome to <span className="text-primary">VeggieDash</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
          Discover the freshest vegetables, sourced locally and delivered to your doorstep. Healthy eating made easy!
        </p>
      </section>

      <div className="mb-8 p-6 bg-card rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <form onSubmit={handleSearchSubmit} className="md:col-span-2">
            <label htmlFor="search-input" className="block text-sm font-medium text-foreground mb-1">Search Vegetables</label>
            <div className="flex">
              <Input
                id="search-input"
                type="search"
                placeholder="e.g., Organic Broccoli, Ripe Tomatoes..."
                value={currentSearchTerm}
                onChange={(e) => setCurrentSearchTerm(e.target.value)}
                className="h-10 rounded-r-none focus:z-10"
              />
              <Button type="submit" className="rounded-l-none h-10" aria-label="Search">
                <SearchIcon className="h-5 w-5" />
              </Button>
            </div>
          </form>
          
          <div>
            <label htmlFor="category-select" className="block text-sm font-medium text-foreground mb-1">Filter by Category</label>
            <Select value={searchParamsHook.get('category') || 'All'} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category-select" className="w-full h-10">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <ProductList products={products} isLoading={false} /> 
    </div>
  );
}

// Removed stray searchParamsProp declaration that was here
