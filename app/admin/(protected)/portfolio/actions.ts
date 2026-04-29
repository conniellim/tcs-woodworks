'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/require-admin'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp'])

export async function addPortfolioPhoto(formData: FormData) {
  await requireAdmin()
  const file = formData.get('photo') as File
  if (!file || file.size === 0) return

  if (!ALLOWED_TYPES.has(file.type)) throw new Error('Invalid file type')
  const ext = (file.name.split('.').pop() ?? '').toLowerCase()
  if (!ALLOWED_EXTENSIONS.has(ext)) throw new Error('Invalid file extension')

  const MAX_BYTES = 10 * 1024 * 1024
  if (file.size > MAX_BYTES) throw new Error('File too large — maximum 10MB')

  const category_id = formData.get('category_id') as string | null
  const caption = formData.get('caption') as string | null

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const safePath = `portfolio/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error: uploadError } = await supabaseAdmin.storage
    .from('portfolio-photos')
    .upload(safePath, buffer, { contentType: file.type })

  if (uploadError) throw new Error('Upload failed')

  const { data: urlData } = supabaseAdmin.storage.from('portfolio-photos').getPublicUrl(safePath)

  await supabaseAdmin.from('portfolio_photos').insert({
    image_url: urlData.publicUrl,
    category_id: category_id || null,
    caption: caption || null,
  })

  revalidatePath('/admin/portfolio')
  revalidatePath('/portfolio')
}

export async function deletePortfolioPhoto(id: string) {
  await requireAdmin()
  // Get the image URL first to delete from storage
  const { data: photo } = await supabaseAdmin
    .from('portfolio_photos')
    .select('image_url')
    .eq('id', id)
    .single()

  if (photo?.image_url) {
    // Extract storage path from public URL
    // URL format: https://<project>.supabase.co/storage/v1/object/public/portfolio-photos/<path>
    const url = new URL(photo.image_url)
    const pathMatch = url.pathname.match(/\/portfolio-photos\/(.+)$/)
    if (pathMatch) {
      await supabaseAdmin.storage.from('portfolio-photos').remove([pathMatch[1]])
    }
  }

  const { error } = await supabaseAdmin.from('portfolio_photos').delete().eq('id', id)
  if (error) throw new Error('Failed to delete photo')
  revalidatePath('/admin/portfolio')
  revalidatePath('/portfolio')
}
