'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        router.push('/dashboard')
      }
    }

    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">JEEP PHARMACY</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Professional Drug Inventory Management System
          </p>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Manage your pharmacy inventory with ease. Track drug quantities, prices, and access your inventory from anywhere with our cloud-based system.
          </p>
        </div>

        <div className="space-y-4 mb-12">
          <Link
            href="/auth/sign-up"
            className="block w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-center text-lg"
          >
            Get Started - Sign Up
          </Link>
          <Link
            href="/auth/login"
            className="block w-full px-8 py-4 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-semibold text-center text-lg"
          >
            Already have an account? Login
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-3">Easy Management</h3>
            <p className="text-muted-foreground">Add, edit, and delete drugs with a simple interface. Track quantities and prices effortlessly.</p>
          </div>

          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-3">QR Code Scanning</h3>
            <p className="text-muted-foreground">Scan QR codes on drug packages to quickly add or update inventory information.</p>
          </div>

          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-3">Cloud Sync</h3>
            <p className="text-muted-foreground">Access your inventory from any device. Your data is always up-to-date and secure.</p>
          </div>
        </div>

        <div className="mt-16 p-8 border border-border rounded-lg bg-card">
          <h2 className="text-2xl font-bold text-foreground mb-4">Key Features</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">✓</span>
              <span>User authentication - Secure login with email and password</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">✓</span>
              <span>Real-time inventory tracking - See live stock levels</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">✓</span>
              <span>Drug search and alphabetical sorting - Find drugs quickly</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">✓</span>
              <span>Inventory analytics - Total drugs and value dashboard</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">✓</span>
              <span>QR code integration - Scan and manage drugs automatically</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold">✓</span>
              <span>Multi-device access - Sync across all your devices</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
