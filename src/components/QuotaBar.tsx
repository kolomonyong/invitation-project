// src/components/QuotaBar.tsx
'use client'

type IconProps = { className?: string; style?: React.CSSProperties }

const SparkleIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
)

export default function QuotaBar({
  used,
  total,
  onUpgrade,
}: {
  used: number
  total: number
  onUpgrade: () => void
}) {
  const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0
  const remaining = Math.max(total - used, 0)
  const isExhausted = remaining === 0

  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        borderColor: isExhausted ? 'var(--warning, #F59E0B)' : 'var(--border)',
        background: isExhausted ? 'var(--warning-light, #FEF3C7)' : 'white',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <SparkleIcon
            className="w-4 h-4"
            style={{ color: isExhausted ? 'var(--warning, #F59E0B)' : 'var(--primary)' }}
          />
          <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>
            Invitation Quota
          </span>
        </div>
        <span className="text-xs font-bold" style={{ color: 'var(--secondary)' }}>
          {used}/{total}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-2 rounded-full overflow-hidden mb-2"
        style={{ background: 'var(--border)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            background: isExhausted
              ? 'var(--warning, #F59E0B)'
              : percentage > 75
                ? 'var(--warning, #F59E0B)'
                : 'var(--primary)',
          }}
        />
      </div>

      {/* Status text and CTA */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--secondary)' }}>
          {isExhausted
            ? 'Kuota habis!'
            : `${remaining} invitation remaining`}
        </span>
        {isExhausted && (
          <button
            onClick={onUpgrade}
            className="text-xs font-bold px-3 py-1 rounded-full cursor-pointer transition-opacity hover:opacity-90"
            style={{ background: 'var(--primary)', color: 'white' }}
          >
            + Tambah
          </button>
        )}
      </div>
    </div>
  )
}
