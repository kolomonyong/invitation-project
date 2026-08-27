// src/components/PurchaseModal.tsx
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import type { PaymentMethod } from '@/lib/pakasir'

type IconProps = { className?: string; style?: React.CSSProperties }

const CloseIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
)

const SpinnerIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
)

const CheckIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
)

const ShoppingBagIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>
)

type PaymentStep = 'select' | 'paying' | 'success'

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: string }[] = [
  { value: 'qris', label: 'QRIS (Semua E-Wallet)', icon: '📱' },
  { value: 'bri_va', label: 'BRI Virtual Account', icon: '🏦' },
  { value: 'bni_va', label: 'BNI Virtual Account', icon: '🏦' },
  { value: 'cimb_niaga_va', label: 'CIMB Niaga VA', icon: '🏦' },
  { value: 'permata_va', label: 'Permata VA', icon: '🏦' },
  { value: 'maybank_va', label: 'Maybank VA', icon: '🏦' },
]

export default function PurchaseModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [step, setStep] = useState<PaymentStep>('select')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('qris')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentData, setPaymentData] = useState<{
    order_id: string
    payment_number: string
    total_payment: number
    expired_at: string
  } | null>(null)

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [])

  const handleCreatePayment = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_method: selectedMethod }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create payment')
      }

      const data = await res.json()
      setPaymentData({
        order_id: data.order_id,
        payment_number: data.payment_number || '',
        total_payment: data.total_payment,
        expired_at: data.expired_at,
      })
      setStep('paying')

      // Start polling for payment status
      pollIntervalRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/payment/status?order_id=${data.order_id}`)
          if (statusRes.ok) {
            const statusData = await statusRes.json()
            if (statusData.status === 'completed') {
              if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
              setStep('success')
              // Auto-close after 2s and trigger refresh
              setTimeout(() => {
                onSuccess()
              }, 2000)
            }
          }
        } catch {
          // Silently retry
        }
      }, 5000) // Poll every 5 seconds
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [selectedMethod, onSuccess])

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--primary-light)' }}
            >
              <ShoppingBagIcon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h3 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>
                {step === 'success' ? 'Payment Successful!' : 'Add Invitation Quota'}
              </h3>
              {step === 'select' && (
                <p className="text-xs" style={{ color: 'var(--secondary)' }}>
                  +1 invitation for {formatPrice(10000)}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors"
            style={{ color: 'var(--secondary)' }}
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* ─── Step: Select Payment Method ─── */}
          {step === 'select' && (
            <>
              <div className="mb-4">
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                  Pilih Metode Pembayaran
                </p>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.value}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200"
                      style={{
                        border: `2px solid ${selectedMethod === method.value ? 'var(--primary)' : 'var(--border)'}`,
                        background: selectedMethod === method.value ? 'var(--primary-light)' : 'white',
                      }}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={method.value}
                        checked={selectedMethod === method.value}
                        onChange={() => setSelectedMethod(method.value)}
                        className="sr-only"
                      />
                      <span className="text-lg">{method.icon}</span>
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        {method.label}
                      </span>
                      {selectedMethod === method.value && (
                        <CheckIcon className="w-5 h-5 ml-auto" style={{ color: 'var(--primary)' }} />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div
                  className="p-3 rounded-xl mb-4 text-sm font-medium"
                  style={{ background: 'var(--error-light)', color: 'var(--error)' }}
                >
                  {error}
                </div>
              )}

              {/* Price summary */}
              <div
                className="p-4 rounded-xl mb-4"
                style={{ background: 'var(--muted)' }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: 'var(--secondary)' }}>
                    1x Invitation Quota
                  </span>
                  <span className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                    {formatPrice(10000)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCreatePayment}
                disabled={loading}
                className="w-full py-3 rounded-full font-bold text-white cursor-pointer flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, var(--primary), #8B5CF6)',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading && <SpinnerIcon className="w-4 h-4 animate-spin" />}
                {loading ? 'Memproses...' : 'Bayar Sekarang'}
              </button>
            </>
          )}

          {/* ─── Step: Paying (show QR/VA) ─── */}
          {step === 'paying' && paymentData && (
            <div className="text-center">
              {selectedMethod === 'qris' && paymentData.payment_number ? (
                <>
                  <p className="text-sm font-medium mb-4" style={{ color: 'var(--secondary)' }}>
                    Scan QR code di bawah ini untuk membayar
                  </p>
                  <div
                    className="inline-block p-4 rounded-2xl mb-4"
                    style={{ background: 'var(--muted)' }}
                  >
                    <QRCodeSVG value={paymentData.payment_number} size={200} />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--secondary)' }}>
                    Transfer ke nomor Virtual Account berikut:
                  </p>
                  <div
                    className="p-4 rounded-2xl mb-4 font-mono text-xl font-bold tracking-wider"
                    style={{ background: 'var(--muted)', color: 'var(--foreground)' }}
                  >
                    {paymentData.payment_number || 'Loading...'}
                  </div>
                </>
              )}

              <div
                className="p-3 rounded-xl mb-4"
                style={{ background: 'var(--muted)' }}
              >
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: 'var(--secondary)' }}>Total Bayar</span>
                  <span className="font-bold" style={{ color: 'var(--foreground)' }}>
                    {formatPrice(paymentData.total_payment)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--secondary)' }}>Order ID</span>
                  <span className="font-mono text-xs" style={{ color: 'var(--secondary)' }}>
                    {paymentData.order_id}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                <SpinnerIcon className="w-4 h-4 animate-spin" style={{ color: 'var(--primary)' }} />
                <span className="text-sm" style={{ color: 'var(--secondary)' }}>
                  Menunggu pembayaran...
                </span>
              </div>

              <button
                onClick={onClose}
                className="text-sm font-medium cursor-pointer"
                style={{ color: 'var(--secondary)' }}
              >
                Bayar nanti
              </button>
            </div>
          )}

          {/* ─── Step: Success ─── */}
          {step === 'success' && (
            <div className="text-center py-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'var(--success-light, #D1FAE5)', animation: 'slideUp 0.5s ease-out' }}
              >
                <CheckIcon className="w-10 h-10" style={{ color: 'var(--success, #10B981)' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                Pembayaran Berhasil! 🎉
              </h3>
              <p className="text-sm" style={{ color: 'var(--secondary)' }}>
                +1 invitation quota telah ditambahkan ke akun Anda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
