import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productCache, productListCache } from '@/lib/redis'
import { getCurrentUser } from '@/lib/auth'

/**
 * GET /api/products
 * 获取产品列表（支持分类筛选和缓存）
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const forceRefresh = searchParams.get('refresh') === 'true'

    // 尝试从缓存获取（除非强制刷新）
    if (!forceRefresh) {
      const cached = await productListCache.get(category || undefined)
      if (cached) {
        return NextResponse.json(cached)
      }
    }

    // 从数据库获取
    const where = {
      isActive: true,
      ...(category ? { category } : {}),
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    const result = {
      products,
      total: products.length,
    }

    // 缓存结果
    await productListCache.set(category || undefined, result)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/products
 * 创建新产品（需要管理员权限）
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, stock, imageUrl, category } = body

    if (!name || !description || !price || stock === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        imageUrl,
        category,
      },
    })

    // 清除产品缓存
    await productListCache.invalidate()

    return NextResponse.json(product)
  } catch (error) {
    console.error('Failed to create product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

// 导出供服务端组件使用
export async function getProducts() {
  const response = await GET(new Request('http://localhost/api/products'))
  const data = await response.json()
  return data.products || []
}
