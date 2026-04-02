import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Star } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { ProductReviews } from '@/components/product-reviews'

interface ProductPageProps {
  params: Promise<{ id: string }>
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
  const { id } = await params
  const data = await getProduct(id)

  if (!data) {
    return (
      <div className="min-h-screen bg-white">
        {/* Simple Header */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4">
            <nav className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/20">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-xl font-bold tracking-tight">SHOPMAX</span>
              </Link>
            </nav>
          </div>
        </header>

        <main className="pt-32 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
              <p className="text-gray-500 mb-6">The product you're looking for doesn't exist</p>
              <Link href="/products" className="text-orange-500 hover:text-orange-600">
                Back to Products
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const product = data

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
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/products" className="hover:text-gray-600">Products</Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 truncate">{product.name}</span>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                {product.category && (
                  <p className="text-sm text-orange-500 font-medium mb-2">{product.category}</p>
                )}
                <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
                <p className="mt-2 text-3xl font-bold text-orange-500">{formatPrice(product.price)}</p>
              </div>

              <p className="text-gray-600 leading-relaxed">{product.description}</p>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Availability:</span>
                {product.stock > 0 ? (
                  <span className={`font-medium ${product.stock <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                    {product.stock <= 5 ? `Only ${product.stock} left in stock` : 'In Stock'}
                  </span>
                ) : (
                  <span className="font-medium text-red-500">Out of Stock</span>
                )}
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
                  <span className="text-sm text-gray-500">
                    {product.avgRating.toFixed(1)} ({product.reviewsCount || 0} reviews)
                  </span>
                </div>
              )}

              <AddToCartButton
                productId={product.id}
                disabled={product.stock === 0}
              />

              {/* Reviews Section */}
              <ProductReviews productId={product.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}