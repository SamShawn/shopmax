'use client'

import { useState } from 'react'
import { Edit, Trash2, Star, Loader2, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/lib/use-toast'

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

interface AddressListProps {
  addresses: Address[]
  onEdit: (address: Address) => void
  onRefresh: () => void
}

export function AddressList({ addresses, onEdit, onRefresh }: AddressListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    setDeletingId(id)
    try {
      const response = await fetch(`/api/addresses/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete')
      toast({ title: 'Address deleted' })
      onRefresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete address',
        variant: 'destructive',
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleSetDefault = async (id: string) => {
    setSettingDefaultId(id)
    try {
      const response = await fetch(`/api/addresses/${id}/default`, { method: 'PUT' })
      if (!response.ok) throw new Error('Failed to set default')
      toast({ title: 'Default address updated' })
      onRefresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to set default address',
        variant: 'destructive',
      })
    } finally {
      setSettingDefaultId(null)
    }
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500">No addresses saved yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <div
          key={address.id}
          className={`border rounded-xl p-4 ${
            address.isDefault ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{address.fullName}</h3>
                {address.isDefault && (
                  <span className="flex items-center gap-1 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-current" />
                    Default
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm">{address.street}</p>
              <p className="text-gray-600 text-sm">
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p className="text-gray-600 text-sm">{address.country}</p>
              {address.phone && (
                <p className="text-gray-500 text-sm mt-1">{address.phone}</p>
              )}
            </div>

            <div className="flex gap-2">
              {!address.isDefault && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSetDefault(address.id)}
                  disabled={settingDefaultId === address.id}
                  title="Set as default"
                >
                  {settingDefaultId === address.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Star className="w-4 h-4" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(address)}
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(address.id)}
                disabled={deletingId === address.id}
                className="text-gray-400 hover:text-red-500"
                title="Delete"
              >
                {deletingId === address.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}