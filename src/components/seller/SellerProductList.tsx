
"use client";

import Image from 'next/image';
import type { Product } from '@/lib/types'; // Product type should not have 'status' at 2ebea387
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DEFAULT_PRODUCT_IMAGE_ADMIN = 'https://placehold.co/100x100.png';

interface ProductForClientList extends Product {
  deleteAction: () => Promise<{ success: boolean; message: string }>;
}

interface SellerProductListProps {
  products: ProductForClientList[];
}

export default function SellerProductList({ products }: SellerProductListProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDeleteProduct = async (productName: string, action: () => Promise<{ success: boolean; message: string }>) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }
    startTransition(async () => {
      const result = await action();
      if (result.success) {
        toast({
          title: 'Product Deleted',
          description: result.message,
        });
      } else {
        toast({
          title: 'Error Deleting Product',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };

  if (!products || products.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No products found in inventory.</p>;
  }

  return (
    <TooltipProvider>
      <div className="rounded-md border shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              {/* No Status column for 2ebea387 baseline */}
              <TableHead className="text-center w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative h-16 w-16 overflow-hidden rounded-md">
                    <Image
                      src={product.imageUrl || DEFAULT_PRODUCT_IMAGE_ADMIN}
                      alt={product.name || 'Product image'}
                      fill
                      sizes="64px"
                      className="object-cover"
                      data-ai-hint={product.dataAiHint || product.name?.toLowerCase().split(' ').slice(0,2).join(' ') || 'product item'}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name || 'Unnamed Product'}</TableCell>
                <TableCell>{product.category || 'Uncategorized'}</TableCell>
                <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  {product.stock <= 0 ? (
                    <span className="text-destructive font-semibold">Out of Stock ({product.stock})</span>
                  ) : product.stock < 10 ? (
                    <span className="text-orange-600 font-semibold">Low Stock ({product.stock})</span>
                  ) : (
                    product.stock
                  )}
                </TableCell>
                {/* No Status display cell */}
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/products/${product.id}`} target="_blank">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Product</span>
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Product (Public Page)</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/seller/inventory/edit/${product.id}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit Product</span>
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Product</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteProduct(product.name || 'this product', product.deleteAction)}
                          disabled={isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete Product</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Product (Permanent)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
