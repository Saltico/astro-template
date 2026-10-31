// src/data/products.ts
// Sample products data — replace with your own data source

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description: string;
  category: string;
  sku: string;
}

export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'Classic T-Shirt',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
    description: 'Soft cotton t-shirt with a comfortable fit. Perfect for everyday wear.',
    category: 'Clothing',
    sku: 'TSH-001',
  },
  {
    id: 'prod-002',
    name: 'Wireless Headphones',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
    category: 'Electronics',
    sku: 'AUD-002',
  },
  {
    id: 'prod-003',
    name: 'Leather Wallet',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600',
    description: 'Genuine leather wallet with RFID protection. Slim design fits in any pocket.',
    category: 'Accessories',
    sku: 'ACC-003',
  },
  {
    id: 'prod-004',
    name: 'Running Shoes',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    description: 'Lightweight running shoes with responsive cushioning and breathable mesh.',
    category: 'Footwear',
    sku: 'SHO-004',
  },
  {
    id: 'prod-005',
    name: 'Smart Watch',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    description: 'Feature-packed smartwatch with health monitoring, GPS, and 5-day battery.',
    category: 'Electronics',
    sku: 'WCH-005',
  },
  {
    id: 'prod-006',
    name: 'Backpack',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
    description: 'Durable backpack with laptop compartment and water-resistant material.',
    category: 'Accessories',
    sku: 'BAG-006',
  },
  {
    id: 'prod-007',
    name: 'Sunglasses',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600',
    description: 'Polarized sunglasses with UV400 protection and lightweight frame.',
    category: 'Accessories',
    sku: 'SUN-007',
  },
  {
    id: 'prod-008',
    name: 'Coffee Mug',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600',
    description: 'Ceramic coffee mug with double-wall insulation. Keeps drinks hot longer.',
    category: 'Home',
    sku: 'HOM-008',
  },
];

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getCategories(): string[] {
  return [...new Set(products.map((p) => p.category))];
}
