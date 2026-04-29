import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { customer_name, customer_email, customer_phone, service_category_id, project_description, photo_urls } = body

  if (!customer_name || !customer_email || !service_category_id || !project_description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!EMAIL_RE.test(customer_email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  if (typeof customer_name !== 'string' || customer_name.length > 200) {
    return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
  }

  if (typeof project_description !== 'string' || project_description.length > 5000) {
    return NextResponse.json({ error: 'Description too long (max 5000 characters)' }, { status: 400 })
  }

  const safePhotoUrls = Array.isArray(photo_urls) && photo_urls.every((u: unknown) => typeof u === 'string') && photo_urls.length <= 5
    ? photo_urls as string[]
    : []

  // Verify service_category_id exists
  const { data: category, error: catError } = await supabaseAdmin
    .from('service_categories')
    .select('id')
    .eq('id', service_category_id)
    .single()

  if (catError || !category) {
    return NextResponse.json({ error: 'Invalid service category' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .insert({
      customer_name: customer_name.trim(),
      customer_email: customer_email.trim().toLowerCase(),
      customer_phone: customer_phone || null,
      service_category_id,
      project_description: project_description.trim(),
      photo_urls: safePhotoUrls,
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
