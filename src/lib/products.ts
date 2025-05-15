
import type { Product } from '@/lib/types';
import prisma from './prisma';

const DEFAULT_PLACEHOLDER_IMAGE = 'https://placehold.co/600x400.png';

// Helper function to map Prisma Product to our app's Product type
const mapPrismaProductToAppProduct = (prismaProduct: any): Product => {
  return {
    id: prismaProduct.id,
    name: prismaProduct.name,
    description: prismaProduct.description,
    price: prismaProduct.price.toNumber ? prismaProduct.price.toNumber() : parseFloat(prismaProduct.price), // Handle both Decimal and number
    imageUrl: prismaProduct.imageUrl || DEFAULT_PLACEHOLDER_IMAGE,
    category: prismaProduct.category?.name || prismaProduct.category || 'Uncategorized', // Handle direct category string for mock
    stock: prismaProduct.stock,
    dataAiHint: prismaProduct.dataAiHint || prismaProduct.name?.toLowerCase().split(' ').slice(0,2).join(' ') || 'vegetable',
  };
};

// --- Mock Data ---
const mockCategoriesData: string[] = ["All", "Fresh Veggies", "Leafy Greens", "Root Vegetables", "Fruits"];

const mockProductsData: Product[] = [
  { id: 1, name: 'Mock Carrot', description: 'Crunchy mock carrots.', price: 1.99, imageUrl: 'https://placehold.co/600x400.png?text=Mock+Carrot', category: 'Root Vegetables', stock: 100, dataAiHint: 'carrot mock' },
  { id: 2, name: 'Mock Spinach', description: 'Fresh mock spinach leaves.', price: 2.49, imageUrl: 'https://placehold.co/600x400.png?text=Mock+Spinach', category: 'Leafy Greens', stock: 50, dataAiHint: 'spinach mock' },
  { id: 3, name: 'Mock Tomato', description: 'Juicy mock tomatoes.', price: 3.00, imageUrl: 'https://placehold.co/600x400.png?text=Mock+Tomato', category: 'Fruits', stock: 75, dataAiHint: 'tomato mock' },
  { id: 4, name: 'Mock Broccoli', description: 'Fresh mock broccoli florets.', price: 2.79, imageUrl: 'https://placehold.co/600x400.png?text=Mock+Broccoli', category: 'Fresh Veggies', stock: 0, dataAiHint: 'broccoli mock' }, // Out of stock example
];
// --- End Mock Data ---

export const getProducts = async (searchTerm?: string, categoryName?: string): Promise<Product[]> => {
  if (process.env.USE_MOCK_DATA === 'true') {
    console.log("USING MOCK DATA for getProducts");
    let products = mockProductsData;
    if (searchTerm) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryName && categoryName !== "All") {
      products = products.filter(p => p.category === categoryName);
    }
    return products.map(p => ({...p, imageUrl: p.imageUrl || DEFAULT_PLACEHOLDER_IMAGE })); // Ensure imageUrl for mock
  }

  const whereClause: any = {};

  if (searchTerm) {
    whereClause.OR = [
      { name: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }

  if (categoryName && categoryName !== "All") {
    whereClause.category = {
      name: categoryName,
    };
  }

  try {
    const prismaProducts = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true, 
      },
      orderBy: {
        name: 'asc',
      }
    });
    return prismaProducts.map(mapPrismaProductToAppProduct);
  } catch (error) {
    console.error("Prisma error in getProducts:", error);
    // In a real app, you might want to throw the error or handle it differently
    // For now, returning an empty array if Prisma fails (e.g. libssl error)
    return [];
  }
};

export const getProductById = async (id: number): Promise<Product | undefined> => {
  if (process.env.USE_MOCK_DATA === 'true') {
    console.log(`USING MOCK DATA for getProductById: ${id}`);
    const product = mockProductsData.find(p => p.id === id);
    if (product) {
      return {...product, imageUrl: product.imageUrl || DEFAULT_PLACEHOLDER_IMAGE }; // Ensure imageUrl for mock
    }
    return undefined;
  }

  if (isNaN(id)) return undefined;

  try {
    const prismaProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!prismaProduct) {
      return undefined;
    }
    return mapPrismaProductToAppProduct(prismaProduct);
  } catch (error) {
    console.error(`Prisma error in getProductById for ID ${id}:`, error);
    return undefined;
  }
};

export const getCategories = async (): Promise<string[]> => {
  if (process.env.USE_MOCK_DATA === 'true') {
    console.log("USING MOCK DATA for getCategories");
    return mockCategoriesData;
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    return ["All", ...categories.map(c => c.name)];
  } catch (error) {
    console.error("Prisma error in getCategories:", error);
    return ["All"]; // Fallback for error
  }
};
