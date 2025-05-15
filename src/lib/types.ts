export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  dataAiHint?: string; // For placeholder image search keywords
};

export type CartItem = {
  product: Product;
  quantity: number;
};
