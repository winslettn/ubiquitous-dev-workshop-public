/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  imgName: string;
  quantity: number;
}

export const BULK_DISCOUNT_THRESHOLD = 5;
export const BULK_DISCOUNT_RATE = 0.1;

export const hasBulkDiscount = (item: CartItem) => item.quantity >= BULK_DISCOUNT_THRESHOLD;

export const getLineTotal = (item: CartItem) =>
  item.price * item.quantity * (hasBulkDiscount(item) ? 1 - BULK_DISCOUNT_RATE : 1);

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const loadItems = (): CartItem[] => {
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadItems);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem: CartContextType['addItem'] = (item, quantity) => {
    if (quantity <= 0) {return;}
    setItems((prev) =>
      prev.some((i) => i.productId === item.productId)
        ? prev.map((i) =>
            i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i,
          )
        : [...prev, { ...item, quantity }],
    );
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    );
  };

  const removeItem = (productId: number) =>
    setItems((prev) => prev.filter((i) => i.productId !== productId));

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + getLineTotal(i), 0);

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalPrice, addItem, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
