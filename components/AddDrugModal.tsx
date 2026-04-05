'use client'

import { useState, useEffect } from 'react'
import { Drug } from '@/types'

interface AddDrugModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (drug: Omit<Drug, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  initialData?: Drug | null
  isEditing?: boolean
}

export default function AddDrugModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing,
}: AddDrugModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    qr_code: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        quantity: initialData.quantity.toString(),
        price: initialData.price.toString(),
        qr_code: initialData.qr_code || '',
      })
    } else {
      setFormData({
        name: '',
        quantity: '',
        price: '',
        qr_code: '',
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onSubmit({
        name: formData.name,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        qr_code: formData.qr_code,
        created_at: initialData?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        id: initialData?.id || '',
      })
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {isEditing ? 'Edit Drug' : 'Add New Drug'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Drug Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Paracetamol"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Quantity *
              </label>
              <input
                type="number"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 50"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price per Unit (₦) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                QR Code (Optional)
              </label>
              <input
                type="text"
                value={formData.qr_code}
                onChange={(e) => setFormData({ ...formData, qr_code: e.target.value })}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Scanned QR code data"
              />
            </div>

            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-input rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : isEditing ? 'Update Drug' : 'Add Drug'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
