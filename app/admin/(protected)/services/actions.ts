'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const sort_order = parseInt(formData.get('sort_order') as string) || 99
  if (!name.trim()) return
  await supabaseAdmin.from('service_categories').insert({ name: name.trim(), description: description.trim(), sort_order, visible: true })
  revalidatePath('/admin/services')
  revalidatePath('/services')
}

export async function toggleCategoryVisibility(id: string, current: boolean) {
  await supabaseAdmin.from('service_categories').update({ visible: !current }).eq('id', id)
  revalidatePath('/admin/services')
  revalidatePath('/services')
}

export async function deleteCategory(id: string) {
  await supabaseAdmin.from('service_categories').delete().eq('id', id)
  revalidatePath('/admin/services')
  revalidatePath('/services')
}
