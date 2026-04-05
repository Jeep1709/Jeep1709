'use client'

import { Drug } from '@/types'
import { useState } from 'react'

interface DrugCardProps {
  drug: Drug
  onEdit: (drug: Drug) => void
  onDelete: (id: string) => void
}

export default function DrugCard({ drug, onEdit, onDelete }: DrugCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${drug.name}?`)) {
      setIsDeleting(true)
      onDelete(drug.id)
    }
  }

  const totalValue = drug.quantity * drug.price

  return (
    <div className="border border-border rounded-lg p-6 bg-card hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-1">{drug.name}</h3>
        {drug.qr_code && (
          <p className="text-xs text-muted-foreground">QR: {drug.qr_code.substring(0, 20)}...</p>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Quantity</span>
          <span className="text-lg font-semibold text-foreground">{drug.quantity} units</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Price/Unit</span>
          <span className="text-lg font-semibold text-foreground">₦{drug.price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-border">
          <span className="text-sm font-medium text-muted-foreground">Total Value</span>
          <span className="text-lg font-bold text-primary">₦{totalValue.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(drug)}
          className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium text-sm disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
