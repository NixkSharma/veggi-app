
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
  };
};

// --- Mock Data ---
const mockCategoriesData: string[] = ["All", "Fresh Veggies", "Leafy Greens", "Root Vegetables", "Fruits"];
const mockDetailedCategoriesData: CategoryWithId[] = [
  { id: 1, name: 'Fresh Veggies', imageUrl: 'https://placehold.co/200x150.png?text=Veggies', dataAiHint: 'fresh vegetables' },
  { id: 2, name: 'Leafy Greens', imageUrl: 'https://placehold.co/200x150.png?text=Greens', dataAiHint: 'leafy greens' },
  { id: 3, name: 'Root Vegetables', imageUrl: 'https://placehold.co/200x150.png?text=Roots', dataAiHint: 'root vegetables' },
  { id: 4, name: 'Fruits', imageUrl: 'https://placehold.co/200x150.png?text=Fruits', dataAiHint: 'fresh fruits' },
];


const mockProductsData: Product[] = [
  { id: 1, name: 'Mock Carrot', description: 'Crunchy mock carrots from local farms. Rich in Vitamin A.', price: 1.99, imageUrl: 'https://placehold.co/600x400.png?text=Mock+Carrot', category: 'Root Vegetables', stock: 100, dataAiHint: 'carrot mock organic' },
  { id: 2, name: 'Mock Spinach', description: 'Fresh mock spinach leaves, perfect for salads or cooking.', price: 2.49, imageUrl: 'https://placehold.co/600x400.png?text=Mock+Spinach', category: 'Leafy Greens', stock: 50, dataAiHint: 'spinach mock green' },
  { id: 3, name: 'Mock Tomato', description: 'Juicy mock tomatoes, great for sauces or fresh eating.', price: 3.00, imageUrl: 'https://placehold.co/600x400.png?text=Mock+Tomato', category: 'Fruits', stock: 75, dataAiHint: 'tomato mock red' },
  { id: 4, name: 'Mock Broccoli', description: 'Fresh mock broccoli florets, packed with nutrients.', price: 2.79, imageUrl: 'https://placehold.co/600x400.png?text=Mock+Broccoli', category: 'Fresh Veggies', stock: 0, dataAiHint: 'broccoli mock healthy' },
  { id: 5, name: 'Mock Potato', description: 'Versatile mock potatoes, ideal for mashing or roasting.', price: 0.99, imageUrl: 'https://placehold.co/600x400.png?text=Mock+Potato', category: 'Root Vegetables', stock: 120, dataAiHint: 'potato mock starchy' },
  { id: 6, name: 'Mock Lettuce', description: 'Crisp mock lettuce, perfect for sandwiches and salads.', price: 1.50, imageUrl: 'https://placehold.co/600x400.png?text=Mock+Lettuce', category: 'Leafy Greens', stock: 60, dataAiHint: 'lettuce mock crisp' },
];
// --- End Mock Data ---

export const getProducts = async (searchTerm?: string, categoryName?: string): Promise<Product[]> => {
  console.log(`getProducts called with searchTerm: "${searchTerm}", categoryName: "${categoryName}"`);
  if (process.env.USE_MOCK_DATA === 'true') {
    console.log("USING MOCK DATA for getProducts");
    let products = mockProductsData;
    if (searchTerm) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (categoryName && categoryName !== "All") {
      products = products.filter(p => p.category === categoryName);
    }
    return products.map(p => ({...p, imageUrl: p.imageUrl || DEFAULT_PLACEHOLDER_IMAGE }));
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
  // If the status field is present in your Prisma schema for Product:
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
    return []; 
  }
};

export const getProductById = async (id: number): Promise<Product | undefined> => {
  console.log(`getProductById called with id: ${id}`);
  if (process.env.USE_MOCK_DATA === 'true') {
    console.log(`USING MOCK DATA for getProductById: ${id}`);
    const product = mockProductsData.find(p => p.id === id);
    if (product) {
      return {...product, imageUrl: product.imageUrl || DEFAULT_PLACEHOLDER_IMAGE };
    }
    return undefined;
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
  if (process.env.USE_MOCK_DATA === 'true') {
    console.log("USING MOCK DATA for getCategories (string array)");
    return mockCategoriesData;
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

// New function to get categories with IDs and image URLs
export const getCategoriesWithIds = async (): Promise<CategoryWithId[]> => {
  console.log("getCategoriesWithIds called.");
  if (process.env.USE_MOCK_DATA === 'true') {
    console.log("USING MOCK DATA for getCategoriesWithIds (detailed objects)");
    return mockDetailedCategoriesData;
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
      name: cat.name,
      imageUrl: cat.imageUrl || 'https://placehold.co/200x150.png', // Default placeholder
      dataAiHint: cat.name.toLowerCase() || 'category item'
    }));
  } catch (error) {
    console.error("Prisma error in getCategoriesWithIds (detailed objects):", error);
    // Fallback to prevent full crash if DB is inaccessible or USE_MOCK_DATA not set
    return []; 
  }
};
