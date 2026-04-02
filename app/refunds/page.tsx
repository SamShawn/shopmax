'use client'

import Link from 'next/link'
import { Header } from '@/components/header'

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-orange-500/10 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-orange-500/8 blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Refund <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              We want you to be completely satisfied with your purchase. Learn about our refund process.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 mb-8">
              <strong>Last updated:</strong> January 1, 2026
            </p>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Our Refund Promise</h2>
                <p className="text-gray-600">
                  At SHOPMAX, we stand behind the quality of our products. If you're not completely satisfied with your
                  purchase, we'll make it right. Our goal is to ensure every customer has a positive shopping experience.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Eligible Items for Refund</h2>
                <p className="text-gray-600 mb-4">
                  Most items can be returned within 30 days of delivery for a full refund. Items must meet the following criteria:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Items must be unused and in the same condition you received them</li>
                  <li>Items must be in the original packaging</li>
                  <li>Proof of purchase (order confirmation or receipt) is required</li>
                  <li>Items must not be damaged due to misuse or improper handling</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">3. Non-Refundable Items</h2>
                <p className="text-gray-600 mb-4">
                  The following items cannot be refunded:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Perishable goods (food, flowers, plants)</li>
                  <li>Personal care items that have been opened or used</li>
                  <li>Software products that have been downloaded or activated</li>
                  <li>Gift cards</li>
                  <li>Items marked as "final sale" or "as is"</li>
                  <li>Products damaged due to customer negligence</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">4. How to Request a Refund</h2>
                <p className="text-gray-600 mb-4">
                  To initiate a refund, follow these steps:
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-600">
                  <li>Log into your SHOPMAX account</li>
                  <li>Go to "My Orders" and select the order containing the item you wish to return</li>
                  <li>Click "Request Refund" next to the item(s)</li>
                  <li>Select the reason for return from the dropdown menu</li>
                  <li>Submit your request</li>
                </ol>
                <p className="text-gray-600 mt-4">
                  Alternatively, you can contact our support team at <strong>support@shopmax.com</strong> or call <strong>+1 (555) 987-6543</strong>.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Refund Timeline</h2>
                <p className="text-gray-600 mb-4">
                  Once we receive your returned item, we'll process your refund within 5-7 business days:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Credit/Debit Card:</strong> 5-10 business days</li>
                  <li><strong>PayPal:</strong> 1-3 business days</li>
                  <li><strong>Store Credit:</strong> Immediately</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Please note that it may take additional time for your bank to process and post the refund to your account.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">6. Return Shipping</h2>
                <p className="text-gray-600 mb-4">
                  Return shipping costs depend on the reason for return:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Defective or damaged items:</strong> We'll cover return shipping costs</li>
                  <li><strong>Wrong item received:</strong> We'll cover return shipping costs</li>
                  <li><strong>Changed mind / other reasons:</strong> Customer is responsible for return shipping</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  For defective returns, we provide a prepaid shipping label. Simply attach the label to your return package
                  and drop it off at the nearest shipping location.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">7. Exchanges</h2>
                <p className="text-gray-600">
                  If you received a defective or damaged item and would like an exchange, we'll ship the replacement item
                  as soon as we receive your return—at no additional cost. For other exchanges, please return the original
                  item and place a new order for the desired item.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">8. Damaged or Defective Items</h2>
                <p className="text-gray-600">
                  If you receive a damaged or defective item, please contact us immediately with photos of the damage.
                  We'll arrange for a replacement or full refund, and we'll cover all associated shipping costs.
                  Please report damaged items within 48 hours of delivery.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">9. Late or Missing Refunds</h2>
                <p className="text-gray-600 mb-4">
                  If you haven't received your refund after the expected timeframe, please:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Check your bank account again</li>
                  <li>Contact your credit card company (processing time varies)</li>
                  <li>Contact your bank (processing time varies)</li>
                  <li>If after 15 days you still don't have your refund, please contact us</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">10. International Returns</h2>
                <p className="text-gray-600">
                  For international orders, customers are responsible for return shipping costs and any applicable customs
                  fees. We recommend using a trackable shipping method. Please contact our support team for assistance with
                  international returns.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">11. Contact Us</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about our Refund Policy, please contact us:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Email: support@shopmax.com</li>
                  <li>Phone: +1 (555) 987-6543</li>
                  <li>Address: 123 Commerce Street, San Francisco, CA 94105</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Our support team is available Monday-Friday, 9AM-6PM PST.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Still Have Questions?</h2>
            <p className="text-gray-600 mb-8">
              Our customer support team is here to help you with any concerns.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-lg font-medium transition-all duration-300">
                Contact Support
              </Link>
              <Link href="/" className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-gray-700 rounded-xl text-lg hover:bg-gray-100 transition-all duration-300">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">SHOPMAX</span>
              </Link>
              <p className="text-gray-400 text-sm">
                The next generation e-commerce platform powered by cutting-edge technology.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Products</h4>
              <div className="space-y-3">
                <Link href="/category/electronics" className="block text-sm text-gray-400 hover:text-white transition-colors">Electronics</Link>
                <Link href="/category/fashion" className="block text-sm text-gray-400 hover:text-white transition-colors">Fashion</Link>
                <Link href="/category/home" className="block text-sm text-gray-400 hover:text-white transition-colors">Home & Living</Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <div className="space-y-3">
                <Link href="/about" className="block text-sm text-gray-400 hover:text-white transition-colors">About</Link>
                <Link href="/contact" className="block text-sm text-gray-400 hover:text-white transition-colors">Contact</Link>
                <Link href="/careers" className="block text-sm text-gray-400 hover:text-white transition-colors">Careers</Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <div className="space-y-3">
                <Link href="/privacy" className="block text-sm text-gray-400 hover:text-white transition-colors">Privacy</Link>
                <Link href="/terms" className="block text-sm text-gray-400 hover:text-white transition-colors">Terms</Link>
                <Link href="/refunds" className="block text-sm text-gray-400 hover:text-white transition-colors">Refunds</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2026 SHOPMAX. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}