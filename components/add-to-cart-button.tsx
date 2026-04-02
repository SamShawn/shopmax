'use client'

import { useState } from 'react'
import { ShoppingCart, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'

interface AddToCartButtonProps {
  productId: string
  disabled?: boolean
}

export function AddToCartButton({ productId, disabled }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      await addToCart(productId, 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      size="lg"
      className="w-full py-6 text-lg bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      disabled={disabled || loading}
      onClick={handleAddToCart}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Adding...
        </>
      ) : added ? (
        <>
          <Check className="mr-2 h-5 w-5" />
          Added to Cart!
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" />
          {disabled ? 'Out of Stock' : 'Add to Cart'}
        </>
      )}
    </Button>
  )
}