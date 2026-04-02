'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddressForm } from '@/components/address-form'
import { AddressList } from '@/components/address-list'
import { useAuth } from '@/hooks/use-auth'

interface Address {
  id: string
  fullName: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string | null
  isDefault: boolean
}

export default function AddressesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | undefined>()

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const fetchAddresses = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/addresses')
      const data = await response.json()
      setAddresses(data.addresses || [])
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchAddresses()
    }
  }, [user])

  const handleSuccess = () => {
    setShowForm(false)
    setEditingAddress(undefined)
    fetchAddresses()
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setShowForm(true)
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">SHOPMAX</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/cart" className="text-sm font-medium hover:text-orange-500">
                Cart
              </Link>
              <Link href="/orders" className="text-sm font-medium hover:text-orange-500">
                Orders
              </Link>
              <span className="text-sm text-gray-500">{user.name || user.email}</span>
            </div>
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900">My Account</span>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Address Book</h1>
            {!showForm && (
              <Button
                onClick={() => {
                  setShowForm(true)
                  setEditingAddress(undefined)
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : showForm ? (
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">
                {editingAddress ? 'Edit Address' : 'New Address'}
              </h2>
              <AddressForm
                address={editingAddress}
                onSuccess={handleSuccess}
                onCancel={() => {
                  setShowForm(false)
                  setEditingAddress(undefined)
                }}
              />
            </div>
          ) : (
            <AddressList
              addresses={addresses}
              onEdit={handleEdit}
              onRefresh={fetchAddresses}
            />
          )}
        </div>
      </main>
    </div>
  )
}