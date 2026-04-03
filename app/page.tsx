import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-orange-500/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-orange-500/8 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/5 blur-[150px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
              <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm text-gray-400">The future of shopping is here</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Shop Beyond</span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Imagination
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience the next generation of e-commerce. AI-powered recommendations,
              instant checkout, and premium quality—all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/register" className="inline-flex items-center justify-center px-8 py-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-lg font-medium transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-1">
                Start Shopping
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/products" className="inline-flex items-center justify-center px-8 py-6 border border-gray-700 text-gray-300 rounded-xl text-lg hover:bg-white/10 hover:border-gray-600 transition-all duration-300">
                Browse Catalog
              </Link>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm">
                <span className="text-orange-500 font-semibold">Next.js</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm">
                <span className="text-indigo-500 font-semibold">Stripe</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm">
                <span className="text-blue-700 font-semibold">PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Built for Performance</h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Every pixel optimized. Every interaction refined.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600">Next.js powered for sub-second page loads</p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Secure Payments</h3>
              <p className="text-gray-600">Stripe-powered checkout with PCI compliance</p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Reliable Storage</h3>
              <p className="text-gray-600">PostgreSQL database with automatic backups</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.05&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

            <div className="relative px-8 py-16 md:px-16 md:py-24 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to transform your shopping experience?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of satisfied customers who have upgraded to the future of e-commerce.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register" className="inline-flex items-center justify-center px-8 py-6 bg-white text-orange-500 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-xl">
                  Create Free Account
                </Link>
                <Link href="/products" className="inline-flex items-center justify-center px-8 py-6 border border-white/30 text-white rounded-xl text-lg hover:bg-white/10 transition-all duration-300">
                  Browse Products
                </Link>
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
            <div className="flex items-center gap-4">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-sm text-gray-400">Powered by Stripe</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}