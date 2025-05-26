
import type { Product, CategoryWithId, GetProductsOptions } from '@/lib/types';
import prisma from './prisma';
import type { Prisma, ProductStatus as PrismaProductStatus } from '@prisma/client'; // Import ProductStatus

const DEFAULT_PLACEHOLDER_IMAGE = 'https://placehold.co/600x400.png';

// Helper function to map Prisma Product to our app's Product type
const mapPrismaProductToAppProduct = (prismaProduct: any): Product => {
  return {
    id: prismaProduct.id,
    name: prismaProduct.name || 'Unnamed Product',
    description: prismaProduct.description,
    price: prismaProduct.price.toNumber ? prismaProduct.price.toNumber() : parseFloat(prismaProduct.price),
    imageUrl: prismaProduct.imageUrl || DEFAULT_PLACEHOLDER_IMAGE,
    category: prismaProduct.category?.name || 'Uncategorized',
    stock: prismaProduct.stock,
    dataAiHint: prismaProduct.dataAiHint || prismaProduct.name?.toLowerCase().split(' ').slice(0,2).join(' ') || 'vegetable',
    status: prismaProduct.status as PrismaProductStatus, // Map status
    vendorId: prismaProduct.vendorId,
  };
};

export const getProducts = async (
  options?: GetProductsOptions,
  searchTerm?: string,
  categoryName?: string
): Promise<Product[]> => {
  // console.log(`getProducts called with options: ${JSON.stringify(options)}, searchTerm: "${searchTerm}", categoryName: "${categoryName}"`);
  
  const whereClause: Prisma.ProductWhereInput = {};

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

  // Filter by status for consumer view, not for admin view
  if (options && !options.isAdminView) {
    whereClause.status = 'ACTIVE';
  }
  // For admin view (isAdminView: true or options undefined), no status filter is applied here,
  // so all products (ACTIVE and ARCHIVED) are fetched based on other criteria.

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
    // console.log(`Prisma fetched ${prismaProducts.length} products.`);
    return prismaProducts.map(mapPrismaProductToAppProduct);
  } catch (error) {
    console.error("Prisma error in getProducts:", error);
    return []; 
  }
};

export const getProductById = async (id: number): Promise<Product | undefined> => {
  // console.log(`getProductById called with id: ${id}`);
  
  if (isNaN(id)) {
    console.error("getProductById: Invalid ID provided (NaN)");
    return undefined;
  }

  try {
    const prismaProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!prismaProduct) {
      // console.log(`Prisma: Product with ID ${id} not found.`);
      return undefined;
    }
    // console.log(`Prisma: Product with ID ${id} found.`);
    return mapPrismaProductToAppProduct(prismaProduct);
  } catch (error) {
    console.error(`Prisma error in getProductById for ID ${id}:`, error);
    return undefined;
  }
};

// Function to get categories with IDs and image URLs
export const getCategoriesWithIds = async (): Promise<CategoryWithId[]> => {
  // console.log("getCategoriesWithIds called.");
  try {
    const prismaCategories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    // console.log(`Prisma fetched ${prismaCategories.length} detailed categories.`);
    return prismaCategories.map(cat => ({
      id: cat.id,
      name: cat.name || 'Unnamed Category', 
      imageUrl: cat.imageUrl || `https://placehold.co/200x150.png?text=${encodeURIComponent(cat.name || 'Category')}`, 
      dataAiHint: cat.dataAiHint || (cat.name ? cat.name.toLowerCase().split(' ').slice(0,2).join(' ') : 'category item') || 'category item'
    }));
  } catch (error) {
    console.error("Prisma error in getCategoriesWithIds (detailed objects):", error);
    return []; 
  }
};

// Existing function to get category names as strings - can be deprecated if not used elsewhere
export const getCategories = async (): Promise<string[]> => {
  // console.log("getCategories called for string array.");
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    // console.log(`Prisma fetched ${categories.length} category names for string array.`);
    return ["All", ...categories.map(c => c.name || 'Unnamed Category')];
  } catch (error) {
    console.error("Prisma error in getCategories (string array):", error);
    return ["All"]; 
  }
};
