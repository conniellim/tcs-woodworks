import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyCalWebhook } from '@/lib/cal'
import type { CalWebhookPayload } from '@/types'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-cal-signature-256') ?? ''

  if (!verifyCalWebhook(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload: CalWebhookPayload = JSON.parse(rawBody)

  if (payload.triggerEvent !== 'BOOKING_CREATED') {
    return NextResponse.json({ ok: true })
  }

  const draftId = payload.payload.metadata?.draft_id
  if (!draftId) {
    return NextResponse.json({ error: 'No draft_id in metadata' }, { status: 400 })
  }

  const { data: updated, error } = await supabaseAdmin
    .from('bookings')
    .update({ status: 'new', cal_booking_uid: payload.payload.uid, scheduled_at: payload.payload.startTime })
    .eq('id', draftId)
    .eq('status', 'pending_cal')
    .select('id')

  if (error) {
    console.error('Webhook update error:', error)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }

  if (!updated || updated.length === 0) {
    console.warn('Webhook: no booking found to promote for draft_id:', draftId)
  }

  return NextResponse.json({ ok: true })
}
