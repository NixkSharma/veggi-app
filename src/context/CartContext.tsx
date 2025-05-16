
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
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) { 
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        try {
          const parsedCart: CartItem[] = JSON.parse(storedCart);
          // Ensure product IDs are numbers and product objects are well-formed
          const sanitizedCart = parsedCart.map(item => {
            const product = item.product || {} as Product; // Ensure product exists
            return {
              ...item,
              product: {
                ...product,
                id: typeof product.id === 'string' ? parseInt(product.id, 10) : (product.id || 0),
                name: product.name || 'Unnamed Product',
                price: typeof product.price === 'number' ? product.price : 0,
                // Keep other product properties as they are, assuming they are correct or nullable
              },
              quantity: item.quantity || 1,
            };
          }).filter(item => !isNaN(item.product.id) && item.product.id !== 0); // Filter out invalid items
          setCartItems(sanitizedCart);
        } catch (error) {
          console.error("Failed to parse cart from localStorage", error);
          localStorage.removeItem(CART_STORAGE_KEY); 
        }
      }
    }
  }, [isClient]);

  useEffect(() => {
    // Only save to localStorage on the client and if cartItems has been initialized
    if (isClient && cartItems.length > 0) { 
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } else if (isClient && cartItems.length === 0) {
      // If cart becomes empty after being initialized, clear localStorage
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [cartItems, isClient]);

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
    if (isClient) {
      localStorage.removeItem(CART_STORAGE_KEY); // Also clear from storage
    }
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
  
  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
  };

  // Provide a default, non-functional context for SSR or pre-hydration if isClient is false
  // This has been simplified as the main logic now depends on isClient for localStorage.
  if (!isClient) {
      const ssrSafeContext = {
          ...contextValue,
          cartItems: [], // SSR cart is always empty
          addToCart: () => console.warn("Attempted to add to cart on server or before hydration."),
          removeFromCart: () => console.warn("Attempted to remove from cart on server or before hydration."),
          updateQuantity: () => console.warn("Attempted to update quantity on server or before hydration."),
          clearCart: () => console.warn("Attempted to clear cart on server or before hydration."),
      };
      return <CartContext.Provider value={ssrSafeContext}>{children}</CartContext.Provider>;
  }

  return (
    <CartContext.Provider value={contextValue}>
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

    