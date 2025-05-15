
"use client"; // Keep "use client" for SearchParam interactions, but data fetching is server-side

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

function HomePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchTermQuery = searchParams.get('q') || '';
  const categoryQuery = searchParams.get('category') || 'All';
  
  const [currentSearchTerm, setCurrentSearchTerm] = useState(searchTermQuery);
  // Data state will be managed by Next.js re-fetching when searchParams change
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // This effect runs on the client when searchParams change,
    // triggering a new server-side fetch for the page.
    // We also update products and categories here based on the new props.
    const fetchDataForClient = async () => {
      setIsLoading(true);
      // Simulate data fetching based on current query params
      // In a real app with full server components, this might not be needed
      // if the page fully re-renders server-side.
      // However, for a hybrid approach, we fetch again or rely on Next.js to provide updated props.
      const fetchedData = await PageDataFetcher({ searchTerm: searchTermQuery, category: categoryQuery });
      setProducts(fetchedData.products);
      setCategories(fetchedData.categories);
      setIsLoading(false);
    };
    fetchDataForClient();
  }, [searchTermQuery, categoryQuery]);
  
  useEffect(() => {
    setCurrentSearchTerm(searchTermQuery);
  }, [searchTermQuery]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (currentSearchTerm.trim()) {
      params.set('q', currentSearchTerm.trim());
    } else {
      params.delete('q');
    }
    router.push(`/?${params.toString()}`);
  };

  const handleCategoryChange = (newCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory && newCategory !== 'All') {
      params.set('category', newCategory);
    } else {
      params.delete('category');
    }
    router.push(`/?${params.toString()}`);
  };

  // Render initial data if available (passed from server component wrapper if any)
  // or show loading state.
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
            <Select value={categoryQuery} onValueChange={handleCategoryChange}>
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
      
      <ProductList products={products} isLoading={isLoading} />
    </div>
  );
}


// Server component wrapper for initial data load
export default async function HomePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const searchTerm = typeof searchParams?.q === 'string' ? searchParams.q : '';
  const category = typeof searchParams?.category === 'string' ? searchParams.category : 'All';

  // Fetch initial data on the server
  const initialData = await PageDataFetcher({ searchTerm, category });

  // Pass initial data to the client component handling interactions
  // For a fully server-rendered approach upon navigation, the HomePageContent
  // itself would become async. However, to keep interactive search and filters
  // client-side without full page reloads for each keystroke (unless desired),
  // a hybrid approach is often used.
  // The key is `HomePageContent` will re-fetch via its useEffect when searchParams from `useSearchParams` change.
  
  // The following is a pattern if we want the "HomePageContent" to directly use server-fetched data.
  // To do this, `HomePageContent` would be an async component.
  // For now, we'll keep `HomePageContent` as a client component that re-fetches.

  // The structure with `HomePageContent` and `PageDataFetcher` is a common way to handle
  // initial server-side data load for a page that then becomes interactive on the client.
  // For products to show up on first load:
  // `ProductList` needs initial `products`, and `Select` needs initial `categories`.
  // We can make `HomePageContent` an async component directly.
  
  // Let's refactor HomePageContent to be async for a cleaner server component pattern.
  // This means removing the "use client" from the top of HomePageContent itself,
  // and making the main export the async component.
  // Interactive parts (like input typing) then need to be extracted to their own client components if needed.
  
  // For this iteration, we'll make the top-level export `async` and fetch data there.
  // `HomePageContent` will receive this data as props.

  return (
    <Suspense fallback={<div>Loading page...</div>}>
       {/* 
        This HomePageContent structure is slightly confusing for a pure server component data flow.
        Let's simplify. The main export `HomePage` will be the async component.
        Interactive elements like the search form and category select will be client components.
      */}
      <HomeView initialProducts={initialData.products} initialCategories={initialData.categories} />
    </Suspense>
  );
}


// New client component to handle interactions
function HomeView({ initialProducts, initialCategories }: { initialProducts: Product[], initialCategories: string[]}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchTermQuery = searchParams.get('q') || '';
  const categoryQuery = searchParams.get('category') || 'All';

  const [currentSearchTerm, setCurrentSearchTerm] = useState(searchTermQuery);
  
  // Products and categories are now driven by props and searchParams changes
  // No need for isLoading state here if ProductList handles it or if Suspense is used effectively.
  const products = initialProducts;
  const categories = initialCategories;


  useEffect(() => {
    setCurrentSearchTerm(searchTermQuery);
  }, [searchTermQuery]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (currentSearchTerm.trim()) {
      params.set('q', currentSearchTerm.trim());
    } else {
      params.delete('q');
    }
    router.push(`/?${params.toString()}`);
  };

  const handleCategoryChange = (newCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
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
            <Select value={categoryQuery} onValueChange={handleCategoryChange}>
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
      
      <ProductList products={products} isLoading={false} /> {/* isLoading false as data is pre-fetched */}
    </div>
  );
}
