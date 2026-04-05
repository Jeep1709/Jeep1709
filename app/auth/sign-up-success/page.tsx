'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function SignUpSuccessPage() {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          router.push('/auth/login')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>
              We&apos;ve sent you a confirmation link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                A confirmation email has been sent to your email address. 
                Click the link in the email to verify your account and complete your signup.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or wait a moment and resend.
              </p>
            </div>

            <Button 
              onClick={() => router.push('/auth/login')} 
              className="w-full"
              variant="outline"
            >
              Back to Login ({timeLeft}s)
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              You&apos;ll be automatically redirected to login in {timeLeft} seconds.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
