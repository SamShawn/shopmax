'use client'

import Link from 'next/link'
import { Header } from '@/components/header'

export default function PrivacyPage() {
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
              Privacy <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <p className="text-gray-600 mb-8">
              <strong>Last updated:</strong> January 1, 2026
            </p>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Information We Collect</h2>
                <p className="text-gray-600 mb-4">
                  We collect information you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Account information (name, email, phone number)</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>Shipping and billing addresses</li>
                  <li>Order history and preferences</li>
                  <li>Communications with our support team</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">2. How We Use Your Information</h2>
                <p className="text-gray-600 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Process and fulfill your orders</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Send you important updates and promotional materials</li>
                  <li>Improve our products and services</li>
                  <li>Prevent fraud and ensure security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">3. Information Sharing</h2>
                <p className="text-gray-600 mb-4">
                  We do not sell your personal information. We may share your information with:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Service providers who assist in our operations (payment processing, shipping)</li>
                  <li>Business partners with your consent</li>
                  <li>Legal authorities when required by law</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Data Security</h2>
                <p className="text-gray-600">
                  We implement appropriate technical and organizational measures to protect your personal information,
                  including encryption of payment data, secure socket layer (SSL) technology, and regular security audits.
                  All payment information is processed through Stripe's PCI-compliant infrastructure.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Your Rights</h2>
                <p className="text-gray-600 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request restriction of processing</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">6. Cookies and Tracking Technologies</h2>
                <p className="text-gray-600">
                  We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic,
                  and understand where our visitors come from. You can control cookies through your browser settings.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">7. Third-Party Links</h2>
                <p className="text-gray-600">
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices
                  of these websites and encourage you to review their privacy policies.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">8. Children's Privacy</h2>
                <p className="text-gray-600">
                  Our services are not intended for children under 13. We do not knowingly collect personal information
                  from children under 13. If we become aware of such collection, we will delete the information promptly.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">9. Changes to This Policy</h2>
                <p className="text-gray-600">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                  the new policy on this page and updating the "Last updated" date. Your continued use of our services
                  after any changes indicates your acceptance of the new policy.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">10. Contact Us</h2>
                <p className="text-gray-600">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
                  <li>Email: privacy@shopmax.com</li>
                  <li>Address: 123 Commerce Street, San Francisco, CA 94105</li>
                </ul>
              </div>
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