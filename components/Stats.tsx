'use client'

interface StatsProps {
  totalDrugs: number
  totalValue: number
}

export default function Stats({ totalDrugs, totalValue }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="border border-border rounded-lg p-6 bg-card">
        <p className="text-sm text-muted-foreground mb-2">Total Drugs</p>
        <p className="text-4xl font-bold text-primary">{totalDrugs}</p>
        <p className="text-xs text-muted-foreground mt-2">Unique drug items in inventory</p>
      </div>

      <div className="border border-border rounded-lg p-6 bg-card">
        <p className="text-sm text-muted-foreground mb-2">Total Inventory Value</p>
        <p className="text-4xl font-bold text-primary">₦{totalValue.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground mt-2">Combined value of all items</p>
      </div>
    </div>
  )
}
