
import type { Product, CategoryWithId } from '@/lib/types';
import prisma from './prisma';

const DEFAULT_PLACEHOLDER_IMAGE = 'https://placehold.co/600x400.png';

// Helper function to map Prisma Product to our app's Product type
const mapPrismaProductToAppProduct = (prismaProduct: any): Product => {
  return {
    id: prismaProduct.id,
    name: prismaProduct.name,
    description: prismaProduct.description,
    price: prismaProduct.price.toNumber ? prismaProduct.price.toNumber() : parseFloat(prismaProduct.price),
    imageUrl: prismaProduct.imageUrl || DEFAULT_PLACEHOLDER_IMAGE,
    category: prismaProduct.category?.name || 'Uncategorized',
    stock: prismaProduct.stock,
    dataAiHint: prismaProduct.dataAiHint || prismaProduct.name?.toLowerCase().split(' ').slice(0,2).join(' ') || 'vegetable',
    // Ensure status is mapped if it exists on prismaProduct and is expected in Product type
    // status: prismaProduct.status || 'ACTIVE', // Example if status field were present
  };
};

export const getProducts = async (searchTerm?: string, categoryName?: string): Promise<Product[]> => {
  console.log(`getProducts called with searchTerm: "${searchTerm}", categoryName: "${categoryName}"`);
  console.log("Attempting to fetch products from Prisma");
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
  // If the status field is present in your Prisma schema for Product:
  // whereClause.status = 'ACTIVE'; // Only fetch active products for the public site.
  // For now, assuming status field is not yet reliably in the schema or client based on previous errors.
  // If 'status' causes 'Unknown argument `status`' error, it means Product model in schema.prisma or generated client is not up-to-date.

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
    console.log(`Prisma fetched ${prismaProducts.length} products.`);
    return prismaProducts.map(mapPrismaProductToAppProduct);
  } catch (error) {
    console.error("Prisma error in getProducts:", error);
    return []; 
  }
};

export const getProductById = async (id: number): Promise<Product | undefined> => {
  console.log(`getProductById called with id: ${id}`);
  
  console.log(`Attempting to fetch product by ID from Prisma: ${id}`);
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
      console.log(`Prisma: Product with ID ${id} not found.`);
      return undefined;
    }
    console.log(`Prisma: Product with ID ${id} found.`);
    return mapPrismaProductToAppProduct(prismaProduct);
  } catch (error) {
    console.error(`Prisma error in getProductById for ID ${id}:`, error);
    return undefined;
  }
};

// Existing function to get category names as strings
export const getCategories = async (): Promise<string[]> => {
  console.log("getCategories called.");
  console.log("Attempting to fetch category names from Prisma");
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    console.log(`Prisma fetched ${categories.length} category names.`);
    return ["All", ...categories.map(c => c.name)];
  } catch (error) {
    console.error("Prisma error in getCategories (string array):", error);
    return ["All"]; 
  }
};

// Function to get categories with IDs and image URLs
export const getCategoriesWithIds = async (): Promise<CategoryWithId[]> => {
  console.log("getCategoriesWithIds called.");
  console.log("Attempting to fetch detailed categories from Prisma");
  try {
    const prismaCategories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    console.log(`Prisma fetched ${prismaCategories.length} detailed categories.`);
    return prismaCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      imageUrl: cat.imageUrl || 'https://placehold.co/200x150.png', 
      dataAiHint: cat.name ? (cat.name.toLowerCase() || 'category item') : 'category item' // Defensive check for cat.name
    }));
  } catch (error) {
    console.error("Prisma error in getCategoriesWithIds (detailed objects):", error);
    return []; 
  }
};
