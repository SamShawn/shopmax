import { ProductCard } from '@/components/product-card'
import { Header } from '@/components/header'
import { prisma } from '@/lib/prisma'

interface CategoryPageProps {
  params: {
    name: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { name } = params

  // 将类别名称转换为 Title Case
  const categoryName = name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  const products = await prisma.product.findMany({
    where: {
      category: categoryName,
      isActive: true,
    },
  })

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">{categoryName}</h1>

        {products.length === 0 ? (
          <p className="text-muted-foreground">No products found in this category</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price.toString()}
                imageUrl={product.imageUrl}
                stock={product.stock}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
