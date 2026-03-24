import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import stripe from '@/lib/stripe'
import { productCache } from '@/lib/redis'
import Stripe from 'stripe'

/**
 * POST /api/checkout/webhook
 * 处理 Stripe Webhook 事件
 */
export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      )
    }

    // 验证 webhook 签名
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )

    console.log(`Webhook received: ${event.type}`)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        console.log('Checkout session completed:', session.id)

        // 获取元数据
        const userId = session.metadata?.userId
        const shippingAddress = JSON.parse(session.metadata?.shippingAddress || '{}')
        const billingAddress = session.metadata?.billingAddress
          ? JSON.parse(session.metadata.billingAddress)
          : undefined

        // 获取 line items
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

        if (!lineItems.data.length) {
          console.error('No line items found for session:', session.id)
          break
        }

        // 创建订单
        const orderItems = lineItems.data.map((item) => ({
          productId: item.price.metadata?.productId || '',
          quantity: item.quantity,
          price: item.price.unit_amount ? item.price.unit_amount / 100 : 0,
          productName: item.description || '',
          productImage: item.price?.metadata?.productImage,
        }))

        const totalAmount = lineItems.data.reduce(
          (sum, item) =>
            sum + (item.amount_total ? item.amount_total / 100 : 0),
          0
        )

        // 如果有用户 ID，使用数据库购物车
        let cartItems: any[] = []

        if (userId) {
          cartItems = await prisma.cartItem.findMany({
            where: { userId },
            include: { product: true },
          })

          // 清空用户购物车
          await prisma.cartItem.deleteMany({
            where: { userId },
          })
        }

        // 创建订单记录
        const order = await prisma.order.create({
          data: {
            userId: userId || 'guest', // 如果是游客，使用特殊标识
            status: 'PROCESSING',
            totalAmount,
            stripePaymentId: session.payment_intent as string,
            stripeCustomerId: session.customer as string,
            shippingAddress: JSON.stringify(shippingAddress),
            billingAddress: billingAddress ? JSON.stringify(billingAddress) : null,
            items: {
              create: orderItems,
            },
          },
        })

        console.log('Order created:', order.id)

        // 更新产品库存
        for (const item of orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          })
        }

        console.log('Stock updated for order:', order.id)

        // 清除产品缓存
        for (const item of orderItems) {
          await productCache.invalidate(item.productId)
        }

        break
      }

      case 'payment_intent.succeeded': {
        console.log('Payment succeeded')
        break
      }

      case 'payment_intent.failed': {
        console.log('Payment failed')
        // 可以在这里更新订单状态为 FAILED
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}
