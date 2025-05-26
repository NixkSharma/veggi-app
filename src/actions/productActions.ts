
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { Prisma } from '@prisma/client'; // Import Prisma for Decimal
import { headers } from 'next/headers'; // For dynamic context in Server Actions
import { getAuth } from "@clerk/nextjs/server"; // For Clerk auth in server actions

// Zod schema for product form validation
const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0.01, "Price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  imageUrl: z.string().url("Invalid URL format").optional().nullable(),
  categoryId: z.coerce.number({invalid_type_error: "Category is required"}).int().positive("Category is required"),
  dataAiHint: z.string().optional().nullable(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

export async function addProductAction(authUserId: string, data: ProductFormData) {
  const adminUserIdEnv = process.env.ADMIN_USER_ID;

  if (!authUserId || authUserId !== adminUserIdEnv) {
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
        price: new Prisma.Decimal(validatedData.price),
        description: validatedData.description || null,
        imageUrl: validatedData.imageUrl || null,
        dataAiHint: validatedData.dataAiHint || (validatedData.name ? validatedData.name.toLowerCase().split(' ').slice(0,2).join(' ') : null),
        vendorId: authUserId, // Link product to the admin user
        // No status field based on commit 2ebea387 schema
      },
    });

    revalidatePath("/seller/inventory");
    revalidatePath("/dashboard"); // Consumer dashboard
    // No explicit redirect here; form page will handle it based on return
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
}


export async function updateProductAction(authUserId: string, productId: number, data: ProductFormData) {
  const adminUserIdEnv = process.env.ADMIN_USER_ID;

  if (!authUserId || authUserId !== adminUserIdEnv) {
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
        // No status field based on commit 2ebea387 schema
      },
    });

    revalidatePath("/seller/inventory");
    revalidatePath(`/products/${productId}`);
    revalidatePath("/dashboard");
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

// Renamed from archiveProductAction for clarity as it's a hard delete now
export async function deleteProductAction(authUserId: string, productId: number) {
  const adminUserIdEnv = process.env.ADMIN_USER_ID;
  console.log("[deleteProductAction] Auth User ID:", authUserId, "Product ID:", productId, "Admin ID Env:", adminUserIdEnv);


  if (!authUserId || authUserId !== adminUserIdEnv) {
    console.error("[deleteProductAction] Unauthorized attempt. Provided authUserId:", authUserId);
    return { success: false, message: "Unauthorized: Only admins can delete products." };
  }

  if (!productId) {
    return { success: false, message: "Product ID is missing." };
  }

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return { success: false, message: "Product not found." };
    }

    // Hard delete based on commit 2ebea387 (no status field)
    await prisma.product.delete({
      where: { id: productId },
    });

    console.log(`[deleteProductAction] Product ${product.name} deleted successfully.`);
    revalidatePath("/seller/inventory");
    revalidatePath("/dashboard"); // Revalidate consumer dashboard as product is removed

    return { success: true, message: `Product ${product.name} deleted successfully.` };

  } catch (error) {
    console.error("[deleteProductAction] Error deleting product:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return { success: false, message: "Product not found for deletion." };
    }
    return { success: false, message: "Failed to delete product." };
  }
}
