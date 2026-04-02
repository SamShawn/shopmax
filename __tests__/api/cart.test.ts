import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE } from '@/app/api/cart/route'

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    cartItem: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    product: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/auth', () => ({
  getCurrentUser: vi.fn(),
}))

vi.mock('@/lib/redis', () => ({
  cartCache: {
    get: vi.fn(),
    set: vi.fn(),
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    clear: vi.fn(),
  },
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue(undefined),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}))

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { cartCache } from '@/lib/redis'

describe('GET /api/cart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return cart items for logged-in user', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ userId: 'user_1', email: 'test@test.com' })
    vi.mocked(prisma.cartItem.findMany).mockResolvedValue([
      {
        product: {
          id: 'prod_1',
          name: 'Product 1',
          price: 99.99,
          imageUrl: null,
          stock: 10,
          isActive: true,
        },
        quantity: 2,
      },
    ])

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.items).toHaveLength(1)
    expect(data.items[0].name).toBe('Product 1')
    expect(data.items[0].quantity).toBe(2)
  })

  it('should return empty array for empty cart', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ userId: 'user_1', email: 'test@test.com' })
    vi.mocked(prisma.cartItem.findMany).mockResolvedValue([])

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.items).toEqual([])
  })

  it('should return 500 on database error', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ userId: 'user_1', email: 'test@test.com' })
    vi.mocked(prisma.cartItem.findMany).mockRejectedValue(new Error('DB error'))

    const response = await GET()

    expect(response.status).toBe(500)
  })
})

describe('POST /api/cart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should add item to cart for logged-in user', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ userId: 'user_1', email: 'test@test.com' })
    vi.mocked(prisma.product.findUnique).mockResolvedValue({
      id: 'prod_1',
      name: 'Product 1',
      price: 99.99,
      stock: 10,
      isActive: true,
    } as any)
    vi.mocked(prisma.cartItem.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.cartItem.create).mockResolvedValue({
      id: 'item_1',
      userId: 'user_1',
      productId: 'prod_1',
      quantity: 1,
    } as any)
    vi.mocked(prisma.cartItem.findMany).mockResolvedValue([])

    const request = new Request('http://localhost/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'prod_1', quantity: 1 }),
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
    expect(prisma.cartItem.create).toHaveBeenCalled()
  })

  it('should update quantity if item already in cart', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ userId: 'user_1', email: 'test@test.com' })
    vi.mocked(prisma.product.findUnique).mockResolvedValue({
      id: 'prod_1',
      name: 'Product 1',
      price: 99.99,
      stock: 10,
      isActive: true,
    } as any)
    vi.mocked(prisma.cartItem.findUnique).mockResolvedValue({
      id: 'item_1',
      quantity: 1,
    } as any)
    vi.mocked(prisma.cartItem.update).mockResolvedValue({
      id: 'item_1',
      quantity: 2,
    } as any)
    vi.mocked(prisma.cartItem.findMany).mockResolvedValue([])

    const request = new Request('http://localhost/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'prod_1', quantity: 1 }),
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
    expect(prisma.cartItem.update).toHaveBeenCalled()
  })

  it('should return 400 for missing productId', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ userId: 'user_1', email: 'test@test.com' })

    const request = new Request('http://localhost/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: 1 }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Product ID required')
  })

  it('should return 404 for non-existent product', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ userId: 'user_1', email: 'test@test.com' })
    vi.mocked(prisma.product.findUnique).mockResolvedValue(null)

    const request = new Request('http://localhost/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'invalid', quantity: 1 }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Product not found')
  })

  it('should return 400 for insufficient stock', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ userId: 'user_1', email: 'test@test.com' })
    vi.mocked(prisma.product.findUnique).mockResolvedValue({
      id: 'prod_1',
      name: 'Product 1',
      price: 99.99,
      stock: 2,
      isActive: true,
    } as any)

    const request = new Request('http://localhost/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'prod_1', quantity: 5 }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Insufficient stock')
  })
})

describe('PUT /api/cart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should update item quantity', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ userId: 'user_1', email: 'test@test.com' })
    vi.mocked(prisma.product.findUnique).mockResolvedValue({
      id: 'prod_1',
      stock: 10,
    } as any)
    vi.mocked(prisma.cartItem.updateMany).mockResolvedValue({ count: 1 } as any)
    vi.mocked(prisma.cartItem.findMany).mockResolvedValue([])

    const request = new Request('http://localhost/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'prod_1', quantity: 3 }),
    })

    const response = await PUT(request)

    expect(response.status).toBe(200)
    expect(prisma.cartItem.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user_1', productId: 'prod_1' },
      data: { quantity: 3 },
    })
  })

  it('should delete item when quantity is 0', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ userId: 'user_1', email: 'test@test.com' })
    vi.mocked(prisma.cartItem.deleteMany).mockResolvedValue({ count: 1 } as any)
    vi.mocked(prisma.cartItem.findMany).mockResolvedValue([])

    const request = new Request('http://localhost/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'prod_1', quantity: 0 }),
    })

    const response = await PUT(request)

    expect(response.status).toBe(200)
    expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'user_1', productId: 'prod_1' },
    })
  })

  it('should return 400 for missing fields', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ userId: 'user_1', email: 'test@test.com' })

    const request = new Request('http://localhost/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'prod_1' }),
    })

    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing required fields')
  })
})

describe('DELETE /api/cart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should remove single item from cart', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ userId: 'user_1', email: 'test@test.com' })
    vi.mocked(prisma.cartItem.deleteMany).mockResolvedValue({ count: 1 } as any)
    vi.mocked(prisma.cartItem.findMany).mockResolvedValue([])

    const request = new Request('http://localhost/api/cart?productId=prod_1', {
      method: 'DELETE',
    })

    const response = await DELETE(request)

    expect(response.status).toBe(200)
    expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'user_1', productId: 'prod_1' },
    })
  })

  it('should clear entire cart when no productId provided', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ userId: 'user_1', email: 'test@test.com' })
    vi.mocked(prisma.cartItem.deleteMany).mockResolvedValue({ count: 2 } as any)
    vi.mocked(prisma.cartItem.findMany).mockResolvedValue([])

    const request = new Request('http://localhost/api/cart', {
      method: 'DELETE',
    })

    const response = await DELETE(request)

    expect(response.status).toBe(200)
    expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'user_1' },
    })
  })
})