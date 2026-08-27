// src/hooks/useIdleTimer.ts
'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// 4 hours in milliseconds
const IDLE_TIMEOUT = 4 * 60 * 60 * 1000
// Warning 5 minutes before timeout
const WARNING_BEFORE = 5 * 60 * 1000

type IdleTimerState = {
  /** Whether the warning modal should be shown */
  showWarning: boolean
  /** Minutes remaining before auto-logout */
  minutesRemaining: number
  /** Call this to dismiss warning and reset timer */
  dismissWarning: () => void
}

export function useIdleTimer(): IdleTimerState {
  const router = useRouter()
  const [showWarning, setShowWarning] = useState(false)
  const [minutesRemaining, setMinutesRemaining] = useState(5)

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const signOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login?expired=true')
  }, [router])

  const clearAllTimers = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
  }, [])

  const resetTimers = useCallback(() => {
    clearAllTimers()
    setShowWarning(false)
    setMinutesRemaining(5)

    // Set warning timer (fires 5 min before timeout)
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true)
      setMinutesRemaining(5)

      // Start countdown
      let remaining = 5
      countdownRef.current = setInterval(() => {
        remaining -= 1
        setMinutesRemaining(Math.max(0, remaining))
        if (remaining <= 0) {
          if (countdownRef.current) clearInterval(countdownRef.current)
        }
      }, 60 * 1000) // Update every minute
    }, IDLE_TIMEOUT - WARNING_BEFORE)

    // Set actual logout timer
    idleTimerRef.current = setTimeout(() => {
      signOut()
    }, IDLE_TIMEOUT)
  }, [clearAllTimers, signOut])

  const dismissWarning = useCallback(() => {
    // User is still active — reset everything
    resetTimers()
  }, [resetTimers])

  useEffect(() => {
    // Activity events to track
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove']

    const handleActivity = () => {
      // Only reset if warning is NOT showing (once warning is shown, user must click "Stay")
      if (!showWarning) {
        resetTimers()
      }
    }

    // Attach event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    // Start initial timers
    resetTimers()

    return () => {
      clearAllTimers()
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    showWarning,
    minutesRemaining,
    dismissWarning,
  }
}
