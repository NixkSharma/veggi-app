
import type { ProductStatus as PrismaProductStatus, UserRole as PrismaUserRole } from '@prisma/client';

export type ProductStatus = PrismaProductStatus;
export type UserRole = PrismaUserRole;


export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: string; // Category name
  categoryId?: number | null; // Optional: for forms
  stock: number;
  dataAiHint?: string;
  status: ProductStatus; // Added for soft deletes
  vendorId?: string | null; // Added to link product to a User (admin/seller)
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CategoryWithId = {
  id: number;
  name: string;
  imageUrl: string | null;
  dataAiHint?: string;
};

// For NextAuth session object augmentation
// This helps TypeScript understand the custom properties we add to the session
// Ensure this matches what's in authOptions.ts callbacks
// declare module 'next-auth' {
//   interface Session {
//     user: {
//       id: string;
//       role: UserRole;
//     } & DefaultSession['user'];
//   }
//   interface User { // This is the user object passed to JWT and session callbacks
//     role: UserRole;
//   }
// }

// declare module 'next-auth/jwt' {
//   interface JWT {
//     id: string;
//     role: UserRole;
//   }
// }


// Used for product form data
export interface ProductFormData {
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  imageUrl?: string | null;
  categoryId: number;
  dataAiHint?: string | null;
  status?: ProductStatus; // Optional, defaults to ACTIVE on creation
}

// Options for fetching products
export interface GetProductsOptions {
  isAdminView?: boolean;
}
