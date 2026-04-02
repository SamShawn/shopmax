import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useCart, type CartItem } from '@/hooks/use-cart'

// Mock fetch globally
global.fetch = vi.fn()

// Mock toast
vi.mock('@/components/lib/use-toast', () => ({
  toast: vi.fn(),
}))

describe('useCart Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const mockCartItems: CartItem[] = [
    { id: 'prod_1', name: 'Product 1', price: 99.99, quantity: 2, stock: 10 },
    { id: 'prod_2', name: 'Product 2', price: 49.99, quantity: 1, stock: 5 },
  ]

  it('should load cart on mount', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockCartItems }),
    } as Response)

    const { result } = renderHook(() => useCart())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.cartItems).toHaveLength(2)
    expect(result.current.cartTotal).toBe(249.97) // 99.99*2 + 49.99*1
    expect(fetch).toHaveBeenCalledWith('/api/cart')
  })

  it('should calculate cart total correctly', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockCartItems }),
    } as Response)

    const { result } = renderHook(() => useCart())

    await waitFor(() => expect(result.current.loading).toBe(false))

    // 99.99 * 2 + 49.99 * 1 = 249.97
    expect(result.current.cartTotal).toBeCloseTo(249.97, 2)
  })

  it('should add item to cart', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: mockCartItems }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [...mockCartItems, { id: 'prod_3', name: 'Product 3', price: 29.99, quantity: 1, stock: 20 }] }),
      } as Response)

    const { result } = renderHook(() => useCart())

    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.addToCart('prod_3', 1)
    })

    expect(fetch).toHaveBeenLastCalledWith(
      '/api/cart',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ productId: 'prod_3', quantity: 1 }),
      })
    )
  })

  it('should update item quantity', async () => {
    const updatedItems = [...mockCartItems]
    updatedItems[0].quantity = 5

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: mockCartItems }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: updatedItems }),
      } as Response)

    const { result } = renderHook(() => useCart())

    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.updateQuantity('prod_1', 5)
    })

    expect(fetch).toHaveBeenLastCalledWith(
      '/api/cart',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ productId: 'prod_1', quantity: 5 }),
      })
    )
  })

  it('should remove item from cart', async () => {
    const remainingItems = [mockCartItems[1]]

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: mockCartItems }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: remainingItems }),
      } as Response)

    const { result } = renderHook(() => useCart())

    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.removeFromCart('prod_1')
    })

    expect(fetch).toHaveBeenLastCalledWith(
      '/api/cart?productId=prod_1',
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  it('should clear entire cart', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: mockCartItems }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [] }),
      } as Response)

    const { result } = renderHook(() => useCart())

    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.clearCart()
    })

    expect(fetch).toHaveBeenLastCalledWith(
      '/api/cart',
      expect.objectContaining({ method: 'DELETE' })
    )
    expect(result.current.cartItems).toHaveLength(0)
  })

  it('should handle empty cart', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] }),
    } as Response)

    const { result } = renderHook(() => useCart())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.cartItems).toEqual([])
    expect(result.current.cartTotal).toBe(0)
  })

  it('should rethrow error when addToCart fails', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: mockCartItems }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
      } as Response)

    const { result } = renderHook(() => useCart())

    await waitFor(() => expect(result.current.loading).toBe(false))

    await expect(result.current.addToCart('invalid', 1)).rejects.toThrow()
  })
})