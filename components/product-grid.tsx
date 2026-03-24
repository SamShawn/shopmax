import { ProductCard } from '@/components/product-card'
import { getProducts } from '@/app/api/products/route'

export async function ProductGrid() {
  const products = await getProducts()

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold">Featured Products</h2>
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
    </div>
  )
}
