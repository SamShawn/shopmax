import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import stripe from '@/lib/stripe'
import { cartCache } from '@/lib/redis'
import { cookies } from 'next/headers'

/**
 * POST /api/checkout/create-session
 * 创建 Stripe Checkout Session
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    const body = await request.json()
    const { shippingAddress, billingAddress } = body

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      )
    }

    let cartItems: any[] = []

    if (user) {
      // 已登录：从数据库获取购物车
      cartItems = await prisma.cartItem.findMany({
        where: { userId: user.userId },
        include: {
          product: true,
        },
      })
    } else {
      // 未登录：从 Redis 获取购物车
      const cookieStore = await cookies()
      const cartId = cookieStore.get('cart-id')?.value

      if (cartId) {
        const cart = await cartCache.get(cartId)
        const productIds = cart.items.map((item: any) => item.id)

        if (productIds.length > 0) {
          const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
          })

          cartItems = cart.items.map((cartItem: any) => {
            const product = products.find((p) => p.id === cartItem.id)
            return product
              ? {
                  product,
                  quantity: cartItem.quantity,
                }
              : null
          }).filter(Boolean)
        }
      }
    }

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // 验证库存
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.product.name}` },
          { status: 400 }
        )
      }
    }

    // 准备 Stripe line items
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          description: item.product.description?.substring(0, 100),
          images: item.product.imageUrl ? [item.product.imageUrl] : [],
        },
        unit_amount: Math.round(Number(item.product.price) * 100), // 转换为 cents
      },
      quantity: item.quantity,
    }))

    // 创建 Stripe Customer (如果用户已登录)
    let stripeCustomerId: string | undefined

    if (user) {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.userId },
      })

      if (dbUser?.stripeCustomerId) {
        stripeCustomerId = dbUser.stripeCustomerId
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          name: dbUser?.name,
        })

        stripeCustomerId = customer.id
        await prisma.user.update({
          where: { id: user.userId },
          data: { stripeCustomerId },
        });
      }
    }

    // 创建 Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      customer: stripeCustomerId,
      customer_email: user ? undefined : shippingAddress.email,
      metadata: {
        userId: user?.userId || '',
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: billingAddress ? JSON.stringify(billingAddress) : '',
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP', 'CN'],
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Failed to create checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
