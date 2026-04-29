import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp'])

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const files = formData.getAll('files') as File[]

  if (files.length === 0) {
    return NextResponse.json({ urls: [] })
  }

  if (files.length > 5) {
    return NextResponse.json({ error: 'Maximum 5 files allowed' }, { status: 400 })
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, and WebP allowed.' }, { status: 400 })
    }
    const ext = (file.name.split('.').pop() ?? '').toLowerCase()
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json({ error: 'Invalid file extension.' }, { status: 400 })
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum 10MB per file.' }, { status: 400 })
    }
  }

  const urls: string[] = []
  const uploadedPaths: string[] = []

  for (const file of files) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase()
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabaseAdmin.storage
      .from('booking-photos')
      .upload(path, buffer, { contentType: file.type })

    if (error) {
      console.error('Upload error:', error)
      if (uploadedPaths.length > 0) {
        await supabaseAdmin.storage.from('booking-photos').remove(uploadedPaths)
      }
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    uploadedPaths.push(path)
    const { data } = supabaseAdmin.storage.from('booking-photos').getPublicUrl(path)
    urls.push(data.publicUrl)
  }

  return NextResponse.json({ urls })
}
