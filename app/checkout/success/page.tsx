'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (sessionId) {
      // 这里可以调用 API 获取订单详情
      // 简化起见，显示成功消息
      console.log('Checkout session:', sessionId)
    }
  }, [sessionId])

  if (!sessionId) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
          <Card className="mx-auto max-w-md text-center">
            <CardHeader>
              <CardTitle>Invalid Checkout</CardTitle>
              <CardDescription>Please complete your checkout first</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button>Return to Home</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <Card className="mx-auto max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle>Order Confirmed!</CardTitle>
            <CardDescription>Thank you for your purchase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We've sent a confirmation email with your order details.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/orders">
                <Button className="w-full">View Orders</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">Continue Shopping</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
