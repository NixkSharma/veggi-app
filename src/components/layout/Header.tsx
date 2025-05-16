
"use client";

import Link from 'next/link';
import { ShoppingCart, Search, Menu, LayoutDashboard } from 'lucide-react'; // Added LayoutDashboard
import VeggieDashLogo from '@/components/VeggieDashLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const { cartItems } = useCart();
  const [itemCount, setItemCount] = useState(0);
  const [isClient, setIsClient] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const currentSearchParams = useSearchParams(); 

  const [searchTerm, setSearchTerm] = useState(currentSearchParams.get('q') || '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true); 
  }, []);

  useEffect(() => {
    if (isClient) {
      const currentItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      setItemCount(currentItemCount);
    }
  }, [cartItems, isClient]);

  useEffect(() => {
    setSearchTerm(currentSearchParams.get('q') || '');
  }, [currentSearchParams]);


  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const targetPath = '/dashboard'; // Always search on the dashboard page
    
    const params = new URLSearchParams(currentSearchParams.toString());
    
    if (searchTerm.trim()) {
      params.set('q', searchTerm.trim());
    } else {
      params.delete('q'); 
    }
    
    router.push(`${targetPath}?${params.toString()}`);

    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' }, // Landing page
    { href: '/dashboard', label: 'Shop Vegetables' }, // Main product browsing
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/admin/dashboard', label: 'Admin'}, // Admin link
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="VeggieDash Home">
          <VeggieDashLogo className="h-8 w-auto sm:h-9" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                (pathname === link.href || (link.href === '/dashboard' && pathname.startsWith('/products'))) // Highlight "Shop" if on dashboard or product detail
                ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
           <form onSubmit={handleSearch} className="hidden sm:flex items-center relative">
              <Input
                type="search"
                placeholder="Search vegetables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 pr-10 w-40 lg:w-64"
              />
              <Button type="submit" variant="ghost" size="icon" className="absolute right-0 h-9 w-9" aria-label="Search">
                <Search className="h-4 w-4" />
              </Button>
            </form>

          <Link href="/cart">
            <Button variant="ghost" size="icon" aria-label="View Cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {isClient && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile Navigation Trigger */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs bg-background p-6">
                <div className="flex flex-col space-y-6">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="self-start">
                     <VeggieDashLogo className="h-8 w-auto" />
                  </Link>
                  <form onSubmit={handleSearch} className="flex items-center relative">
                    <Input
                      type="search"
                      placeholder="Search vegetables..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-9 pr-10 w-full"
                    />
                    <Button type="submit" variant="ghost" size="icon" className="absolute right-0 h-9 w-9" aria-label="Search">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                  <nav className="flex flex-col space-y-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-lg font-medium transition-colors hover:text-primary ${
                           (pathname === link.href || (link.href === '/dashboard' && pathname.startsWith('/products'))) 
                           ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
