'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface CartSummaryProps {
  subtotal: number
  shipping: number
  total: number
  itemCount: number
  onClearCart: () => Promise<void>
  isClearing?: boolean
}

// Free shipping threshold
const FREE_SHIPPING_THRESHOLD = 100
const SHIPPING_COST = 10

export function CartSummary({
  subtotal,
  shipping,
  total,
  itemCount,
  onClearCart,
  isClearing = false,
}: CartSummaryProps) {
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal

  return (
    <div className="bg-gray-50 rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      {/* Free Shipping Progress */}
      {remainingForFreeShipping > 0 && (
        <div className="mb-4 p-3 bg-orange-50 rounded-lg">
          <p className="text-sm text-orange-700">
            Add <span className="font-semibold">${remainingForFreeShipping.toFixed(2)}</span> more for free shipping!
          </p>
        </div>
      )}

      {remainingForFreeShipping <= 0 && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            You qualify for free shipping!
          </p>
        </div>
      )}

      {/* Summary Lines */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-gray-600">
          <span>Items ({itemCount})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
        </div>

        <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <Link href="/checkout" className="block mt-6">
        <Button
          className="w-full py-6 text-lg bg-orange-500 hover:bg-orange-600"
          disabled={itemCount === 0}
        >
          Proceed to Checkout
        </Button>
      </Link>

      {/* Continue Shopping */}
      <Link href="/products" className="block mt-3">
        <Button variant="outline" className="w-full">
          Continue Shopping
        </Button>
      </Link>

      {/* Clear Cart */}
      {itemCount > 0 && (
        <button
          onClick={onClearCart}
          disabled={isClearing}
          className="w-full mt-4 text-sm text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
        >
          {isClearing ? 'Clearing...' : 'Clear Cart'}
        </button>
      )}
    </div>
  )
}

export { FREE_SHIPPING_THRESHOLD, SHIPPING_COST }