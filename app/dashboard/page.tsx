'use client'

import { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import DrugList from '@/components/DrugList'
import DashboardHeader from '@/components/DashboardHeader'
import AddDrugModal from '@/components/AddDrugModal'
import Stats from '@/components/Stats'
import QRScanner from '@/components/QRScanner'

interface Drug {
  id: string
  name: string
  quantity: number
  price: number
  qr_code?: string
  created_at: string
  updated_at: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export default function Dashboard() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingDrug, setEditingDrug] = useState<Drug | null>(null)
  const { data, isLoading, error, mutate } = useSWR('/api/drugs', fetcher)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }, [router])

  const handleAddDrug = useCallback(async (drugData: Omit<Drug, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const res = await fetch('/api/drugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(drugData),
      })

      if (res.ok) {
        mutate()
        setIsOpen(false)
        setEditingDrug(null)
      }
    } catch (error) {
      console.error('Failed to add drug:', error)
    }
  }, [mutate])

  const handleUpdateDrug = useCallback(
    async (drugData: Omit<Drug, 'id' | 'created_at' | 'updated_at'>) => {
      if (!editingDrug) return

      try {
        const res = await fetch(`/api/drugs/${editingDrug.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(drugData),
        })

        if (res.ok) {
          mutate()
          setIsOpen(false)
          setEditingDrug(null)
        }
      } catch (error) {
        console.error('Failed to update drug:', error)
      }
    },
    [editingDrug, mutate]
  )

  const handleDeleteDrug = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/drugs/${id}`, { method: 'DELETE' })
        if (res.ok) {
          mutate()
        }
      } catch (error) {
        console.error('Failed to delete drug:', error)
      }
    },
    [mutate]
  )

  const handleEditDrug = (drug: Drug) => {
    setEditingDrug(drug)
    setIsOpen(true)
  }

  const handleQRScan = (qrData: string) => {
    setEditingDrug(null)
    setIsOpen(true)
    // Pre-fill QR code in the modal
    setTimeout(() => {
      const qrInput = document.querySelector('input[placeholder="Scanned QR code data"]') as HTMLInputElement
      if (qrInput) {
        qrInput.value = qrData
      }
    }, 0)
  }

  const drugs: Drug[] = data?.drugs || []
  const filteredDrugs = drugs.filter(drug =>
    drug.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalDrugs = filteredDrugs.length
  const totalValue = filteredDrugs.reduce((sum, drug) => sum + drug.price * drug.quantity, 0)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Inventory Management</h2>
          <p className="text-muted-foreground">Manage your pharmacy drug inventory efficiently</p>
        </div>

        <Stats totalDrugs={totalDrugs} totalValue={totalValue} />

        <div className="mt-8 flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search drugs by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => setIsScannerOpen(true)}
            className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium whitespace-nowrap"
          >
            📱 Scan QR
          </button>
          <button
            onClick={() => {
              setEditingDrug(null)
              setIsOpen(true)
            }}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium whitespace-nowrap"
          >
            + Add Drug
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load drugs</p>
          </div>
        ) : filteredDrugs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No drugs found. Add your first drug to get started!</p>
          </div>
        ) : (
          <DrugList
            drugs={filteredDrugs}
            onEdit={handleEditDrug}
            onDelete={handleDeleteDrug}
          />
        )}
      </main>

      <AddDrugModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setEditingDrug(null)
        }}
        onSubmit={editingDrug ? handleUpdateDrug : handleAddDrug}
        initialData={editingDrug}
        isEditing={!!editingDrug}
      />

      <QRScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleQRScan}
      />
    </div>
  )
}
