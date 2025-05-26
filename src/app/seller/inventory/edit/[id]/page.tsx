
import { Suspense } from 'react';
import ProductForm from '@/components/seller/ProductForm';
import { getProductById, getCategoriesWithIds } from '@/lib/products';
import { Skeleton } from '@/components/ui/skeleton';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { headers } from 'next/headers'; // For dynamic rendering context
import { updateProductAction, ProductFormData } from '@/actions/productActions'; // Import ProductFormData

export const dynamic = 'force-dynamic';

interface EditProductPageProps {
  params: { id: string };
}

async function EditProductPageData({ params }: EditProductPageProps) {
  headers(); // Opt-in to dynamic rendering
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    // console.warn("EditProductPageData: Unauthorized access attempt. User:", session?.user);
    redirect(`/login?callbackUrl=/seller/inventory/edit/${params.id}`);
  }
  const adminUserId = session.user.id;

  const productId = parseInt(params.id, 10);
  if (isNaN(productId)) {
    notFound();
  }

  const [product, categories] = await Promise.all([
    getProductById(productId),
    getCategoriesWithIds(),
  ]);

  if (!product) {
    notFound();
  }
  
  // This server action is created in the scope of the Page Server Component
  // It captures adminUserId and productId from this server-side scope.
  async function handleUpdateProductWithAuth(data: ProductFormData) {
    "use server"; // This inner function is also a server action
    return updateProductAction(adminUserId, productId, data);
  }

  return (
    <ProductForm
      initialData={product}
      categories={categories}
      formAction={handleUpdateProductWithAuth}
      formType="edit"
      productId={productId}
    />
  );
}

const EditProductPageSkeleton = () => (
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


export default function EditProductPage({ params }: EditProductPageProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <Suspense fallback={<EditProductPageSkeleton />}>
        <EditProductPageData params={params} />
      </Suspense>
    </div>
  );
}
