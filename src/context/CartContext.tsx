
"use client";

import type { Product, CartItem } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void; // Changed productId to number
  updateQuantity: (productId: number, quantity: number) => void; // Changed productId to number
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'veggieDashCart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // Ensure product IDs are numbers if migrating from old string IDs in localStorage
        const sanitizedCart = parsedCart.map((item: CartItem) => ({
          ...item,
          product: {
            ...item.product,
            id: typeof item.product.id === 'string' ? parseInt(item.product.id, 10) : item.product.id,
          }
        })).filter((item: CartItem) => !isNaN(item.product.id));
        setCartItems(sanitizedCart);
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        localStorage.removeItem(CART_STORAGE_KEY); // Clear corrupted cart
      }
    }
  }, []);

  useEffect(() => {
    // Only update localStorage if cartItems has been initialized from localStorage or has items.
    // This prevents overwriting a potentially valid stored cart with an empty one on initial load
    // if localStorage access is slow.
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (cartItems.length > 0 || storedCart) { 
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        if (existingItem.quantity + quantity > product.stock) {
          toast({
            title: "Stock limit reached",
            description: `Cannot add more ${product.name}. Max stock is ${product.stock}.`,
            variant: "destructive",
          });
          return prevItems.map(item =>
            item.product.id === product.id ? { ...item, quantity: product.stock } : item
          );
        }
        toast({
          title: "Item updated in cart",
          description: `${product.name} quantity increased.`,
        });
        return prevItems.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      if (quantity > product.stock) {
        toast({
            title: "Stock limit reached",
            description: `Cannot add ${product.name}. Max stock is ${product.stock}.`,
            variant: "destructive",
          });
        return [...prevItems, { product, quantity: product.stock }];
      }
      toast({
        title: "Item added to cart",
        description: `${product.name} has been added to your cart.`,
      });
      return [...prevItems, { product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => { // Changed productId to number
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.product.id === productId);
      if (itemToRemove) {
        toast({
          title: "Item removed",
          description: `${itemToRemove.product.name} has been removed from your cart.`,
        });
      }
      return prevItems.filter(item => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId: number, quantity: number) => { // Changed productId to number
    setCartItems(prevItems => {
      const productInCart = prevItems.find(item => item.product.id === productId)?.product;
      if (!productInCart) return prevItems;

      if (quantity <= 0) {
        // If quantity is 0 or less, remove the item
        const itemToRemove = prevItems.find(item => item.product.id === productId);
        if (itemToRemove) {
            toast({
                title: "Item removed",
                description: `${itemToRemove.product.name} has been removed from your cart.`,
            });
        }
        return prevItems.filter(item => item.product.id !== productId);
      }
      if (quantity > productInCart.stock) {
        toast({
          title: "Stock limit reached",
          description: `Max stock for ${productInCart.name} is ${productInCart.stock}.`,
          variant: "destructive",
        });
        return prevItems.map(item =>
          item.product.id === productId ? { ...item, quantity: productInCart.stock } : item
        );
      }
      return prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      description: "Your shopping cart is now empty.",
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };
  
  // Initialize cart only on client
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);


  if (!isClient) {
    // Provide a default, non-functional context for SSR or pre-hydration
    return <CartContext.Provider value={{
      cartItems: [],
      addToCart: () => { console.warn("addToCart called on server or before hydration"); },
      removeFromCart: () => { console.warn("removeFromCart called on server or before hydration"); },
      updateQuantity: () => { console.warn("updateQuantity called on server or before hydration"); },
      clearCart: () => { console.warn("clearCart called on server or before hydration"); },
      getCartTotal: () => 0,
      getItemCount: () => 0,
    }}>{children}</CartContext.Provider>;
  }


  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
