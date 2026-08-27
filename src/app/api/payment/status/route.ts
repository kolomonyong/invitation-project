// src/app/api/payment/status/route.ts
// Check payment status — polled by client after creating a payment

import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('order_id')

    if (!orderId) {
      return NextResponse.json(
        { error: 'order_id is required' },
        { status: 400 }
      )
    }

    // Verify authentication
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch transaction status
    const { data: transaction, error } = await supabase
      .from('transactions')
      .select('order_id, amount, status, payment_method, completed_at')
      .eq('order_id', orderId)
      .eq('user_id', user.id)
      .single()

    if (error || !transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      order_id: transaction.order_id,
      amount: transaction.amount,
      status: transaction.status,
      payment_method: transaction.payment_method,
      completed_at: transaction.completed_at,
    })
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
