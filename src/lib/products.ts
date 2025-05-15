
import type { Product } from '@/lib/types';
import prisma from './prisma';

const DEFAULT_PLACEHOLDER_IMAGE = 'https://placehold.co/600x400.png';

// Helper function to map Prisma Product to our app's Product type
const mapPrismaProductToAppProduct = (prismaProduct: any): Product => {
  return {
    id: prismaProduct.id, // Prisma ID is Int
    name: prismaProduct.name,
    description: prismaProduct.description,
    price: prismaProduct.price.toNumber(), // Convert Decimal to number
    imageUrl: prismaProduct.imageUrl || DEFAULT_PLACEHOLDER_IMAGE,
    category: prismaProduct.category?.name || 'Uncategorized', // Get category name
    stock: prismaProduct.stock,
    dataAiHint: prismaProduct.dataAiHint || prismaProduct.name.toLowerCase().split(' ').slice(0,2).join(' ') || 'vegetable',
  };
};

export const getProducts = async (searchTerm?: string, categoryName?: string): Promise<Product[]> => {
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

  const prismaProducts = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: true, // Include category data to get the name
    },
    orderBy: {
      name: 'asc',
    }
  });

  return prismaProducts.map(mapPrismaProductToAppProduct);
};

export const getProductById = async (id: number): Promise<Product | undefined> => {
  if (isNaN(id)) return undefined;

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
};

export const getCategories = async (): Promise<string[]> => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  });
  return ["All", ...categories.map(c => c.name)];
};
