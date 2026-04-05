'use client'

import { useRef, useEffect, useState } from 'react'

interface QRScannerProps {
  onScan: (data: string) => void
  isOpen: boolean
  onClose: () => void
}

export default function QRScanner({ onScan, isOpen, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!isOpen) return

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setIsCameraReady(true)
          setError('')
        }
      } catch (err) {
        setError('Unable to access camera. Please check permissions.')
        console.error('Camera access error:', err)
      }
    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [isOpen])

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return

    const context = canvasRef.current.getContext('2d')
    if (!context) return

    canvasRef.current.width = videoRef.current.videoWidth
    canvasRef.current.height = videoRef.current.videoHeight

    context.drawImage(videoRef.current, 0, 0)

    // Simple barcode/QR detection (reads text from image)
    // In production, use a library like jsQR or quagga
    const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
    console.log('[v0] Frame captured for QR scanning')
  }

  const handleManualInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const qrData = formData.get('qr-code') as string

    if (qrData.trim()) {
      onScan(qrData)
      ;(e.target as HTMLFormElement).reset()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Scan QR Code</h2>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mb-6 bg-background rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-64 object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-4">
              Or enter QR code data manually:
            </p>
            <form onSubmit={handleManualInput} className="space-y-4">
              <input
                type="text"
                name="qr-code"
                placeholder="Paste or type QR code data"
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-input rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
