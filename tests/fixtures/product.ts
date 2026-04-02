import type { Product } from '@prisma/client'

export const mockProduct: Product = {
  id: 'prod_1',
  name: 'Test Product',
  description: 'A great test product',
  price: 99.99,
  stock: 10,
  imageUrl: 'https://example.com/image.jpg',
  category: 'electronics',
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockProductInput = {
  name: 'Test Product',
  description: 'A great test product',
  price: 99.99,
  stock: 10,
  imageUrl: 'https://example.com/image.jpg',
  category: 'electronics',
}

export const createProductInput = (overrides = {}) => ({
  name: 'New Product',
  description: 'Product description',
  price: 49.99,
  stock: 20,
  imageUrl: null,
  category: 'electronics',
  ...overrides,
})

export const mockProducts = [
  mockProduct,
  {
    ...mockProduct,
    id: 'prod_2',
    name: 'Another Product',
    price: 149.99,
    stock: 5,
  },
]