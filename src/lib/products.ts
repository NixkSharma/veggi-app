
import type { Product, CategoryWithId } from '@/lib/types';
import prisma from './prisma';

// If USE_MOCK_DATA is true, these functions will return mock data.
// Otherwise, they will fetch from the database.
// THIS IS A TEMPORARY WORKAROUND for Firebase Studio environment issues.
// For local development, ensure USE_MOCK_DATA is false or not set in your .env
const USE_MOCK_DATA_FLAG = process.env.USE_MOCK_DATA === 'true';

const DEFAULT_PLACEHOLDER_IMAGE = 'https://placehold.co/600x400.png';

const mockCategories: CategoryWithId[] = [
  { id: 1, name: 'Fresh Veggies', imageUrl: 'https://placehold.co/300x200.png?text=Fresh+Veggies', dataAiHint: 'fresh vegetables' },
  { id: 2, name: 'Leafy Greens', imageUrl: 'https://placehold.co/300x200.png?text=Leafy+Greens', dataAiHint: 'leafy greens salad' },
  { id: 3, name: 'Root Vegetables', imageUrl: 'https://placehold.co/300x200.png?text=Root+Vegetables', dataAiHint: 'root vegetables carrots' },
  { id: 4, name: 'Fruits', imageUrl: 'https://placehold.co/300x200.png?text=Fruits', dataAiHint: 'assorted fruits' },
];

const mockProducts: Product[] = [
  { id: 1, name: 'Organic Tomato', description: 'Ripe and juicy organic tomatoes.', price: 3.99, imageUrl: 'https://placehold.co/600x400.png', category: 'Fresh Veggies', stock: 50, dataAiHint: 'tomato organic' },
  { id: 2, name: 'Fresh Spinach', description: 'Tender green spinach leaves.', price: 2.49, imageUrl: 'https://placehold.co/600x400.png', category: 'Leafy Greens', stock: 30, dataAiHint: 'spinach leaves' },
  { id: 3, name: 'Sweet Carrots', description: 'Crunchy orange carrots.', price: 1.99, imageUrl: 'https://placehold.co/600x400.png', category: 'Root Vegetables', stock: 100, dataAiHint: 'carrots bunch' },
  { id: 4, name: 'Crisp Lettuce', description: 'Fresh iceberg lettuce.', price: 2.15, imageUrl: 'https://placehold.co/600x400.png', category: 'Leafy Greens', stock: 40, dataAiHint: 'lettuce head' },
  { id: 5, name: 'Bell Peppers', description: 'Colorful mix of bell peppers.', price: 4.50, imageUrl: 'https://placehold.co/600x400.png', category: 'Fresh Veggies', stock: 25, dataAiHint: 'bell peppers' },
  { id: 6, name: 'Red Apple', description: 'Sweet and juicy red apples.', price: 0.99, imageUrl: 'https://placehold.co/600x400.png', category: 'Fruits', stock: 70, dataAiHint: 'red apple' },
];


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
  };
};

export const getProducts = async (searchTerm?: string, categoryName?: string): Promise<Product[]> => {
  console.log(`getProducts called with searchTerm: "${searchTerm}", categoryName: "${categoryName}"`);
  
  if (USE_MOCK_DATA_FLAG) {
    console.log("Using mock product data.");
    let products = mockProducts;
    if (searchTerm) {
      products = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (categoryName && categoryName !== "All") {
      products = products.filter(p => p.category === categoryName);
    }
    return products;
  }

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
  // The following line was causing "Unknown argument `status`" if Prisma schema/client wasn't updated.
  // It's commented out for now based on previous troubleshooting.
  // If your local Prisma setup (schema + generated client) supports the 'status' field, you can uncomment it.
  // whereClause.status = 'ACTIVE'; // Only fetch active products for the public site

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
    // It's important not to throw here if we want the page to still render,
    // but this indicates a serious issue with the DB connection or query.
    return []; 
  }
};

export const getProductById = async (id: number): Promise<Product | undefined> => {
  console.log(`getProductById called with id: ${id}`);
  
  if (USE_MOCK_DATA_FLAG) {
    console.log("Using mock product data for getProductById.");
    return mockProducts.find(p => p.id === id);
  }
  
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
  if (USE_MOCK_DATA_FLAG) {
    console.log("Using mock category names.");
    return ["All", ...mockCategories.map(c => c.name)];
  }
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
  if (USE_MOCK_DATA_FLAG) {
    console.log("Using mock detailed category data.");
    return mockCategories;
  }
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
      name: cat.name || 'Unnamed Category', // Fallback for name
      imageUrl: cat.imageUrl || `https://placehold.co/200x150.png?text=${encodeURIComponent(cat.name || 'Category')}`, 
      dataAiHint: cat.name ? (cat.name.toLowerCase().split(' ').slice(0,2).join(' ') || 'category item') : 'category item'
    }));
  } catch (error) {
    console.error("Prisma error in getCategoriesWithIds (detailed objects):", error);
    return []; 
  }
};

    