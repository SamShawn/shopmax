'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import { CartItem } from '@/components/cart-item'
import { CartSummary, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/components/cart-summary'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'

export default function CartPage() {
  const {
    cartItems,
    cartTotal,
    loading,
    loadCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  const [isClearing, setIsClearing] = useState(false)

  // Calculate shipping
  const shipping = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = cartTotal + shipping
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Reload cart on mount to ensure fresh data
  useEffect(() => {
    loadCart()
  }, [loadCart])

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return

    setIsClearing(true)
    try {
      await clearCart()
    } finally {
      setIsClearing(false)
    }
  }

  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4">
            <nav className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-xl font-bold tracking-tight">SHOPMAX</span>
              </Link>

              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            </nav>
          </div>
        </header>

        <main className="pt-32 pb-16">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
              <Link href="/" className="hover:text-gray-600">Home</Link>
              <ArrowRight className="w-4 h-4" />
              <span className="text-gray-900">Cart</span>
            </div>

            <div className="animate-pulse">
              <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
              <div className="flex gap-12">
                <div className="flex-1 space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
                  ))}
                </div>
                <div className="w-80 h-96 bg-gray-100 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">SHOPMAX</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900">Cart</span>
          </div>

          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
              <Link href="/products">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            /* Cart Items */
            <div className="flex gap-12">
              {/* Cart Items List */}
              <div className="flex-1">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    imageUrl={item.imageUrl}
                    stock={item.stock || 99}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>

              {/* Cart Summary */}
              <div className="w-80 shrink-0">
                <CartSummary
                  subtotal={cartTotal}
                  shipping={shipping}
                  total={total}
                  itemCount={itemCount}
                  onClearCart={handleClearCart}
                  isClearing={isClearing}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}