'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/require-admin'

export async function createReview(formData: FormData) {
  await requireAdmin()
  const customer_name = formData.get('customer_name') as string
  const customer_city = formData.get('customer_city') as string
  const quote = formData.get('quote') as string
  const star_rating = parseInt(formData.get('star_rating') as string)
  if (!customer_name.trim() || !quote.trim()) return
  const { error } = await supabaseAdmin.from('testimonials').insert({
    customer_name: customer_name.trim(),
    customer_city: customer_city.trim(),
    quote: quote.trim(),
    star_rating: Math.min(5, Math.max(1, star_rating)),
    featured: false,
  })
  if (error) throw new Error('Failed to create review')
  revalidatePath('/admin/reviews')
  revalidatePath('/')
}

export async function toggleFeatured(id: string, current: boolean) {
  await requireAdmin()
  const { error } = await supabaseAdmin.from('testimonials').update({ featured: !current }).eq('id', id)
  if (error) throw new Error('Failed to update review')
  revalidatePath('/admin/reviews')
  revalidatePath('/')
}

export async function deleteReview(id: string) {
  await requireAdmin()
  const { error } = await supabaseAdmin.from('testimonials').delete().eq('id', id)
  if (error) throw new Error('Failed to delete review')
  revalidatePath('/admin/reviews')
  revalidatePath('/')
}
