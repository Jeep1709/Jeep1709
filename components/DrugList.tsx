'use client'

import { Drug } from '@/types'
import DrugCard from './DrugCard'

interface DrugListProps {
  drugs: Drug[]
  onEdit: (drug: Drug) => void
  onDelete: (id: string) => void
}

export default function DrugList({ drugs, onEdit, onDelete }: DrugListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {drugs.map((drug) => (
        <DrugCard
          key={drug.id}
          drug={drug}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
