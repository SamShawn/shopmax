'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useCart } from '@/hooks/use-cart'
import { toast } from '@/components/lib/use-toast'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  id: string
  name: string
  description: string
  price: string
  imageUrl?: string
  stock: number
}

export function ProductCard({ id, name, description, price, imageUrl, stock }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    try {
      await addToCart(id, 1)
      toast({
        title: 'Added to cart',
        description: `${name} has been added to your cart`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/products/${id}`}>
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden bg-muted">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
            {stock <= 5 && stock > 0 && (
              <span className="absolute top-2 right-2 rounded bg-orange-500 px-2 py-1 text-xs text-white">
                Low Stock
              </span>
            )}
            {stock === 0 && (
              <span className="absolute top-2 right-2 rounded bg-red-500 px-2 py-1 text-xs text-white">
                Out of Stock
              </span>
            )}
          </div>
          <div className="p-4">
            <h3 className="mb-2 text-lg font-semibold line-clamp-1">{name}</h3>
            <p className="mb-2 text-sm text-muted-foreground line-clamp-2">{description}</p>
            <p className="text-lg font-bold">{formatPrice(price)}</p>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={stock === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  )
}
