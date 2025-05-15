
"use client";

import type { Product, CartItem } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'veggieDashCart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Component has mounted, client-side logic can run
  }, []);

  useEffect(() => {
    if (isClient) { // Only load from localStorage on the client
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
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
    }
  }, [isClient]); // Run once when isClient becomes true

  useEffect(() => {
    if (isClient) { // Only save to localStorage on the client
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isClient]); // Save whenever cartItems or isClient changes (after initial load)

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast({
            title: "Stock limit reached",
            description: `Cannot add more ${product.name}. Max stock is ${product.stock}. Current in cart: ${existingItem.quantity}, trying to add: ${quantity}.`,
            variant: "destructive",
          });
          return prevItems.map(item =>
            item.product.id === product.id ? { ...item, quantity: product.stock } : item
          );
        }
        toast({
          title: "Item updated in cart",
          description: `${product.name} quantity increased to ${newQuantity}.`,
        });
        return prevItems.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }
      // New item
      if (quantity > product.stock) {
        toast({
            title: "Stock limit reached",
            description: `Cannot add ${product.name}. Max stock is ${product.stock}, trying to add ${quantity}.`,
            variant: "destructive",
          });
        return [...prevItems, { product, quantity: product.stock }];
      }
      toast({
        title: "Item added to cart",
        description: `${quantity} ${product.name}(s) has been added to your cart.`,
      });
      return [...prevItems, { product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
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

  const updateQuantity = (productId: number, newQuantity: number) => {
    setCartItems(prevItems => {
      const productInCart = prevItems.find(item => item.product.id === productId)?.product;
      if (!productInCart) return prevItems;

      if (newQuantity <= 0) {
        const itemToRemove = prevItems.find(item => item.product.id === productId);
        if (itemToRemove) {
            toast({
                title: "Item removed",
                description: `${itemToRemove.product.name} has been removed from your cart.`,
            });
        }
        return prevItems.filter(item => item.product.id !== productId);
      }
      if (newQuantity > productInCart.stock) {
        toast({
          title: "Stock limit reached",
          description: `Max stock for ${productInCart.name} is ${productInCart.stock}. Quantity set to max.`,
          variant: "destructive",
        });
        return prevItems.map(item =>
          item.product.id === productId ? { ...item, quantity: productInCart.stock } : item
        );
      }
      return prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
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
  
  if (!isClient) {
    // Provide a default, non-functional context for SSR or pre-hydration
    // to prevent errors when useCart is called on server or before localStorage is available.
    return <CartContext.Provider value={{
      cartItems: [],
      addToCart: () => { console.warn("Cart action called before client hydration"); },
      removeFromCart: () => { console.warn("Cart action called before client hydration"); },
      updateQuantity: () => { console.warn("Cart action called before client hydration"); },
      clearCart: () => { console.warn("Cart action called before client hydration"); },
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
