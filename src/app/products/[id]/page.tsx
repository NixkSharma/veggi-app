
import { Suspense } from 'react';
import Image from 'next/image';
import { getProductById } from '@/lib/products';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import ProductDetailActions from './ProductDetailActions'; 

async function ProductDetailPageData({ productId }: { productId: number }) {
  const product = await getProductById(productId);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <Button asChild variant="link" className="mt-4">
          <Link href="/dashboard">Go back to shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/dashboard">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Products
        </Link>
      </Button>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="aspect-square relative w-full overflow-hidden rounded-lg shadow-lg bg-card">
          <Image
            src={product.imageUrl || 'https://placehold.co/600x400.png'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority 
            data-ai-hint={product.dataAiHint || 'vegetable item'}
          />
        </div>
        <div className="space-y-6">
          {product.category && <Badge variant="outline">{product.category}</Badge>}
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{product.name}</h1>
          <p className="text-3xl font-semibold text-primary">${product.price.toFixed(2)}</p>
          <p className="text-base text-muted-foreground leading-relaxed">{product.description || 'No description available.'}</p>
          
          <ProductDetailActions product={product} />
        </div>
      </div>
    </div>
  );
}

export default async function ProductDetailPage({ params: paramsProp }: { params: { id: string } }) {
  const resolvedParams = await paramsProp;
  const idParam = resolvedParams.id;
  const productId = parseInt(idParam, 10);

  if (isNaN(productId)) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold">Invalid Product ID</h1>
        <p className="text-muted-foreground">The product ID in the URL is not valid.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/dashboard">Go back to shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailPageData productId={productId} />
    </Suspense>
  );
}

const ProductDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <Skeleton className="h-9 w-36 mb-6" /> {/* Back button skeleton */}
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <div>
        <Skeleton className="w-full aspect-square rounded-lg" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" /> {/* Badge skeleton */}
        <Skeleton className="h-10 w-3/4" /> {/* Title skeleton */}
        <Skeleton className="h-8 w-1/4" /> {/* Price skeleton */}
        <Skeleton className="h-20 w-full" /> {/* Description skeleton */}
        <Skeleton className="h-6 w-1/2" /> {/* Stock info skeleton */}
        <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-32" /> {/* Quantity controls skeleton */}
            <Skeleton className="h-12 flex-grow" /> {/* Add to cart button skeleton */}
        </div>
      </div>
    </div>
  </div>
);
