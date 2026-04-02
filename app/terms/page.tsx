'use client'

import Link from 'next/link'
import { Header } from '@/components/header'

export default function TermsPage() {
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
              Terms of <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Service</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Please read these terms carefully before using our services.
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
                <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Acceptance of Terms</h2>
                <p className="text-gray-600">
                  By accessing and using SHOPMAX's website and services, you accept and agree to be bound by the terms
                  and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Description of Service</h2>
                <p className="text-gray-600 mb-4">
                  SHOPMAX provides users with access to a rich collection of resources, including various communications
                  tools, forums, shopping services, personalized content, and branded programming through its network
                  of properties (the "Service"). You also understand and agree that the Service may include advertisements
                  and that these advertisements are necessary for SHOPMAX to provide the Service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">3. Registration Obligations</h2>
                <p className="text-gray-600 mb-4">
                  In consideration of your use of the Service, you agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Provide true, accurate, current, and complete information about yourself as prompted by the Service's registration form</li>
                  <li>Maintain and promptly update the registration data to keep it true, accurate, current, and complete</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Be fully responsible for all activities that occur under your account</li>
                  <li>Notify SHOPMAX immediately of any unauthorized use of your account</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Privacy Policy</h2>
                <p className="text-gray-600">
                  Registration data and certain other information about you is subject to our Privacy Policy. You understand
                  that through your use of the Service, you consent to the collection and use of this information, including
                  the transfer of this information to other countries for storage, processing, and use.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">5. User Conduct</h2>
                <p className="text-gray-600 mb-4">
                  You agree not to use the Service to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Upload, post, email, transmit, or otherwise make available any content that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable</li>
                  <li>Harm minors in any way</li>
                  <li>Impersonate any person or entity, including, but not limited to, a SHOPMAX official, forum leader, guide, or host, or falsely state or otherwise misrepresent your affiliation with a person or entity</li>
                  <li>Forge headers or otherwise manipulate identifiers in order to disguise the origin of any content transmitted through the Service</li>
                  <li>Upload, post, email, transmit, or otherwise make available any content that you do not have a right to make available under any law or under contractual or fiduciary relationships</li>
                  <li>Upload, post, email, transmit, or otherwise make available any content that infringes any patent, trademark, trade secret, copyright, or other proprietary rights of any party</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">6. Purchases</h2>
                <p className="text-gray-600 mb-4">
                  If you wish to purchase any products or services through the Service, you may be asked to supply certain
                  information relevant to your purchase including, without limitation, your credit card number, the expiration
                  date of your credit card, your billing address, and your shipping information.
                </p>
                <p className="text-gray-600">
                  You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment
                  method(s) in connection with any purchase; and (ii) the information you supply to us is true, correct, and complete.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">7. Content Submitted or Made Available for Inclusion on the Service</h2>
                <p className="text-gray-600">
                  SHOPMAX does not claim ownership of content you submit or make available for inclusion on the Service.
                  However, with respect to content you submit or make available for inclusion on publicly accessible areas
                  of the Service, you grant SHOPMAX the following worldwide, royalty-free, and non-exclusive license(s).
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">8. Modifications to Service</h2>
                <p className="text-gray-600">
                  SHOPMAX reserves the right at any time and from time to time to modify or discontinue, temporarily or
                  permanently, the Service (or any part thereof) with or without notice. You agree that SHOPMAX shall not
                  be liable to you or to any third party for any modification, suspension, or discontinuance of the Service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">9. Termination</h2>
                <p className="text-gray-600">
                  You agree that SHOPMAX may, under certain circumstances and without prior notice, immediately terminate
                  your account, any associated email address, and access to the Service. Causes for termination include,
                  but are not limited to: breaches or violations of the Terms of Service, requests by law enforcement or
                  other government agencies, request by you (self-initiated account deletions), discontinuance or material
                  modification to the Service, unexpected technical or security issues or problems, extended inactivity,
                  and engagement in fraudulent or illegal activities.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">10. Disclaimer of Warranties</h2>
                <p className="text-gray-600">
                  YOU EXPRESSLY UNDERSTAND AND AGREE THAT YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. THE SERVICE IS
                  PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. SHOPMAX EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY
                  KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY,
                  FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">11. Limitation of Liability</h2>
                <p className="text-gray-600">
                  YOU EXPRESSLY UNDERSTAND AND AGREE THAT SHOPMAX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                  CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS, GOODWILL,
                  USE, DATA, OR OTHER INTANGIBLE LOSSES (EVEN IF SHOPMAX HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES).
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">12. Governing Law</h2>
                <p className="text-gray-600">
                  These Terms of Service shall be governed by and construed in accordance with the laws of the State of
                  California, without regard to its conflict of law provisions. You and SHOPMAX agree to submit to the
                  exclusive jurisdiction of the courts located within San Francisco County, California.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">13. Contact Information</h2>
                <p className="text-gray-600">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
                  <li>Email: legal@shopmax.com</li>
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