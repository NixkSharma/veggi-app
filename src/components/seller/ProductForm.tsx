
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { CategoryWithId, Product } from "@/lib/types";
import { useEffect, useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { ProductFormData } from "@/actions/productActions"; // Import shared type

// Zod schema for product form validation (can be same as server-side if no client-specific needs)
const clientProductFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0.01, "Price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  imageUrl: z.string().url("Invalid URL format").optional().nullable(),
  categoryId: z.coerce.number({invalid_type_error: "Category is required"}).int().positive("Category is required"),
  dataAiHint: z.string().optional().nullable(),
});


interface ProductFormProps {
  initialData?: Product | null;
  categories: CategoryWithId[];
  formAction: (data: ProductFormData) => Promise<{ success: boolean; message: string; errors?: any }>;
  formType: "add" | "edit";
  productId?: number; // Only for edit mode, used to construct success message or for optimistic updates if needed
}

export default function ProductForm({
  initialData,
  categories,
  formAction,
  formType,
  productId
}: ProductFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(clientProductFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
      imageUrl: initialData?.imageUrl || "",
      categoryId: initialData?.categoryId || undefined, // Set categoryId from initialData
      dataAiHint: initialData?.dataAiHint || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      // Find categoryId based on category name if initialData.categoryId is not directly available
      // This logic depends on how initialData populates categoryId.
      // If initialData.category is the name and categories have ids:
      const currentCategory = categories.find(cat => cat.name === initialData.category);
      
      form.reset({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || 0,
        stock: initialData.stock || 0,
        imageUrl: initialData.imageUrl || "",
        categoryId: initialData.categoryId ?? (currentCategory ? currentCategory.id : undefined),
        dataAiHint: initialData.dataAiHint || "",
      });
    }
  }, [initialData, categories, form]);


  async function onSubmit(data: ProductFormData) {
    startTransition(async () => {
      const result = await formAction(data);
      if (result.success) {
        toast({
          title: formType === "add" ? "Product Added!" : "Product Updated!",
          description: result.message,
        });
        router.push("/seller/inventory"); // Navigate back to inventory list
        router.refresh(); // Force refresh to see changes
      } else {
        toast({
          title: formType === "add" ? "Failed to Add Product" : "Failed to Update Product",
          description: result.message || "An error occurred.",
          variant: "destructive",
        });
        // Handle field-specific errors from Zod if returned by server action
        if (result.errors) {
          Object.keys(result.errors).forEach((key) => {
            const fieldName = key as keyof ProductFormData;
            const message = result.errors[fieldName]?.join(", ") || "Invalid input";
            form.setError(fieldName, { type: "server", message });
          });
        }
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6 border rounded-lg shadow-sm">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Organic Carrots" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Detailed description of the product..." {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="e.g., 2.99" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input type="number" step="1" placeholder="e.g., 100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.png" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value,10))} defaultValue={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="dataAiHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Image Hint (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., carrot bunch organic (1-2 words)" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {formType === "add" ? "Add Product" : "Update Product"}
        </Button>
      </form>
    </Form>
  );
}
