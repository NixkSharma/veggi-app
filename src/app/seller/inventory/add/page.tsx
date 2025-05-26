
import { Suspense } from 'react';
import ProductForm from '@/components/seller/ProductForm';
import { getCategoriesWithIds } from '@/lib/products';
import { Skeleton } from '@/components/ui/skeleton';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers'; // For dynamic rendering context
import { addProductAction, ProductFormData } from '@/actions/productActions'; // Import ProductFormData

export const dynamic = 'force-dynamic'; // Ensure page is dynamically rendered

async function AddProductPageData() {
  headers(); // Opt-in to dynamic rendering for reliable getServerSession
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    // console.warn("AddProductPageData: Unauthorized access attempt. User:", session?.user);
    redirect('/login?callbackUrl=/seller/inventory/add');
  }
  
  const adminUserId = session.user.id; // This is the admin's user ID from the session

  const categories = await getCategoriesWithIds();

  // This server action is created in the scope of the Page Server Component
  // It captures adminUserId from this server-side scope.
  async function handleAddProductWithAuth(data: ProductFormData) {
    "use server"; // This inner function is also a server action
    return addProductAction(adminUserId, data);
  }

  return (
    <ProductForm
      categories={categories}
      formAction={handleAddProductWithAuth}
      formType="add"
    />
  );
}

const AddProductPageSkeleton = () => (
  <div className="max-w-2xl mx-auto space-y-6">
    <Skeleton className="h-8 w-1/3" /> {/* Title skeleton */}
    <div className="space-y-4 p-6 border rounded-lg">
      <Skeleton className="h-4 w-1/4 mb-1" /> {/* Label */}
      <Skeleton className="h-10 w-full" />   {/* Input */}
      <Skeleton className="h-4 w-1/4 mb-1" /> {/* Label */}
      <Skeleton className="h-20 w-full" />  {/* Textarea */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-4 w-1/3 mb-1" /> {/* Label */}
          <Skeleton className="h-10 w-full" />   {/* Input */}
        </div>
        <div>
          <Skeleton className="h-4 w-1/3 mb-1" /> {/* Label */}
          <Skeleton className="h-10 w-full" />   {/* Input */}
        </div>
      </div>
      <Skeleton className="h-4 w-1/4 mb-1" /> {/* Label */}
      <Skeleton className="h-10 w-full" />   {/* Input */}
      <Skeleton className="h-4 w-1/4 mb-1" /> {/* Label */}
      <Skeleton className="h-10 w-full" />   {/* Select */}
       <Skeleton className="h-4 w-1/4 mb-1" /> {/* Label */}
      <Skeleton className="h-10 w-full" />   {/* Input */}
      <Skeleton className="h-10 w-full mt-4" /> {/* Button */}
    </div>
  </div>
);

export default function AddProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <Suspense fallback={<AddProductPageSkeleton />}>
        <AddProductPageData />
      </Suspense>
    </div>
  );
}
