'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface DashboardHeaderProps {
  onLogout: () => void
}

export default function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserEmail(user.email || '')
      }
    }

    getUser()
  }, [])

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">JEEP PHARMACY</h1>
          <p className="text-sm text-muted-foreground">Drug Inventory Management System</p>
        </div>

        <div className="flex items-center gap-4">
          {userEmail && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Logged in as</p>
              <p className="text-sm font-medium text-foreground">{userEmail}</p>
            </div>
          )}
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
