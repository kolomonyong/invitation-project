// src/lib/cache.ts
// Next.js built-in caching abstraction
// Uses React's `cache()` for request-level deduplication and Next.js's
// `unstable_cache` for cross-request persistent caching (ISR-style).

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'

// Direct Supabase client (no cookie auth needed for public data)
const getPublicClient = () =>
  createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// ─── Cached Templates ─────────────────────────────────────────────────────────
// Cache template list for 60 seconds — short enough to pick up new templates quickly
export const getCachedTemplates = unstable_cache(
  async () => {
    const supabase = getPublicClient()
    const { data, error } = await supabase.from('templates').select('*')
    if (error) {
      console.error('getCachedTemplates error:', error)
      return []
    }
    return data ?? []
  },
  ['templates-list'],
  {
    revalidate: 60, // 60 seconds — was 3600 (1 hour)
    tags: ['templates'],
  }
)

// ─── Cached Public Invitation ─────────────────────────────────────────────────
// Cache invite page data for 30 seconds — fast RSVP delivery without hammering DB
export const getCachedInvitation = unstable_cache(
  async (id: string) => {
    const supabase = getPublicClient()
    const { data, error } = await supabase
      .from('invitations')
      .select('custom_data, template_id, templates ( name, preview_image_url )')
      .eq('id', id)
      .single()

    if (error) return null
    return data
  },
  ['invitation'],
  {
    revalidate: 30, // 30 seconds
    tags: ['invitations'],
  }
)

// ─── Cache Tags for Revalidation ─────────────────────────────────────────────
// Call these after mutations to clear the relevant caches
export const CACHE_TAGS = {
  templates: 'templates',
  invitations: 'invitations',
} as const
