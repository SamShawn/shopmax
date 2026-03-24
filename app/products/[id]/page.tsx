import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, Star } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface ProductPageProps {
  params: {
    id: string
  }
}

async function getProduct(id: string) {
  const response = await fetch(`http://localhost:3000/api/products/${id}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  return response.json()
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = params
  const data = await getProduct(id)

  if (!data) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Not Found</CardTitle>
              <CardDescription>The product you're looking for doesn't exist</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button>Back to Products</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const product = data

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              {product.category && (
                <p className="mb-2 text-sm text-muted-foreground">{product.category}</p>
              )}
              <h1 className="text-4xl font-bold">{product.name}</h1>
              <p className="mt-2 text-2xl font-bold">{formatPrice(product.price)}</p>
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">In Stock:</span>
              <span className={`font-medium ${product.stock <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                {product.stock} units
              </span>
            </div>

            {product.avgRating && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(product.avgRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              disabled={product.stock === 0}
              onClick={async () => {
                'use client'
                const { addToCart } = await import('@/hooks/use-cart')
                const cart = addToCart()
                await cart.addToCart(product.id, 1)
                alert('Added to cart!')
              }}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>

            {/* Reviews */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Reviews</h2>
                <div className="space-y-4">
                  {product.reviews.map((review: any) => (
                    <Card key={review.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">
                              {review.user?.name || 'Anonymous'}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardHeader>
                      {review.comment && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
