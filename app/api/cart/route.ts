import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { cartCache } from '@/lib/redis'
import { cookies } from 'next/headers'

/**
 * 获取购物车标识（已登录用户用 userId，未登录用 cartId）
 */
async function getCartId(): Promise<{ userId?: string; cartId?: string }> {
  const user = await getCurrentUser()
  if (user) {
    return { userId: user.userId }
  }

  // 未登录用户，使用 cookie 中的 cartId
  const cookieStore = await cookies()
  let cartId = cookieStore.get('cart-id')?.value

  if (!cartId) {
    cartId = crypto.randomUUID()
    cookieStore.set('cart-id', cartId, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      sameSite: 'lax',
    })
  }

  return { cartId }
}

/**
 * GET /api/cart
 * 获取购物车
 */
export async function GET() {
  try {
    const { userId, cartId } = await getCartId()

    if (userId) {
      // 已登录：从数据库获取
      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
              stock: true,
              isActive: true,
            },
          },
        },
      })

      const items = cartItems
        .filter((item) => item.product.isActive)
        .map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: Number(item.product.price),
          quantity: item.quantity,
          imageUrl: item.product.imageUrl,
          stock: item.product.stock,
        }))

      return NextResponse.json({ items })
    } else {
      // 未登录：从 Redis 获取
      const cart = await cartCache.get(cartId!)
      const productIds = cart.items.map((item: any) => item.id)

      if (productIds.length === 0) {
        return NextResponse.json({ items: [] })
      }

      const products = await prisma.product.findMany({
        where: {
          id: { in: productIds },
          isActive: true,
        },
      })

      const items = cart.items
        .map((cartItem: any) => {
          const product = products.find((p) => p.id === cartItem.id)
          if (!product) return null
          return {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: cartItem.quantity,
            imageUrl: product.imageUrl,
            stock: product.stock,
          }
        })
        .filter(Boolean)

      return NextResponse.json({ items })
    }
  } catch (error) {
    console.error('Failed to fetch cart:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}

/**
 * POST /api/cart
 * 添加商品到购物车
 */
export async function POST(request: Request) {
  try {
    const { userId, cartId } = await getCartId()
    const body = await request.json()
    const { productId, quantity = 1 } = body

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    // 验证商品存在且有库存
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (!product.isActive) {
      return NextResponse.json({ error: 'Product is not available' }, { status: 400 })
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
    }

    if (userId) {
      // 已登录：更新数据库
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          userId_productId: { userId, productId },
        },
      })

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity
        if (newQuantity > product.stock) {
          return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
        }
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity },
        })
      } else {
        await prisma.cartItem.create({
          data: { userId, productId, quantity },
        })
      }
    } else {
      // 未登录：更新 Redis
      await cartCache.addItem(cartId!, productId, quantity)
    }

    // 返回更新后的购物车
    return GET()
  } catch (error) {
    console.error('Failed to add to cart:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}

/**
 * PUT /api/cart
 * 更新购物车商品数量
 */
export async function PUT(request: Request) {
  try {
    const { userId, cartId } = await getCartId()
    const body = await request.json()
    const { productId, quantity } = body

    if (!productId || quantity === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (userId) {
      if (quantity <= 0) {
        await prisma.cartItem.deleteMany({
          where: { userId, productId },
        })
      } else {
        // 验证库存
        const product = await prisma.product.findUnique({
          where: { id: productId },
        })

        if (product && quantity > product.stock) {
          return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
        }

        await prisma.cartItem.updateMany({
          where: { userId, productId },
          data: { quantity },
        })
      }
    } else {
      if (quantity <= 0) {
        await cartCache.removeItem(cartId!, productId)
      } else {
        await cartCache.updateQuantity(cartId!, productId, quantity)
      }
    }

    return GET()
  } catch (error) {
    console.error('Failed to update cart:', error)
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 })
  }
}

/**
 * DELETE /api/cart
 * 清空购物车
 */
export async function DELETE(request: Request) {
  try {
    const { userId, cartId } = await getCartId()
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (userId) {
      if (productId) {
        await prisma.cartItem.deleteMany({
          where: { userId, productId },
        })
      } else {
        await prisma.cartItem.deleteMany({
          where: { userId },
        })
      }
    } else {
      if (productId) {
        await cartCache.removeItem(cartId!, productId)
      } else {
        await cartCache.clear(cartId!)
      }
    }

    return GET()
  } catch (error) {
    console.error('Failed to clear cart:', error)
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 })
  }
}
