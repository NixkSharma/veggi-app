
"use client";

import Image from 'next/image';
import type { CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { MinusCircle, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface CartItemCardProps {
  item: CartItem;
}

const DEFAULT_PRODUCT_IMAGE = 'https://placehold.co/100x100.png';

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.product.id, newQuantity);
  };

  const productDataAiHint = item.product.dataAiHint || item.product.name?.toLowerCase().split(' ').slice(0,2).join(' ') || 'vegetable item';

  return (
    <div className="flex items-center space-x-4 rounded-lg border bg-card p-4 shadow-sm">
      <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
        <div className="relative h-20 w-20 overflow-hidden rounded-md sm:h-24 sm:w-24">
          <Image
            src={item.product.imageUrl || DEFAULT_PRODUCT_IMAGE}
            alt={item.product.name || 'Product image'}
            fill
            sizes="100px"
            className="object-cover"
            data-ai-hint={productDataAiHint}
          />
        </div>
      </Link>

      <div className="flex-grow">
        <Link href={`/products/${item.product.id}`}>
          <h3 className="text-base font-medium text-foreground hover:text-primary sm:text-lg">{item.product.name || 'Unnamed Product'}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">Price: ${item.product.price.toFixed(2)}</p>
        <p className="text-sm text-muted-foreground sm:hidden">Total: ${(item.product.price * item.quantity).toFixed(2)}</p>


        <div className="mt-2 flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                 if (!isNaN(val)) handleQuantityChange(val);
            }}
            onBlur={(e) => { 
                const val = parseInt(e.target.value,10);
                if(isNaN(val) || val < 1) handleQuantityChange(1);
            }}
            min="1"
            max={item.product.stock}
            className="h-8 w-14 p-1 text-center"
            aria-label="Item quantity"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.product.stock}
            aria-label="Increase quantity"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
         {item.quantity > item.product.stock && <p className="text-xs text-destructive mt-1">Max stock ({item.product.stock}) reached.</p>}

      </div>

      <div className="hidden text-right sm:block">
        <p className="text-base font-medium text-foreground">${(item.product.price * item.quantity).toFixed(2)}</p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive"
        onClick={() => removeFromCart(item.product.id)}
        aria-label="Remove item"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default CartItemCard;

    