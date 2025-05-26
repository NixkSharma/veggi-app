
import type { ProductStatus as PrismaProductStatus, UserRole as PrismaUserRole, OrderStatus as PrismaOrderStatus, PaymentStatus as PrismaPaymentStatus } from '@prisma/client';
import type { Session as NextAuthSession, User as NextAuthUser } from 'next-auth';
import type { JWT as NextAuthJWT } from 'next-auth/jwt';


export type ProductStatus = PrismaProductStatus;
export type UserRole = PrismaUserRole;
export type OrderStatus = PrismaOrderStatus;
export type PaymentStatus = PrismaPaymentStatus;


export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: string; // Category name
  categoryId?: number | null; // Optional: for forms
  stock: number;
  dataAiHint?: string | null; // Added
  status: ProductStatus;
  vendorId?: string | null;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CategoryWithId = {
  id: number;
  name: string;
  imageUrl: string | null;
  dataAiHint?: string | null; // Added
};

// Augment NextAuth types
declare module 'next-auth' {
  interface Session extends NextAuthSession {
    user: {
      id: string;
      role: UserRole;
      // include other properties you want on session.user
    } & NextAuthSession['user']; // Keep existing User properties
  }

  interface User extends NextAuthUser {
    // Add custom properties to the User object returned by the authorize callback
    // and used in JWT and session callbacks
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends NextAuthJWT {
    // Add custom properties to the JWT
    id: string;
    role: UserRole;
  }
}


// Used for product form data
export interface ProductFormData {
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  imageUrl?: string | null;
  categoryId: number;
  dataAiHint?: string | null;
  status?: ProductStatus; 
}

export interface GetProductsOptions {
  isAdminView?: boolean;
}

// For auth registration form
export interface RegisterFormData {
  name: string;
  email: string;
  passwordHash: string; // This will be the hashed password
}
