// src/app/api/payment/webhook/route.ts
// Pakasir webhook endpoint — called by Pakasir when payment is completed
// Docs: https://pakasir.com/p/docs (Section D. Webhook)

import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

// Webhook payload from Pakasir:
// {
//   "amount": 10000,
//   "order_id": "INV-...",
//   "project": "your-slug",
//   "status": "completed",
//   "payment_method": "qris",
//   "completed_at": "2024-09-10T08:07:02.819+07:00"
// }

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { amount, order_id, status, payment_method, completed_at } = body

    // Validate required fields
    if (!order_id || !amount || !status) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      )
    }

    // Only process completed payments
    if (status !== 'completed') {
      return NextResponse.json({ message: 'Status noted' }, { status: 200 })
    }

    const supabase = await createServerClient()

    // Find the transaction in our database
    const { data: transaction, error: findError } = await supabase
      .from('transactions')
      .select('id, user_id, amount, status')
      .eq('order_id', order_id)
      .single()

    if (findError || !transaction) {
      console.error('Transaction not found for order:', order_id, findError)
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // SECURITY: Validate amount matches
    if (transaction.amount !== amount) {
      console.error(
        `Amount mismatch for order ${order_id}: expected ${transaction.amount}, got ${amount}`
      )
      return NextResponse.json(
        { error: 'Amount mismatch' },
        { status: 400 }
      )
    }

    // Prevent duplicate processing
    if (transaction.status === 'completed') {
      return NextResponse.json({ message: 'Already processed' }, { status: 200 })
    }

    // Update transaction status to completed
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: 'completed',
        payment_method: payment_method || transaction.status,
        completed_at: completed_at || new Date().toISOString(),
      })
      .eq('order_id', order_id)

    if (updateError) {
      console.error('Failed to update transaction:', updateError)
      return NextResponse.json(
        { error: 'Failed to update transaction' },
        { status: 500 }
      )
    }

    // Increment user's purchased quota
    // First, check if user_quotas row exists
    const { data: quota, error: quotaError } = await supabase
      .from('user_quotas')
      .select('id, purchased_quota')
      .eq('user_id', transaction.user_id)
      .single()

    if (quotaError || !quota) {
      // Create quota row if it doesn't exist
      await supabase.from('user_quotas').insert({
        user_id: transaction.user_id,
        free_quota: 1,
        purchased_quota: 1,
      })
    } else {
      // Increment purchased quota
      await supabase
        .from('user_quotas')
        .update({
          purchased_quota: quota.purchased_quota + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', quota.id)
    }

    console.log(`Payment completed for order ${order_id}, user ${transaction.user_id}`)

    return NextResponse.json({ message: 'Payment processed successfully' }, { status: 200 })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
