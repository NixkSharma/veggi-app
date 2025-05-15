
"use client";

import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import { Skeleton } from "@/components/ui/skeleton";

interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ products, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <p className="text-center text-muted-foreground py-10 text-lg">No vegetables found. Try adjusting your search or filters!</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

const CardSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[200px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-8 w-full mt-2" />
    </div>
  </div>
);


export default ProductList;
