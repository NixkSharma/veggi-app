
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { ProductStatus } from "@prisma/client"; // Import ProductStatus
import { headers } from 'next/headers'; // For dynamic context in getAuth calls
import { getServerSession } from "next-auth/next"; // For getting session in Server Actions
import { authOptions } from "@/lib/authOptions";   // Your auth options

// Zod schema for product form validation
const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0.01, "Price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  imageUrl: z.string().url("Invalid URL format").optional().nullable(),
  categoryId: z.coerce.number().int().positive("Category is required"),
  dataAiHint: z.string().optional().nullable(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;


export async function addProductAction(authUserId: string, data: ProductFormData) {
  // Authorization: Ensure user is admin - passed authUserId should be admin's
  if (!authUserId || authUserId !== process.env.ADMIN_USER_ID) {
    return { success: false, message: "Unauthorized: Only admins can add products." };
  }

  const validation = productFormSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data.", errors: validation.error.flatten().fieldErrors };
  }
  const validatedData = validation.data;

  try {
    await prisma.product.create({
      data: {
        ...validatedData,
        price: new Prisma.Decimal(validatedData.price), // Convert to Decimal
        description: validatedData.description || null,
        imageUrl: validatedData.imageUrl || null,
        dataAiHint: validatedData.dataAiHint || (validatedData.name ? validatedData.name.toLowerCase().split(' ').slice(0,2).join(' ') : null),
        vendorId: authUserId, // Link product to the admin user
        status: ProductStatus.ACTIVE, // New products are active by default
      },
    });

    revalidatePath("/seller/inventory");
    revalidatePath("/dashboard");
    // Don't redirect here, let the page handle it or return success
    return { success: true, message: "Product added successfully." };

  } catch (error) {
    console.error("Error adding product:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002' && error.meta?.target === 'Product_name_key') {
        return { success: false, message: "A product with this name already exists." };
      }
    }
    return { success: false, message: "Failed to add product." };
  }
  // No explicit redirect here; form page will handle it based on return
}


export async function updateProductAction(authUserId: string, productId: number, data: ProductFormData) {
 // Authorization
  if (!authUserId || authUserId !== process.env.ADMIN_USER_ID) {
    return { success: false, message: "Unauthorized: Only admins can update products." };
  }

  const validation = productFormSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data.", errors: validation.error.flatten().fieldErrors };
  }
  const validatedData = validation.data;

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        ...validatedData,
        price: new Prisma.Decimal(validatedData.price),
        description: validatedData.description || null,
        imageUrl: validatedData.imageUrl || null,
        dataAiHint: validatedData.dataAiHint || (validatedData.name ? validatedData.name.toLowerCase().split(' ').slice(0,2).join(' ') : null),
        // vendorId is not updated here, assuming it's fixed once set
        // status is not updated here directly, use archiveProductAction for that
      },
    });

    revalidatePath("/seller/inventory");
    revalidatePath(`/products/${productId}`);
    revalidatePath("/dashboard");
    // No explicit redirect here; form page will handle it based on return
    return { success: true, message: "Product updated successfully." };

  } catch (error) {
    console.error("Error updating product:", error);
     if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002' && error.meta?.target === 'Product_name_key') {
        return { success: false, message: "A product with this name already exists." };
      }
      if (error.code === 'P2025') {
         return { success: false, message: "Product not found for update." };
      }
    }
    return { success: false, message: "Failed to update product." };
  }
}

export async function archiveProductAction(authUserId: string, productId: number) {
  // This action is now called with authUserId and productId pre-bound by the page server component

  if (!authUserId || authUserId !== process.env.ADMIN_USER_ID) {
    return { success: false, message: "Unauthorized: Only admins can archive products." };
  }

  if (!productId) {
    return { success: false, message: "Product ID is missing." };
  }

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return { success: false, message: "Product not found." };
    }

    // Toggle status or just archive
    const newStatus = product.status === ProductStatus.ACTIVE ? ProductStatus.ARCHIVED : ProductStatus.ACTIVE;

    await prisma.product.update({
      where: { id: productId },
      data: { status: newStatus },
    });

    revalidatePath("/seller/inventory");
    revalidatePath(`/products/${productId}`);
    revalidatePath("/dashboard"); // Revalidate consumer dashboard as product status changes

    return { success: true, message: `Product ${product.name} status updated to ${newStatus}.` };

  } catch (error) {
    console.error("Error archiving product:", error);
    return { success: false, message: "Failed to archive product." };
  }
}
