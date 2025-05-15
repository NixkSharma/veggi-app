
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

const addressSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).regex(/^\+?[0-9\s-()]*$/, "Invalid phone number format"),
  streetAddress: z.string().min(5, { message: "Street address is too short." }),
  city: z.string().min(2, { message: "City name is too short." }),
  postalCode: z.string().min(4, { message: "Postal code is too short." }),
  country: z.string().min(2, { message: "Country name is too short." }),
  notes: z.string().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface CheckoutFormProps {
  totalAmount: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ totalAmount }) => {
  const { clearCart, cartItems } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      streetAddress: "",
      city: "",
      postalCode: "",
      country: "",
      notes: "",
    },
  });

  function onSubmit(data: AddressFormData) {
    // In a real app, this would submit to a backend
    console.log("Order placed:", { deliveryDetails: data, items: cartItems, total: totalAmount });
    
    // Simulate order placement and store in local storage
    const order = {
      id: `order_${new Date().getTime()}`, // Simple unique ID
      timestamp: new Date().toISOString(),
      deliveryDetails: data,
      items: cartItems,
      totalAmount,
      status: "Pending"
    };

    // Store order in local storage (for demonstration)
    const existingOrders = JSON.parse(localStorage.getItem('veggieDashOrders') || '[]');
    localStorage.setItem('veggieDashOrders', JSON.stringify([...existingOrders, order]));
    
    clearCart();
    toast({
      title: "Order Placed Successfully!",
      description: "Thank you for your purchase. Your vegetables are on their way!",
    });
    router.push("/order-confirmation?orderId=" + order.id); // Redirect to an order confirmation page
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Delivery Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+1 234 567 8900" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Veggie Lane" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Greenville" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="United States" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., leave at front door" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <p className="text-sm text-muted-foreground">
              Payment will be mocked for this demo. Total: <span className="font-semibold text-foreground">${totalAmount.toFixed(2)}</span>
            </p>
            <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Place Order
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
