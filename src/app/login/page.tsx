// src/app/page.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// ─── Shared icon prop type ────────────────────────────────────────────────────
type IconProps = { className?: string; style?: React.CSSProperties }

// ─── SVG Icon Components ─────────────────────────────────────────────────────
const EnvelopeIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
)

const LockIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
)

const EyeIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
)

const EyeOffIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
)

const ArrowRightIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
)

const SpinnerIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
)

const SparkleIcon = ({ className, style }: IconProps) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
)

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

// ─── Feature Highlight Cards (right panel) ───────────────────────────────────
const features = [
  { icon: '💌', label: 'Beautiful Invitations', desc: 'Stunning designs for every occasion' },
  { icon: '✨', label: 'Easy to Customize', desc: 'Personalize every detail effortlessly' },
  { icon: '🎉', label: 'Share Instantly', desc: 'Send via link to all your guests' },
]

// ─── Floating Input Field Component ─────────────────────────────────────────
function FloatingInput({
  id, label, type = 'text', value, onChange, required, autoComplete,
  icon: Icon, rightElement, disabled,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  autoComplete?: string
  icon: React.ComponentType<{ className?: string }>
  rightElement?: React.ReactNode
  disabled?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const isFloated = focused || value.length > 0

  return (
    <div
      className="relative h-[68px] rounded-2xl transition-all duration-300 bg-white"
      style={{
        boxShadow: focused
          ? '0 0 0 2px var(--primary)'
          : '0 0 0 1.5px var(--border)',
      }}
    >
      {/* Left icon */}
      <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary transition-colors duration-200" />

      {/* Divider */}
      <div className="absolute left-14 top-1/2 -translate-y-1/2 w-px h-5 bg-border" />

      {/* Input */}
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder=""
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="absolute inset-0 w-full h-full bg-transparent font-semibold text-foreground focus:outline-none pl-[4.5rem] pr-14 pb-3 pt-6 text-sm rounded-2xl disabled:opacity-60"
      />

      {/* Floating label */}
      <label
        htmlFor={id}
        className="absolute left-[4.5rem] pointer-events-none font-medium transition-all duration-200 cursor-text"
        style={{
          top: isFloated ? '0.55rem' : '50%',
          transform: isFloated ? 'none' : 'translateY(-50%)',
          fontSize: isFloated ? '0.7rem' : '0.875rem',
          color: focused ? 'var(--primary)' : 'var(--secondary)',
          letterSpacing: isFloated ? '0.04em' : '0',
          textTransform: isFloated ? 'uppercase' : 'none',
        }}
      >
        {label}
      </label>

      {/* Right element (password toggle) */}
      {rightElement && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
  )
}

// ─── Main Login Page ──────────────────────────────────────────────────────────
export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.push('/dashboard')
    })
    return () => subscription.unsubscribe()
  }, [supabase, router])

  // Handle email/password submit
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)
    setIsLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        // Redirect handled by onAuthStateChange
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccessMsg('Account created! Please check your email to confirm your account.')
        setMode('login')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [mode, email, password, supabase])

  // Handle Google OAuth
  const handleGoogleLogin = useCallback(async () => {
    setIsGoogleLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) {
      setError(error.message)
      setIsGoogleLoading(false)
    }
  }, [supabase])

  const isSubmitting = isLoading || isGoogleLoading

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-x-hidden" style={{ fontFamily: "var(--font-lexend-deca), 'Inter', sans-serif" }}>

      {/* ─── Top Nav ──────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 h-[68px] bg-white/90 backdrop-blur-md border-b border-border z-50 flex items-center px-5 md:px-8 justify-between lg:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, var(--primary), #A78BFA)' }}>
            <SparkleIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-base text-foreground tracking-tight">Invitations</span>
        </div>
        <span className="text-sm font-semibold text-secondary">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </span>
      </nav>

      {/* ─── Left: Form Panel ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 pt-24 lg:pt-12 lg:px-14 xl:px-20">
        <div className="w-full max-w-[420px] mx-auto">

          {/* Desktop Logo */}
          <div className="hidden lg:flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, var(--primary), #A78BFA)' }}>
              <SparkleIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">Digital Invitations</span>
          </div>

          {/* Header */}
          <div className="mb-8 animate-slide-up">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg, #EEF0FF, #F5F3FF)' }}>
              <SparkleIcon className="w-7 h-7" style={{ color: 'var(--primary)' }} />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2 leading-tight">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-secondary font-medium text-base">
              {mode === 'login'
                ? 'Sign in to manage your invitations'
                : 'Start creating beautiful invitations'}
            </p>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full h-[52px] flex items-center justify-center gap-3 rounded-2xl border border-border font-semibold text-sm text-foreground bg-white hover:bg-muted transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mb-5 animate-slide-up animation-delay-200"
            style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,0.06)' }}
          >
            {isGoogleLoading
              ? <SpinnerIcon className="w-5 h-5 animate-spin-slow text-secondary" />
              : <GoogleIcon />
            }
            <span>{mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-5 animate-slide-up animation-delay-200">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-medium text-secondary uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 animate-slide-up animation-delay-400">
            {/* Email */}
            <FloatingInput
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              required
              autoComplete="email"
              icon={EnvelopeIcon}
              disabled={isSubmitting}
            />

            {/* Password */}
            <FloatingInput
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={setPassword}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              icon={LockIcon}
              disabled={isSubmitting}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="p-1 text-secondary hover:text-primary transition-colors cursor-pointer rounded-lg"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword
                    ? <EyeOffIcon className="w-5 h-5" />
                    : <EyeIcon className="w-5 h-5" />
                  }
                </button>
              }
            />

            {/* Forgot Password (login mode only) */}
            {mode === 'login' && (
              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  onClick={() => alert('Password reset functionality coming soon!')}
                  className="text-xs font-semibold cursor-pointer transition-colors"
                  style={{ color: 'var(--primary)' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in" style={{ background: 'var(--error-light)', color: 'var(--error)' }}>
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[56px] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              style={{
                background: isSubmitting
                  ? 'var(--primary)'
                  : 'linear-gradient(135deg, var(--primary) 0%, #8B5CF6 100%)',
                boxShadow: isSubmitting ? 'none' : '0 4px 20px -4px rgba(108,99,255,0.5)',
                transform: 'translateY(0)',
              }}
              onMouseEnter={e => {
                if (!isSubmitting) (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              }}
            >
              {isLoading ? (
                <>
                  <SpinnerIcon className="w-5 h-5 animate-spin-slow" />
                  <span>{mode === 'login' ? 'Signing in…' : 'Creating account…'}</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Create My Account'}</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <p className="text-center text-sm font-medium text-secondary mt-6 animate-slide-up animation-delay-600">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(null); setSuccessMsg(null) }}
              className="font-bold cursor-pointer transition-opacity hover:opacity-75"
              style={{ color: 'var(--primary)' }}
            >
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

        </div>
      </div>

      {/* ─── Right: Decorative Panel ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[48%] xl:w-[52%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #1a1033 0%, #2d1b69 40%, #4c1d95 100%)' }}
      >
        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute rounded-full animate-float-slow"
            style={{
              width: 380, height: 380,
              top: '-8%', right: '-10%',
              background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute rounded-full animate-float-medium"
            style={{
              width: 280, height: 280,
              bottom: '5%', left: '-8%',
              background: 'radial-gradient(circle, rgba(108,99,255,0.3) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute rounded-full animate-pulse-soft"
            style={{
              width: 160, height: 160,
              top: '38%', left: '55%',
              background: 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)',
            }}
          />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Top section */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <SparkleIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-base tracking-tight">Digital Invitations</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Craft Invitations<br />
            <span style={{ background: 'linear-gradient(90deg, #A78BFA, #C4B5FD)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Worth Remembering
            </span>
          </h2>
          <p className="text-white/60 text-base font-medium leading-relaxed max-w-xs">
            Design stunning digital invitations for your most precious moments — weddings, birthdays, celebrations & more.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="relative z-10 flex flex-col gap-3">
          {features.map((f, i) => (
            <div
              key={f.label}
              className="flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 animate-slide-up cursor-default"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                animationDelay: `${i * 0.15}s`,
                animationFillMode: 'both',
              }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }}>
                {f.icon}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{f.label}</p>
                <p className="text-white/50 text-xs font-medium mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom badge */}
        <div className="relative z-10 mt-8">
          <div
            className="inline-flex items-center gap-2.5 rounded-full px-4 py-2.5"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
            <span className="text-white/70 text-xs font-semibold tracking-wide uppercase">Trusted by 1,000+ hosts</span>
          </div>
        </div>
      </div>

    </div>
  )
}