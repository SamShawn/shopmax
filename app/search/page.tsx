'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Search, SlidersHorizontal, Loader2, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string | null
  category: string | null
  stock: number
  createdAt: string
}

interface SearchResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')

  const [results, setResults] = useState<Product[]>([])
  const [pagination, setPagination] = useState<SearchResponse['pagination'] | null>(null)
  const [loading, setLoading] = useState(false)

  const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Toys']

  const performSearch = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (minPrice) params.set('minPrice', minPrice)
      if (maxPrice) params.set('maxPrice', maxPrice)
      if (category) params.set('category', category)
      params.set('sort', sort)

      const response = await fetch(`/api/products/search?${params.toString()}`)
      const data: SearchResponse = await response.json()

      setResults(data.products)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }, [query, minPrice, maxPrice, category, sort])

  useEffect(() => {
    performSearch()
  }, [performSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (category) params.set('category', category)
    params.set('sort', sort)

    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    setCategory('')
    setSort('newest')
    router.push(`/search${query ? `?q=${encodeURIComponent(query)}` : ''}`)
  }

  const hasFilters = minPrice || maxPrice || category || sort !== 'newest'

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
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900">Search</span>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-3 max-w-2xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-12 h-14 text-lg rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <Button type="submit" size="lg" className="bg-orange-500 hover:bg-orange-600 px-8">
                Search
              </Button>
            </div>
          </form>

          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <div className="w-64 shrink-0">
              <div className="sticky top-28">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </h3>
                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-orange-500 hover:text-orange-600"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3">Price Range</h4>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="h-10"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3">Category</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={category === ''}
                        onChange={() => setCategory('')}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm">All Categories</span>
                    </label>
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={category === cat}
                          onChange={() => setCategory(cat)}
                          className="text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3">Sort By</h4>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  >
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                  </select>
                </div>

                <Button
                  onClick={handleSearch}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  Apply Filters
                </Button>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {loading ? 'Searching...' : `${pagination?.total || 0} results`}
                  {query && <span> for &quot;{query}&quot;</span>}
                </p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
              )}

              {/* Empty State */}
              {!loading && results.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                  {hasFilters && (
                    <Button onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}

              {/* Products Grid */}
              {!loading && results.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <div className="aspect-square bg-gray-100 relative overflow-hidden">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-orange-500 font-medium mb-1">
                          {product.category || 'General'}
                        </p>
                        <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                          {product.stock > 0 ? (
                            <span className="text-xs text-green-600">In Stock</span>
                          ) : (
                            <span className="text-xs text-red-500">Out of Stock</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    disabled={pagination.page <= 1}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString())
                      params.set('page', String(pagination.page - 1))
                      router.push(`/search?${params.toString()}`)
                    }}
                  >
                    Previous
                  </Button>
                  <span className="px-4 text-sm">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString())
                      params.set('page', String(pagination.page + 1))
                      router.push(`/search?${params.toString()}`)
                    }}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}