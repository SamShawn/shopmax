import Link from 'next/link'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <Card className="mx-auto max-w-md text-center">
          <CardHeader>
            <CardTitle>Payment Cancelled</CardTitle>
            <CardDescription>Your checkout was cancelled</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your order has not been processed. You can try again whenever you're ready.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/checkout">
                <Button className="w-full">Return to Checkout</Button>
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
