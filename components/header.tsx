'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, User, Package, LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'

function DesktopNav({ user, cartCount, logout }: { user: any, cartCount: number, logout: () => void }) {
  return (
    <nav className="hidden md:flex items-center space-x-4">
      {user ? (
        <>
          <Link href="/admin" className="text-sm font-medium hover:text-primary">
            Admin
          </Link>
          <Link href="/orders" className="text-sm font-medium hover:text-primary">
            Orders
          </Link>
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>

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
  )
}

function MobileNav({ user, cartCount, logout }: { user: any, cartCount: number, logout: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            <Link href="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
              <Package className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Shopmax</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-4 mt-6">
          {user ? (
            <>
              <Link
                href="/admin"
                className="text-sm font-medium hover:text-primary py-2"
                onClick={() => setOpen(false)}
              >
                Admin
              </Link>
              <Link
                href="/orders"
                className="text-sm font-medium hover:text-primary py-2"
                onClick={() => setOpen(false)}
              >
                Orders
              </Link>
              <Link
                href="/cart"
                className="relative text-sm font-medium hover:text-primary py-2"
                onClick={() => setOpen(false)}
              >
                <span className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {cartCount}
                    </span>
                  )}
                </span>
              </Link>
              <div className="flex items-center space-x-2 py-2">
                <User className="h-5 w-5" />
                <span className="text-sm">{user.name || user.email}</span>
              </div>
              <Button variant="ghost" className="justify-start px-0" onClick={() => { logout(); setOpen(false) }}>
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium hover:text-primary py-2"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium hover:text-primary py-2"
                onClick={() => setOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export function Header() {
  const { cartItems } = useCart()
  const { user, logout } = useAuth()
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Shopmax</span>
        </Link>

        <MobileNav user={user} cartCount={cartCount} logout={logout} />
        <DesktopNav user={user} cartCount={cartCount} logout={logout} />
      </div>
    </header>
  )
}
