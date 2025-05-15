
"use client";

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { PlusCircle } from 'lucide-react'; // Removed ShoppingCart as PlusCircle is used
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl h-full">
      <Link href={`/products/${product.id}`} className="block">
        <CardHeader className="p-0">
          <div className="aspect-[4/3] relative w-full overflow-hidden">
            <Image
              src={product.imageUrl || 'https://placehold.co/600x400.png'}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
              data-ai-hint={product.dataAiHint || 'vegetable food'}
            />
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.id}`} className="block">
          <CardTitle className="text-lg font-semibold hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        <CardDescription className="mt-1 text-sm text-muted-foreground h-10 overflow-hidden">
          {product.description || 'No description available.'}
        </CardDescription>
        <p className="mt-2 text-lg font-bold text-primary">
          ${product.price.toFixed(2)}
        </p>
        {product.stock <= 0 ? (
           <p className="mt-2 text-sm text-destructive font-medium">Out of Stock</p>
        ) : product.stock < 10 && (
           <p className="mt-2 text-sm text-accent-foreground/80 font-medium">Only {product.stock} left!</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => addToCart(product)} 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          aria-label={`Add ${product.name} to cart`}
          disabled={product.stock <= 0}
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
