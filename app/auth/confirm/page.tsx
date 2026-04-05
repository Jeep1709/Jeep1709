'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleConfirmation = async () => {
      try {
        const supabase = createClient()
        const code = searchParams.get('code')

        if (!code) {
          setError('No confirmation code provided')
          setIsLoading(false)
          return
        }

        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) throw error

        // Redirect to dashboard after successful confirmation
        router.push('/dashboard')
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Failed to confirm email')
        setIsLoading(false)
      }
    }

    handleConfirmation()
  }, [router, searchParams])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Confirming Email</CardTitle>
            <CardDescription>Please wait while we confirm your email</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Confirming your email...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-destructive">{error}</p>
                <Button onClick={() => router.push('/auth/sign-up')} className="w-full">
                  Back to Sign Up
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
