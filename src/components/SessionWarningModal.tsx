// src/components/SessionWarningModal.tsx
'use client'

type SessionWarningModalProps = {
  minutesRemaining: number
  onStayLoggedIn: () => void
  onLogout: () => void
}

const ClockIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
)

export default function SessionWarningModal({
  minutesRemaining,
  onStayLoggedIn,
  onLogout,
}: SessionWarningModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
      <div
        className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl"
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'var(--warning-light, #FEF3C7)', color: 'var(--warning, #F59E0B)' }}
        >
          <ClockIcon />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          Session Expiring Soon
        </h3>

        {/* Message */}
        <p className="text-sm mb-2" style={{ color: 'var(--secondary)' }}>
          Your session will expire due to inactivity.
        </p>
        <p className="text-2xl font-bold mb-6" style={{ color: 'var(--warning, #F59E0B)' }}>
          {minutesRemaining} {minutesRemaining === 1 ? 'minute' : 'minutes'} remaining
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onLogout}
            className="flex-1 py-3 rounded-full font-semibold cursor-pointer transition-all"
            style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
          >
            Log Out
          </button>
          <button
            onClick={onStayLoggedIn}
            className="flex-1 py-3 rounded-full font-bold text-white cursor-pointer transition-opacity hover:opacity-90"
            style={{ background: 'var(--primary)' }}
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  )
}
