
"use client";

import CheckoutForm from '@/components/CheckoutForm';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DEFAULT_PRODUCT_IMAGE_CHECKOUT = 'https://placehold.co/50x50.png';

export default function CheckoutPage() {
  const { cartItems, getCartTotal, getItemCount } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart'); // Redirect to cart if it's empty
    }
  }, [cartItems, router]);

  if (cartItems.length === 0) {
    // This will be shown briefly before redirect or if redirect fails
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Your cart is empty. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Checkout</h1>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CheckoutForm totalAmount={getCartTotal()} />
        </div>

        <div className="lg:col-span-2">
          <Card className="sticky top-24 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Your Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map(item => (
                <div key={item.product.id} className="flex items-center justify-between space-x-3 border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-center space-x-3">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded">
                      <Image 
                        src={item.product.imageUrl || DEFAULT_PRODUCT_IMAGE_CHECKOUT} 
                        alt={item.product.name || 'Product image'} 
                        fill 
                        sizes="50px" 
                        className="object-cover"
                        data-ai-hint={item.product.dataAiHint || item.product.name?.toLowerCase().split(' ').slice(0,2).join(' ') || 'vegetable item'}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.product.name || 'Unnamed Product'}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <hr className="my-3"/>
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({getItemCount()} items)</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-primary">Free</span>
              </div>
              <hr className="my-3"/>
              <div className="flex justify-between text-xl font-bold text-foreground">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </CardContent>
            <CardContent>
                 <Button variant="outline" asChild className="w-full">
                    <Link href="/cart">Back to Cart</Link>
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    