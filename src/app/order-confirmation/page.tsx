
"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle, Package } from 'lucide-react';
import type { CartItem, Product } from '@/lib/types'; 
import Image from 'next/image';

const DEFAULT_PRODUCT_IMAGE_CONFIRMATION = 'https://placehold.co/50x50.png';

interface AddressFormData {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  notes?: string;
}

// Ensure Product within CartItem is fully defined to prevent access errors
interface SanitizedCartItem extends Omit<CartItem, 'product'> {
  product: Product & { 
    id: number; // ensure id is number
    name: string; // ensure name is string
    price: number; // ensure price is number
    imageUrl?: string | null; // can be null
    dataAiHint?: string | null; // can be null
  };
}

interface Order {
  id: string;
  timestamp: string;
  deliveryDetails: AddressFormData;
  items: SanitizedCartItem[]; 
  totalAmount: number;
  status: string;
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      const storedOrdersRaw = localStorage.getItem('veggieDashOrders');
      if (storedOrdersRaw) {
        try {
          const storedOrders: Order[] = JSON.parse(storedOrdersRaw);
          let currentOrder = storedOrders.find((o: Order) => o.id === orderId);
          
          if (currentOrder && currentOrder.items) {
            // Sanitize items to ensure product properties are as expected
            currentOrder.items = currentOrder.items.map((item): SanitizedCartItem => {
              const product = item.product || {} as Product; // Ensure product exists
              return {
                ...item,
                product: {
                  ...product,
                  id: typeof product.id === 'string' ? parseInt(product.id, 10) : (product.id || 0),
                  name: product.name || 'Unnamed Product',
                  price: typeof product.price === 'number' ? product.price : 0,
                  imageUrl: product.imageUrl, // Can be null
                  dataAiHint: product.dataAiHint, // Can be null
                },
                quantity: item.quantity || 1,
              };
            }).filter((item: SanitizedCartItem) => !isNaN(item.product.id)); // Filter out items with invalid product ID
          }
          setOrder(currentOrder || null);
        } catch (error) {
          console.error("Error parsing orders from localStorage:", error);
          setOrder(null);
        }
      } else {
        setOrder(null);
      }
    }
    setIsLoading(false);
  }, [orderId]);

  if (isLoading) {
    return <div className="text-center py-10">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold text-destructive">Order Not Found</h1>
        <p className="mt-2 text-muted-foreground">We couldn't find details for this order. It might have been cleared or there was an issue.</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-3xl">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-primary/10 rounded-t-lg py-8">
          <CheckCircle className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold text-primary">Thank You For Your Order!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Your order <span className="font-semibold text-foreground">#{order.id.split('_')[1]}</span> has been placed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Order Summary</h3>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.product.id} className="flex items-center justify-between p-2 border rounded-md bg-background hover:bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded">
                       <Image 
                        src={item.product.imageUrl || DEFAULT_PRODUCT_IMAGE_CONFIRMATION} 
                        alt={item.product.name} 
                        fill 
                        sizes="50px" 
                        className="object-cover"
                        data-ai-hint={item.product.dataAiHint || item.product.name?.toLowerCase().split(' ').slice(0,2).join(' ') || 'vegetable item'}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between font-bold text-lg text-foreground">
              <span>Total Amount:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Delivery Details</h3>
            <div className="p-4 border rounded-md bg-background space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {order.deliveryDetails.fullName}</p>
              <p><span className="font-medium">Email:</span> {order.deliveryDetails.email}</p>
              <p><span className="font-medium">Phone:</span> {order.deliveryDetails.phone}</p>
              <p><span className="font-medium">Address:</span> {order.deliveryDetails.streetAddress}, {order.deliveryDetails.city}, {order.deliveryDetails.postalCode}, {order.deliveryDetails.country}</p>
              {order.deliveryDetails.notes && <p><span className="font-medium">Notes:</span> {order.deliveryDetails.notes}</p>}
            </div>
          </div>
          
          <p className="text-center text-muted-foreground">
            You will receive an email confirmation shortly. Your order status is currently: <span className="font-semibold text-accent">{order.status}</span>.
          </p>

          <Button asChild className="w-full mt-6" size="lg">
            <Link href="/dashboard">
              <Package className="mr-2 h-5 w-5" /> Continue Shopping
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading confirmation...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  )
}

    