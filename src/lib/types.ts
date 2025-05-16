
export type Product = {
  id: number; // Changed from string to number to match Prisma's Int type for SERIAL
  name: string;
  description: string | null; // Can be null from DB
  price: number; // Will be converted from Decimal
  imageUrl: string | null; // Can be null from DB
  category: string; // Will be the category name
  stock: number;
  dataAiHint?: string; // For placeholder image search keywords, remains optional
};

export type CartItem = {
  product: Product;
  quantity: number;
};

// Added for fetching categories with their IDs and images
export type CategoryWithId = {
  id: number;
  name: string;
  imageUrl: string | null;
  dataAiHint?: string;
};
