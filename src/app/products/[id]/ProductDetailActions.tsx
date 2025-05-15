
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

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (product.stock <= 0) return; // Should be disabled, but defensive
    const rawValue = e.target.value;

    if (rawValue === '') {
      // Allow user to clear input temporarily, onBlur will handle reset if needed
      // Or set to 1 immediately: setQuantity(1);
      // For controlled input, usually better to let it be empty then validate on blur or keep it from being empty
      // However, type="number" might behave weirdly with completely empty.
      // Let's assume they might be typing "10", so clearing to type is ok.
      // For now, if they clear it, it will become NaN and reset by blur or next valid char.
      // A stricter approach would be to not allow it to be empty and reset to 1.
      // Let's try setting to 1 if empty, makes it simpler.
      setQuantity(1); 
      return;
    }

    let val = parseInt(rawValue, 10);

    if (isNaN(val)) {
      setQuantity(1); // If input becomes non-numeric, reset to 1
      return;
    }

    if (val < 1) {
      val = 1;
    } else if (val > product.stock) {
      val = product.stock;
    }
    setQuantity(val);
  };

  const handleQuantityInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (product.stock <= 0) return;
    const rawValue = e.target.value;

    if (rawValue === '') {
      setQuantity(1); // If blurred while empty, reset to 1
      return;
    }

    let val = parseInt(rawValue, 10);

    if (isNaN(val) || val < 1) {
      setQuantity(1);
    } else if (val > product.stock) {
      setQuantity(product.stock);
    }
    // If valid and within bounds, it's already set by onChange
  };


  return (
    <>
      {product.stock <= 0 ? (
        <p className="text-lg text-destructive font-semibold">Out of Stock</p>
      ) : product.stock < 10 ? (
        <p className="text-lg text-accent-foreground/80 font-semibold">Only {product.stock} left in stock!</p>
      ) : (
        // Provide a placeholder for stock info if > 10 to maintain layout consistency, or remove this else block
        <p className="text-lg text-muted-foreground font-semibold">In Stock</p> 
      )}

      <div className="flex items-center space-x-4 pt-2">
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
            onChange={handleQuantityInputChange}
            onBlur={handleQuantityInputBlur}
            min="1"
            max={product.stock > 0 ? product.stock : undefined} // Undefined max if stock is 0 (as input is disabled)
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
