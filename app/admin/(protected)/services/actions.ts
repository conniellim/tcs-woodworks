'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/require-admin'

export async function createCategory(formData: FormData) {
  await requireAdmin()
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const sort_order = parseInt(formData.get('sort_order') as string) || 99
  if (!name.trim()) return
  const { error } = await supabaseAdmin.from('service_categories').insert({ name: name.trim(), description: description.trim(), sort_order, visible: true })
  if (error) throw new Error('Failed to create category')
  revalidatePath('/admin/services')
  revalidatePath('/services')
}

export async function toggleCategoryVisibility(id: string, current: boolean) {
  await requireAdmin()
  const { error } = await supabaseAdmin.from('service_categories').update({ visible: !current }).eq('id', id)
  if (error) throw new Error('Failed to update category visibility')
  revalidatePath('/admin/services')
  revalidatePath('/services')
}

export async function deleteCategory(id: string) {
  await requireAdmin()
  const { error } = await supabaseAdmin.from('service_categories').delete().eq('id', id)
  if (error) throw new Error('Failed to delete category')
  revalidatePath('/admin/services')
  revalidatePath('/services')
}
