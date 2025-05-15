
"use client";

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface ProductDetailActionsProps {
  product: Product;
}

export default function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <>
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
            disabled={quantity <= 1 || product.stock <= 0}
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
              if (val > product.stock && product.stock > 0) val = product.stock;
              else if (product.stock <= 0) val = 1; // Default to 1 if out of stock, but button will be disabled
              setQuantity(val);
            }}
            onBlur={(e) => {
              let val = parseInt(e.target.value);
              if (product.stock > 0 && (isNaN(val) || val < 1)) {
                setQuantity(1);
              } else if (product.stock > 0 && val > product.stock) {
                setQuantity(product.stock);
              } else if (product.stock <= 0) {
                setQuantity(1); // Should ideally not happen if controls are disabled
              }
            }}
            min="1"
            max={product.stock > 0 ? product.stock : 1}
            className="h-10 w-16 text-center"
            aria-label="Product quantity"
            disabled={product.stock <= 0}
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
    </>
  );
}
