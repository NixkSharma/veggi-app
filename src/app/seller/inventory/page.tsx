
import { Suspense } from 'react';
import { getProducts, GetProductsOptions } from '@/lib/products';
import SellerProductList from '@/components/seller/SellerProductList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getAuth } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Product } from '@/lib/types';
import { deleteProductAction } from '@/actions/productActions'; // Changed from archiveProductAction

export const dynamic = 'force-dynamic'; // Ensure page is dynamically rendered

interface ProductForClient extends Product {
  deleteAction: () => Promise<{ success: boolean; message: string }>;
}

async function InventoryData() {
  headers(); // Opt-in to dynamic rendering for reliable getAuth
  const { userId: adminUserIdFromAuth } = getAuth();
  const adminUserIdEnv = process.env.ADMIN_USER_ID;

  if (!adminUserIdFromAuth || adminUserIdFromAuth !== adminUserIdEnv) {
    console.warn("Unauthorized access attempt to /seller/inventory by user:", adminUserIdFromAuth);
    redirect('/sign-in?redirect_url=/seller/inventory'); 
  }

  // For admin view, fetch all products (no status filtering at 2ebea387)
  const products = await getProducts(); // At commit 2ebea387, getProducts fetches all

  const productsForClient: ProductForClient[] = products.map(product => {
    const deleteActionForThisProduct = deleteProductAction.bind(
      null,
      adminUserIdFromAuth!, 
      product.id    
    );
    return {
      ...product,
      deleteAction: deleteActionForThisProduct,
    };
  });
  
  return <SellerProductList products={productsForClient} />;
}

const SellerInventorySkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-10 w-48" /> {/* Title skeleton */}
      <Skeleton className="h-10 w-36" /> {/* Button skeleton */}
    </div>
    <div className="rounded-md border">
      <div className="w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[80px]">Image</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Stock</th>
              {/* No Status column for 2ebea387 baseline */}
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[200px]">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td className="p-4 align-middle"><Skeleton className="h-16 w-16 rounded" /></td>
                <td className="p-4 align-middle"><Skeleton className="h-4 w-3/4" /></td>
                <td className="p-4 align-middle"><Skeleton className="h-4 w-1/2" /></td>
                <td className="p-4 align-middle"><Skeleton className="h-4 w-1/4" /></td>
                <td className="p-4 align-middle"><Skeleton className="h-4 w-1/4" /></td>
                {/* No Status skeleton */}
                <td className="p-4 align-middle"><div className="flex space-x-2"><Skeleton className="h-8 w-8" /><Skeleton className="h-8 w-8" /><Skeleton className="h-8 w-8" /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default function SellerInventoryPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Product Inventory</h1>
          <p className="text-muted-foreground">Manage all your vegetable products here.</p>
        </div>
        <Button asChild>
          <Link href="/seller/inventory/add">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
          </Link>
        </Button>
      </header>
      <Suspense fallback={<SellerInventorySkeleton />}>
        <InventoryData />
      </Suspense>
    </div>
  );
}
