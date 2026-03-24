'use client'

import { useState, useEffect } from 'react'
import { toast } from '@/components/lib/use-toast'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  // 购物车总价
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // 加载购物车
  const loadCart = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setCartItems(data.items || [])
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setLoading(false)
    }
  }

  // 添加商品到购物车
  const addToCart = async (productId: string, quantity: number) => {
    try {
      setLoading(true)
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      })

      if (response.ok) {
        const data = await response.json()
        setCartItems(data.items || [])
        return data
      } else {
        throw new Error('Failed to add to cart')
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 更新商品数量
  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setLoading(true)
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      })

      if (response.ok) {
        const data = await response.json()
        setCartItems(data.items || [])
      }
    } catch (error) {
      console.error('Failed to update cart:', error)
    } finally {
      setLoading(false)
    }
  }

  // 删除商品
  const removeFromCart = async (productId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const data = await response.json()
        setCartItems(data.items || [])
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error)
    } finally {
      setLoading(false)
    }
  }

  // 清空购物车
  const clearCart = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cart', {
        method: 'DELETE',
      })

      if (response.ok) {
        setCartItems([])
      }
    } catch (error) {
      console.error('Failed to clear cart:', error)
    } finally {
      setLoading(false)
    }
  }

  // 初始化购物车
  useEffect(() => {
    loadCart()
  }, [])

  return {
    cartItems,
    cartTotal,
    loading,
    loadCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  }
}
