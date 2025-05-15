
'use client'; // This directive MUST be at the top of the file

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Product } from '@/lib/types';
import ProductList from '@/components/ProductList';
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

interface HomeViewProps {
  initialProducts: Product[];
  initialCategories: string[];
  initialSearchTerm: string;
  initialCategory: string;
}

export default function HomeView({ 
  initialProducts, 
  initialCategories,
  initialSearchTerm,
  initialCategory
}: HomeViewProps) {
  const router = useRouter();
  const searchParamsHook = useSearchParams(); // For reading current URL state

  // State for controlled inputs, initialized from server-passed props
  const [currentSearchTerm, setCurrentSearchTerm] = useState(initialSearchTerm);
  const [currentCategory, setCurrentCategory] = useState(initialCategory);

  // Effect to update controlled input if URL changes externally (e.g. browser back/forward)
  // or if the initial props change (e.g. due to re-keying)
  useEffect(() => {
    setCurrentSearchTerm(searchParamsHook.get('q') || initialSearchTerm || '');
    setCurrentCategory(searchParamsHook.get('category') || initialCategory || 'All');
  }, [searchParamsHook, initialSearchTerm, initialCategory]);
  
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParamsHook.toString());
    if (currentSearchTerm.trim()) {
      params.set('q', currentSearchTerm.trim());
    } else {
      params.delete('q');
    }
    // Navigate, which will cause HomePage (Server Component) to re-render
    router.push(`/?${params.toString()}`);
  };

  const handleCategoryChange = (newCategoryValue: string) => {
    setCurrentCategory(newCategoryValue); // Update local state for controlled component
    const params = new URLSearchParams(searchParamsHook.toString());
    if (newCategoryValue && newCategoryValue !== 'All') {
      params.set('category', newCategoryValue);
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
            <Select value={currentCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category-select" className="w-full h-10">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {initialCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Products are passed from HomePage server component */}
      <ProductList products={initialProducts} isLoading={false} /> 
    </div>
  );
}
