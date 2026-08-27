// src/app/api/payment/create/route.ts
// Creates a payment transaction via Pakasir for purchasing additional invitation quota

import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getPakasirClient, INVITATION_PRICE, generateOrderId } from '@/lib/pakasir'
import type { PaymentMethod } from '@/lib/pakasir'

export async function POST(request: Request) {
  try {
    // Verify authentication
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const paymentMethod: PaymentMethod = body.payment_method || 'qris'

    // Generate unique order ID
    const orderId = generateOrderId()

    // Create payment via Pakasir SDK
    const pakasir = getPakasirClient()
    const result = await pakasir.createPayment(
      paymentMethod,
      orderId,
      INVITATION_PRICE
    )

    // Save transaction to database
    const { error: dbError } = await supabase.from('transactions').insert({
      user_id: user.id,
      order_id: orderId,
      amount: INVITATION_PRICE,
      status: 'pending',
      payment_method: paymentMethod,
      pakasir_payment_number: result.payment_number || null,
      expired_at: result.expired_at || null,
    })

    if (dbError) {
      console.error('Failed to save transaction:', dbError)
      return NextResponse.json(
        { error: 'Failed to create transaction record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      order_id: orderId,
      amount: INVITATION_PRICE,
      total_payment: result.total_payment || INVITATION_PRICE,
      fee: result.fee || 0,
      payment_method: paymentMethod,
      payment_number: result.payment_number || null,
      expired_at: result.expired_at || null,
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
