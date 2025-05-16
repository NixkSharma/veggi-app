
'use client'; 

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Product, CategoryWithId } from '@/lib/types';
import ProductList, { ProductListSkeleton } from '@/components/ProductList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, XCircle, ShoppingBag, ChevronRight, Leaf, Zap, Smile } from 'lucide-react'; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Added CardDescription

interface HomeViewProps {
  initialProducts: Product[];
  initialCategories: CategoryWithId[];
  initialSearchTerm: string;
  initialCategory: string;
}

const DEFAULT_CATEGORY_IMAGE = 'https://placehold.co/300x200.png?text=Category';

export default function HomeView({ 
  initialProducts, 
  initialCategories,
  initialSearchTerm,
  initialCategory
}: HomeViewProps) {
  const router = useRouter();
  const searchParamsHook = useSearchParams(); 

  const [currentSearchTerm, setCurrentSearchTerm] = useState(initialSearchTerm);
  const [currentCategoryName, setCurrentCategoryName] = useState(initialCategory);

  useEffect(() => {
    setCurrentSearchTerm(searchParamsHook.get('q') || initialSearchTerm || '');
    setCurrentCategoryName(searchParamsHook.get('category') || initialCategory || 'All');
  }, [searchParamsHook, initialSearchTerm, initialCategory]);
  
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParamsHook.toString());
    if (currentSearchTerm.trim()) {
      params.set('q', currentSearchTerm.trim());
    } else {
      params.delete('q');
    }
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleCategoryChange = (newCategoryValue: string) => {
    setCurrentCategoryName(newCategoryValue); 
    const params = new URLSearchParams(searchParamsHook.toString());
    if (newCategoryValue && newCategoryValue !== 'All') {
      params.set('category', newCategoryValue);
    } else {
      params.delete('category'); 
    }
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setCurrentSearchTerm(''); 
    const params = new URLSearchParams(searchParamsHook.toString());
    params.delete('q'); 
    router.push(`/dashboard?${params.toString()}`);
  };

  const displayCategoriesForFilter = [
    { id: 'all-cat-key', name: 'All', imageUrl: '', dataAiHint: 'all categories' }, 
    ...(initialCategories || []).filter(cat => cat && cat.name && cat.name.toLowerCase() !== 'all')
  ];

  const featuredCategories = (initialCategories || []).filter(cat => cat && cat.name && cat.name.toLowerCase() !== 'all').slice(0, 4);
  
  return (
    <div className="flex flex-col min-h-dvh">
      {/* Hero Section - specific to dashboard */}
      <section className="relative py-16 md:py-24 px-4 bg-gradient-to-b from-primary/5 via-background to-background text-foreground text-center">
         <div className="absolute inset-0 opacity-10">
          <Image
            src="https://placehold.co/1920x700.png" 
            alt="Background collage of fresh vegetables"
            fill
            className="object-cover"
            priority
            data-ai-hint="vegetables field market"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary mb-6">
            Your Vegetable Marketplace
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Find the freshest ingredients for your meals. Search, filter, and discover quality produce.
          </p>
        </div>
      </section>

      {/* Featured Categories Section - only if categories exist */}
      {featuredCategories && featuredCategories.length > 0 && (
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold text-center text-foreground mb-10">
              Shop by Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredCategories.map(category => (
                <Link key={category.id} href={`/dashboard?category=${encodeURIComponent(category.name)}`} passHref legacyBehavior>
                  <a className="group block">
                    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl h-full flex flex-col">
                      <CardHeader className="p-0">
                        <div className="aspect-[4/3] relative w-full">
                          <Image
                            src={category.imageUrl || DEFAULT_CATEGORY_IMAGE}
                            alt={category.name || 'Category image'}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            data-ai-hint={category.dataAiHint || (category.name && typeof category.name === 'string' ? category.name.toLowerCase() : '') || 'vegetable category'}
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 flex-grow flex flex-col justify-center">
                        <CardTitle className="text-lg font-medium text-center text-foreground group-hover:text-primary transition-colors">
                          {category.name || 'Unnamed Category'}
                        </CardTitle>
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Search and Filter Section */}
      <section className="py-8 sticky top-16 z-40 bg-background/90 backdrop-blur-md shadow-sm mb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 bg-card rounded-lg border">
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
                    aria-label="Search vegetables"
                  />
                  <Button type="submit" className="rounded-l-none h-10" aria-label="Search">
                    <SearchIcon className="h-5 w-5" />
                  </Button>
                </div>
              </form>
              
              <div>
                <label htmlFor="category-select" className="block text-sm font-medium text-foreground mb-1">Filter by Category</label>
                <Select value={currentCategoryName || 'All'} onValueChange={handleCategoryChange}>
                  <SelectTrigger id="category-select" className="w-full h-10" aria-label="Select category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {displayCategoriesForFilter.map(cat => (
                      <SelectItem key={cat.id || cat.name} value={cat.name || 'All'}>
                        {cat.name || 'Unnamed Category'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {currentSearchTerm.trim() && (
              <div className="mt-4 flex justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSearch}
                  aria-label="Clear search term"
                >
                  <XCircle className="mr-2 h-4 w-4" /> Clear Search: "{currentSearchTerm}"
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Product Listing Section */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-center text-foreground mb-10 mt-8 md:mt-12">
            Our Freshest Picks
          </h2>
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList products={initialProducts} isLoading={false} /> 
          </Suspense>
        </div>
      </section>
    </div>
  );
}


    