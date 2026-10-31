// src/lib/cart.ts
// Cart store with localStorage persistence and pub/sub pattern
// Framework-agnostic, SSR-safe

import { CART_STORAGE_KEY, CART_VERSION, MAX_QUANTITY, MAX_NOTES_LENGTH } from '@/types/cart';
import type { Cart, CartItem } from '@/types/cart';

const CART_CHANGE_EVENT = 'cart-change';

function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

function emptyCart(): Cart {
  return {
    version: CART_VERSION,
    items: [],
    updatedAt: new Date().toISOString(),
  };
}

function parseCart(raw: string | null): Cart {
  if (!raw) return emptyCart();
  try {
    const parsed = JSON.parse(raw);
    if (parsed.version !== CART_VERSION) return emptyCart();
    if (!Array.isArray(parsed.items)) return emptyCart();
    return parsed as Cart;
  } catch {
    return emptyCart();
  }
}

function saveCart(cart: Cart): void {
  if (typeof window === 'undefined' || !isStorageAvailable()) return;
  cart.updatedAt = new Date().toISOString();
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent(CART_CHANGE_EVENT, { detail: cart }));
}

export function getCart(): Cart {
  if (typeof window === 'undefined') return emptyCart();
  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  return parseCart(raw);
}

export function addItem(item: Omit<CartItem, 'quantity'> & { quantity?: number }): Cart {
  const cart = getCart();
  const existing = cart.items.find((i) => i.id === item.id);

  if (existing) {
    existing.quantity = Math.min(existing.quantity + (item.quantity ?? 1), MAX_QUANTITY);
  } else {
    cart.items.push({
      ...item,
      quantity: Math.min(item.quantity ?? 1, MAX_QUANTITY),
    });
  }

  saveCart(cart);
  return cart;
}

export function updateItem(id: string, updates: Partial<Pick<CartItem, 'quantity' | 'notes'>>): Cart {
  const cart = getCart();
  const item = cart.items.find((i) => i.id === id);

  if (item) {
    if (updates.quantity !== undefined) {
      item.quantity = Math.max(1, Math.min(updates.quantity, MAX_QUANTITY));
    }
    if (updates.notes !== undefined) {
      item.notes = updates.notes.slice(0, MAX_NOTES_LENGTH);
    }
    saveCart(cart);
  }

  return cart;
}

export function removeItem(id: string): Cart {
  const cart = getCart();
  cart.items = cart.items.filter((i) => i.id !== id);
  saveCart(cart);
  return cart;
}

export function clearCart(): Cart {
  const cart = emptyCart();
  saveCart(cart);
  return cart;
}

export function getItemCount(): number {
  const cart = getCart();
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(): number {
  const cart = getCart();
  return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function subscribe(callback: (cart: Cart) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: Event) => {
    const cart = (e as CustomEvent).detail as Cart;
    callback(cart);
  };

  window.addEventListener(CART_CHANGE_EVENT, handler);

  // Cross-tab sync
  const storageHandler = (e: StorageEvent) => {
    if (e.key === CART_STORAGE_KEY) {
      const cart = parseCart(e.newValue);
      callback(cart);
    }
  };

  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener(CART_CHANGE_EVENT, handler);
    window.removeEventListener('storage', storageHandler);
  };
}

export function initStorageSync(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('storage', (e) => {
    if (e.key === CART_STORAGE_KEY && e.newValue !== null) {
      const cart = parseCart(e.newValue);
      window.dispatchEvent(new CustomEvent(CART_CHANGE_EVENT, { detail: cart }));
    }
  });
}
