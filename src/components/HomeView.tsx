
'use client'; 

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Product, CategoryWithId } from '@/lib/types'; // Import CategoryWithId
import ProductList from '@/components/ProductList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, XCircle, ShoppingBag } from 'lucide-react'; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HomeViewProps {
  initialProducts: Product[];
  initialCategories: CategoryWithId[]; // Updated to CategoryWithId[]
  initialSearchTerm: string;
  initialCategory: string; // This is the category *name* for the filter
}

export default function HomeView({ 
  initialProducts, 
  initialCategories,
  initialSearchTerm,
  initialCategory // This is the active filter category *name*
}: HomeViewProps) {
  const router = useRouter();
  const searchParamsHook = useSearchParams(); 

  const [currentSearchTerm, setCurrentSearchTerm] = useState(initialSearchTerm);
  const [currentCategoryName, setCurrentCategoryName] = useState(initialCategory); // Name of the active category

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
    router.push(`/dashboard?${params.toString()}`); // Ensure navigation stays within /dashboard
  };

  const handleCategoryChange = (newCategoryValue: string) => {
    setCurrentCategoryName(newCategoryValue); 
    const params = new URLSearchParams(searchParamsHook.toString());
    if (newCategoryValue && newCategoryValue !== 'All') {
      params.set('category', newCategoryValue);
    } else {
      params.delete('category'); 
    }
    router.push(`/dashboard?${params.toString()}`); // Ensure navigation stays within /dashboard
  };

  const handleClearSearch = () => {
    setCurrentSearchTerm(''); 
    const params = new URLSearchParams(searchParamsHook.toString());
    params.delete('q'); 
    router.push(`/dashboard?${params.toString()}`); // Ensure navigation stays within /dashboard
  };

  // Prepare categories for the dropdown, always including "All"
  const displayCategories = [
    { id: 'all-cat-key', name: 'All', imageUrl: '', dataAiHint: 'all categories' }, 
    ...initialCategories.filter(cat => cat && cat.name && cat.name.toLowerCase() !== 'all') // Filter out any "All" from data and nulls
  ];
  
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* This is the main product browsing dashboard now */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Our Fresh <span className="text-primary">Vegetable Market</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
          Browse, search, and filter to find the perfect ingredients for your next meal.
        </p>
      </section>

      <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
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
            <Select value={currentCategoryName} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category-select" className="w-full h-10" aria-label="Select category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {displayCategories.map(cat => (
                  <SelectItem key={cat.id || cat.name} value={cat.name}>
                    {cat.name}
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
              onClick={handleClearSearch}
              aria-label="Clear search term"
            >
              <XCircle className="mr-2 h-4 w-4" /> Clear Search
            </Button>
          </div>
        )}
      </div>
      
      <ProductList products={initialProducts} isLoading={false} /> 
    </div>
  );
}
