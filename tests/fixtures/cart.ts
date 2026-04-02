import type { CartItem, Product } from '@prisma/client'
import { mockProduct } from './product'

export const mockCartItem: CartItem & { product: Product } = {
  id: 'item_1',
  userId: 'user_1',
  productId: 'prod_1',
  quantity: 2,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  product: mockProduct,
}

export const mockCartInput = {
  productId: 'prod_1',
  quantity: 1,
}

export const mockCartItems = [
  mockCartItem,
  {
    ...mockCartItem,
    id: 'item_2',
    productId: 'prod_2',
    quantity: 1,
    product: {
      ...mockProduct,
      id: 'prod_2',
      name: 'Another Product',
      price: 149.99,
    },
  },
]

export const createCartItemInput = (overrides = {}) => ({
  productId: 'prod_1',
  quantity: 1,
  ...overrides,
})