"use client";
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  isHydrated: boolean;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "industriasp_cart";

// Función para cargar desde localStorage de manera segura
function loadFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('🔍 loadFromStorage: Raw data:', stored);
    
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('🔍 loadFromStorage: Parsed data:', parsed);
      
      const validItems = parsed.filter((item: any) => 
        item && 
        typeof item.productId === 'number' && 
        typeof item.name === 'string' && 
        typeof item.price === 'number' && 
        typeof item.quantity === 'number' && 
        item.quantity > 0
      );
      
      console.log('🔍 loadFromStorage: Valid items:', validItems);
      return validItems;
    }
  } catch (error) {
    console.error('🔍 loadFromStorage: Error:', error);
  }
  
  return [];
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  console.log('CartProvider: Component initialized');
  
  // Inicializar con array vacío para evitar problemas de SSR
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  console.log('🚀 CartProvider: Setting up useEffect');
  
  // Hidratar desde localStorage después del montaje
  useEffect(() => {
    console.log('🔥 USEEFFECT: Starting hydration process');
    const storedItems = loadFromStorage();
    console.log('🔥 USEEFFECT: Loaded items:', storedItems);
    setItems(storedItems);
    setIsHydrated(true);
    console.log('🔥 USEEFFECT: Hydration completed');
  }, []);

  const addItem = (item: CartItem) => {
    console.log('CartProvider: Adding item:', item);
    const existingIndex = items.findIndex(i => i.productId === item.productId);
    let newItems: CartItem[];
    
    if (existingIndex >= 0) {
      newItems = [...items];
      newItems[existingIndex].quantity += item.quantity;
    } else {
      newItems = [...items, item];
    }
    
    setItems(newItems);
    
    // Guardar en localStorage solo después de la hidratación
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
        console.log('CartProvider: Saved to localStorage:', newItems);
      } catch (error) {
        console.error('CartProvider: Error saving to localStorage:', error);
      }
    }
    
    console.log('CartProvider: New cart state after adding:', newItems);
  };

  const removeItem = (productId: number) => {
    const newItems = items.filter(item => item.productId !== productId);
    setItems(newItems);
    
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      } catch (error) {
        console.error('CartProvider: Error saving to localStorage:', error);
      }
    }
  };

  const setQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    const newItems = items.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    );
    setItems(newItems);
    
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      } catch (error) {
        console.error('CartProvider: Error saving to localStorage:', error);
      }
    }
  };

  const clear = () => {
    setItems([]);
    
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('CartProvider: Error clearing localStorage:', error);
      }
    }
  };

  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);

  const value: CartContextType = { items, total, addItem, removeItem, setQuantity, clear, isHydrated };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
