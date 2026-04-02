import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/products/route'

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock('@/lib/auth', () => ({
  getCurrentUser: vi.fn(),
}))

vi.mock('@/lib/redis', () => ({
  productCache: {
    get: vi.fn(),
    set: vi.fn(),
    invalidate: vi.fn(),
  },
  productListCache: {
    get: vi.fn(),
    set: vi.fn(),
    invalidate: vi.fn(),
  },
}))

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { productListCache } from '@/lib/redis'

describe('GET /api/products', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return products from cache if available', async () => {
    const cachedProducts = [{ id: 'prod_1', name: 'Cached Product' }]
    vi.mocked(productListCache.get).mockResolvedValue({ products: cachedProducts, total: 1 })

    const request = new Request('http://localhost/api/products')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.products).toEqual(cachedProducts)
    expect(prisma.product.findMany).not.toHaveBeenCalled()
  })

  it('should fetch from database when cache is empty', async () => {
    vi.mocked(productListCache.get).mockResolvedValue(null)
    vi.mocked(prisma.product.findMany).mockResolvedValue([
      { id: 'prod_1', name: 'Product 1', isActive: true },
    ] as any)

    const request = new Request('http://localhost/api/products')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.products).toHaveLength(1)
    expect(prisma.product.findMany).toHaveBeenCalled()
  })

  it('should filter by category when provided', async () => {
    vi.mocked(productListCache.get).mockResolvedValue(null)
    vi.mocked(prisma.product.findMany).mockResolvedValue([])

    const request = new Request('http://localhost/api/products?category=electronics')
    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ category: 'electronics' }),
      })
    )
  })

  it('should force refresh when refresh=true', async () => {
    vi.mocked(prisma.product.findMany).mockResolvedValue([])

    const request = new Request('http://localhost/api/products?refresh=true')
    const response = await GET(request)

    expect(productListCache.get).not.toHaveBeenCalled()
    expect(prisma.product.findMany).toHaveBeenCalled()
  })

  it('should return 500 on database error', async () => {
    vi.mocked(productListCache.get).mockResolvedValue(null)
    vi.mocked(prisma.product.findMany).mockRejectedValue(new Error('DB error'))

    const request = new Request('http://localhost/api/products')
    const response = await GET(request)

    expect(response.status).toBe(500)
  })
})

describe('POST /api/products', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 401 when not authenticated', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null)

    const request = new Request('http://localhost/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', description: 'Test', price: 99, stock: 10 }),
    })

    const response = await POST(request)

    expect(response.status).toBe(401)
  })

  it('should create product with valid data', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ userId: 'user_1', email: 'admin@test.com' })
    vi.mocked(prisma.product.create).mockResolvedValue({
      id: 'prod_1',
      name: 'New Product',
      description: 'Description',
      price: 99.99,
      stock: 10,
    } as any)

    const request = new Request('http://localhost/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'New Product',
        description: 'Description',
        price: 99.99,
        stock: 10,
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.name).toBe('New Product')
    expect(prisma.product.create).toHaveBeenCalled()
  })

  it('should return 400 for missing required fields', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ userId: 'user_1', email: 'admin@test.com' })

    const request = new Request('http://localhost/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test' }), // Missing description, price, stock
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing required fields')
  })

  it('should return 500 on database error', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ userId: 'user_1', email: 'admin@test.com' })
    vi.mocked(prisma.product.create).mockRejectedValue(new Error('DB error'))

    const request = new Request('http://localhost/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test',
        description: 'Test',
        price: 99,
        stock: 10,
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(500)
  })
})