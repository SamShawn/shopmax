import { ProductGrid } from '@/components/product-grid'
import { Header } from '@/components/header'
import { FeaturedCategories } from '@/components/featured-categories'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold">Welcome to Shopora</h1>
          <p className="text-lg opacity-90">
            Discover premium products with fast shipping and secure checkout
          </p>
        </div>

        <FeaturedCategories />
        <ProductGrid />
      </main>
    </div>
  )
}
