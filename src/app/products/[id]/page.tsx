
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getProductById } from '@/lib/products';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { ChevronLeft, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

function ProductDetailPageContent() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);


  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        setIsLoading(true);
        const fetchedProduct = await getProductById(id);
        setProduct(fetchedProduct || null);
        setIsLoading(false);
      };
      fetchProduct();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <Skeleton className="w-full aspect-square rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <Button asChild variant="link" className="mt-4">
          <Link href="/">Go back to shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Products
        </Link>
      </Button>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="aspect-square relative w-full overflow-hidden rounded-lg shadow-lg bg-card">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority // Prioritize loading of main product image
            data-ai-hint={product.dataAiHint || 'vegetable item'}
          />
        </div>
        <div className="space-y-6">
          <Badge variant="outline">{product.category}</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{product.name}</h1>
          <p className="text-3xl font-semibold text-primary">${product.price.toFixed(2)}</p>
          <p className="text-base text-muted-foreground leading-relaxed">{product.description}</p>
          
          {product.stock <= 0 ? (
             <p className="text-lg text-destructive font-semibold">Out of Stock</p>
          ) : product.stock < 10 && (
             <p className="text-lg text-accent-foreground/80 font-semibold">Only {product.stock} left in stock!</p>
          )}

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <MinusCircle className="h-5 w-5" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => {
                    let val = parseInt(e.target.value);
                    if (isNaN(val) || val < 1) val = 1;
                    if (val > product.stock) val = product.stock;
                    setQuantity(val);
                }}
                min="1"
                max={product.stock}
                className="h-10 w-16 text-center"
                aria-label="Product quantity"
                disabled={product.stock <=0}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock || product.stock <= 0}
                aria-label="Increase quantity"
              >
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
            <Button 
              size="lg" 
              onClick={() => addToCart(product, quantity)} 
              className="flex-grow bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={product.stock <= 0}
              aria-label={`Add ${product.name} to cart`}
            >
              <PlusCircle className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">Loading product details...</div>}>
      <ProductDetailPageContent />
    </Suspense>
  )
}
