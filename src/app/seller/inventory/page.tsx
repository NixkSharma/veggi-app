
import { Suspense } from 'react';
import { getProducts, GetProductsOptions } from '@/lib/products'; // Ensure GetProductsOptions is imported if used
import SellerProductList from '@/components/seller/SellerProductList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { headers } from 'next/headers'; // For dynamic rendering context
import { getAuth } from 'next-auth/react'; // Incorrect, use getServerSession
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic'; // Ensure page is dynamically rendered

async function InventoryData() {
  headers(); // Opt-in to dynamic rendering for reliable getAuth/getServerSession
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'ADMIN') {
    // This check might be redundant if middleware handles it, but good for safety.
    // console.warn("InventoryData: Unauthorized access attempt. User:", session?.user);
    redirect('/login?callbackUrl=/seller/inventory'); 
  }

  // For admin view, fetch all products including archived ones
  const products = await getProducts({ isAdminView: true });
  
  return <SellerProductList products={products} />;
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
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[150px]">Actions</th>
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
                <td className="p-4 align-middle"><Skeleton className="h-6 w-20" /></td>
                <td className="p-4 align-middle"><div className="flex space-x-2"><Skeleton className="h-8 w-8" /><Skeleton className="h-8 w-8" /></div></td>
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
