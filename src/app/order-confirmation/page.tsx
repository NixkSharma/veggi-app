
"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle, Package } from 'lucide-react';
import type { CartItem } from '@/lib/types'; // Assuming AddressFormData is also in types or defined here
import Image from 'next/image';

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

interface Order {
  id: string;
  timestamp: string;
  deliveryDetails: AddressFormData;
  items: CartItem[];
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
      const storedOrders = JSON.parse(localStorage.getItem('veggieDashOrders') || '[]');
      const currentOrder = storedOrders.find((o: Order) => o.id === orderId);
      setOrder(currentOrder || null);
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
          <Link href="/">Continue Shopping</Link>
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
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        fill 
                        sizes="50px" 
                        className="object-cover"
                        data-ai-hint={item.product.dataAiHint || 'vegetable item'}
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
            <Link href="/">
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

