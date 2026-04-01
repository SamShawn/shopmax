'use client'

import Link from 'next/link'
import { ShoppingCart, User, Package, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'

export function Header() {
  const { cartItems, cartTotal } = useCart()
  const { user, logout } = useAuth()
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Shopmax</span>
        </Link>

        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/admin" className="text-sm font-medium hover:text-primary">
                Admin
              </Link>
              <Link href="/orders" className="text-sm font-medium hover:text-primary">
                Orders
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Shopping Cart</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {cartItems.length === 0 ? (
                      <p className="text-center text-muted-foreground">Your cart is empty</p>
                    ) : (
                      <>
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                              </p>
                            </div>
                            <p className="font-medium">
                              ${(Number(item.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                        <div className="border-t pt-4">
                          <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                          </div>
                          <Link href="/checkout" className="block mt-4">
                            <Button className="w-full">Proceed to Checkout</Button>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span className="text-sm">{user.name || user.email}</span>
              </div>

              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
