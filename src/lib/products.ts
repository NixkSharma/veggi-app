import type { Product } from '@/lib/types';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Broccoli',
    description: 'Fresh, locally sourced organic broccoli crowns.',
    price: 2.99,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'broccoli vegetable',
    category: 'Vegetables',
    stock: 50,
  },
  {
    id: '2',
    name: 'Crisp Carrots',
    description: 'Sweet and crunchy carrots, perfect for snacking or cooking.',
    price: 1.49,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'carrots vegetable',
    category: 'Vegetables',
    stock: 100,
  },
  {
    id: '3',
    name: 'Spinach Bunch',
    description: 'Nutrient-rich spinach leaves, great for salads and smoothies.',
    price: 2.29,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'spinach greens',
    category: 'Leafy Greens',
    stock: 30,
  },
  {
    id: '4',
    name: 'Ripe Tomatoes',
    description: 'Juicy vine-ripened tomatoes, bursting with flavor.',
    price: 3.49,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'tomatoes vegetable',
    category: 'Fruits (Culinary Vegetables)',
    stock: 60,
  },
  {
    id: '5',
    name: 'Bell Peppers (Assorted)',
    description: 'Colorful mix of red, yellow, and green bell peppers.',
    price: 4.99,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'bell peppers',
    category: 'Vegetables',
    stock: 40,
  },
  {
    id: '6',
    name: 'Fresh Garlic',
    description: 'Aromatic garlic bulbs for enhancing your dishes.',
    price: 0.99,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'garlic spice',
    category: 'Aromatics',
    stock: 80,
  },
];

export const getProducts = async (searchTerm?: string, category?: string): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredProducts = mockProducts;

  if (searchTerm) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (category && category !== "All") {
    filteredProducts = filteredProducts.filter(product => product.category === category);
  }

  return filteredProducts;
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockProducts.find(product => product.id === id);
};

export const getCategories = async (): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const categories = new Set(mockProducts.map(p => p.category));
  return ["All", ...Array.from(categories)];
}
