// src/lib/checkout.ts
// Checkout state management (shipping + payment data)
// Framework-agnostic, SSR-safe, localStorage-based

const CHECKOUT_SHIPPING_KEY = 'checkout_shipping_v1';
const CHECKOUT_PAYMENT_KEY = 'checkout_payment_v1';

export interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentData {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

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

// ─── Shipping Data ──────────────────────────────────────────────────

export function getShippingData(): ShippingData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CHECKOUT_SHIPPING_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ShippingData;
  } catch {
    return null;
  }
}

export function saveShippingData(data: ShippingData): void {
  if (typeof window === 'undefined' || !isStorageAvailable()) return;
  window.localStorage.setItem(CHECKOUT_SHIPPING_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('checkout-shipping-change', { detail: data }));
}

export function clearShippingData(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CHECKOUT_SHIPPING_KEY);
}

// ─── Payment Data ───────────────────────────────────────────────────

export function getPaymentData(): PaymentData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CHECKOUT_PAYMENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PaymentData;
  } catch {
    return null;
  }
}

export function savePaymentData(data: PaymentData): void {
  if (typeof window === 'undefined' || !isStorageAvailable()) return;
  window.localStorage.setItem(CHECKOUT_PAYMENT_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('checkout-payment-change', { detail: data }));
}

export function clearPaymentData(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CHECKOUT_PAYMENT_KEY);
}

// ─── Clear all ──────────────────────────────────────────────────────

export function clearCheckoutData(): void {
  clearShippingData();
  clearPaymentData();
}

// ─── Validation ─────────────────────────────────────────────────────

export function validateShippingData(data: Partial<ShippingData>): string[] {
  const errors: string[] = [];
  if (!data.firstName?.trim()) errors.push('First name is required');
  if (!data.lastName?.trim()) errors.push('Last name is required');
  if (!data.email?.trim()) errors.push('Email is required');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Invalid email');
  if (!data.address?.trim()) errors.push('Address is required');
  if (!data.city?.trim()) errors.push('City is required');
  if (!data.state?.trim()) errors.push('State is required');
  if (!data.zipCode?.trim()) errors.push('ZIP code is required');
  return errors;
}

export function validatePaymentData(data: Partial<PaymentData>): string[] {
  const errors: string[] = [];
  if (!data.cardName?.trim()) errors.push('Card name is required');
  if (!data.cardNumber?.trim()) errors.push('Card number is required');
  else if (data.cardNumber.replace(/\s/g, '').length < 13) errors.push('Invalid card number');
  if (!data.expiry?.trim()) errors.push('Expiry date is required');
  else if (!/^\d{2}\/\d{2}$/.test(data.expiry)) errors.push('Invalid expiry format (MM/YY)');
  if (!data.cvv?.trim()) errors.push('CVV is required');
  else if (!/^\d{3,4}$/.test(data.cvv)) errors.push('Invalid CVV');
  return errors;
}
