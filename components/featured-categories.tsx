import Link from 'next/link'
import { Button } from '@/components/ui/button'

const categories = [
  { name: 'Electronics', count: 3 },
  { name: 'Fashion', count: 1 },
  { name: 'Sports', count: 1 },
  { name: 'Home', count: 2 },
]

export function FeaturedCategories() {
  return (
    <div className="mb-12">
      <h2 className="mb-6 text-2xl font-bold">Shop by Category</h2>
      <div className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <Link key={category.name} href={`/category/${category.name.toLowerCase()}`}>
            <Button variant="outline" className="text-sm">
              {category.name} ({category.count})
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
