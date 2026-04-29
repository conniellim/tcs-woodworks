import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { customer_name, customer_email, customer_phone, service_category_id, project_description, photo_urls } = body

  if (!customer_name || !customer_email || !service_category_id || !project_description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .insert({
      customer_name,
      customer_email,
      customer_phone: customer_phone || null,
      service_category_id,
      project_description,
      photo_urls: photo_urls ?? [],
      status: 'pending_cal',
    })
    .select('id')
    .single()

  if (error) {
    console.error('Draft booking error:', error)
    return NextResponse.json({ error: 'Failed to create draft booking' }, { status: 500 })
  }

  return NextResponse.json({ draft_id: data.id })
}
