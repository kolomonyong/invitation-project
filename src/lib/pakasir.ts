// src/lib/pakasir.ts
// Pakasir Payment Gateway integration
// Docs: https://pakasir.com/p/docs
// SDK: https://github.com/zeative/pakasir-sdk

import { Pakasir } from 'pakasir-sdk'

// Initialize the Pakasir SDK client
// Requires PAKASIR_SLUG and PAKASIR_API_KEY in environment variables
export function getPakasirClient() {
  const slug = process.env.PAKASIR_SLUG
  const apikey = process.env.PAKASIR_API_KEY

  if (!slug || !apikey) {
    throw new Error(
      'Missing Pakasir configuration. Set PAKASIR_SLUG and PAKASIR_API_KEY in your environment variables.'
    )
  }

  return new Pakasir({ slug, apikey })
}

// Payment method types supported by Pakasir
export type PaymentMethod =
  | 'qris'
  | 'bni_va'
  | 'bri_va'
  | 'cimb_niaga_va'
  | 'sampoerna_va'
  | 'bnc_va'
  | 'maybank_va'
  | 'permata_va'
  | 'atm_bersama_va'
  | 'artha_graha_va'

// Price per additional invitation in IDR
export const INVITATION_PRICE = 10000

// Generate a unique order ID
export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `INV-${timestamp}-${random}`
}
