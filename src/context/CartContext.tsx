
"use client";

import type { Product, CartItem } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
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
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (cartItems.length > 0 || localStorage.getItem(CART_STORAGE_KEY)) { // only update if cart was initialized or has items
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

  const removeFromCart = (productId: string) => {
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

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems(prevItems => {
      const productInCart = prevItems.find(item => item.product.id === productId)?.product;
      if (!productInCart) return prevItems;

      if (quantity <= 0) {
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
    return <CartContext.Provider value={{
      cartItems: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
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
