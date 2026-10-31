// src/types/cart.ts
// Cart types and constants

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  notes?: string;
}

export interface Cart {
  version: number;
  items: CartItem[];
  updatedAt: string;
}

export const CART_STORAGE_KEY = 'cart_v1';
export const CART_VERSION = 1;

// Limits
export const MAX_QUANTITY = 50;
export const MAX_NOTES_LENGTH = 280;
