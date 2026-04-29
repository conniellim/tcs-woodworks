'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/require-admin'

export async function createTeamMember(formData: FormData) {
  await requireAdmin()
  const name = formData.get('name') as string
  const role = formData.get('role') as string
  if (!name.trim()) return
  const { error } = await supabaseAdmin.from('team_members').insert({ name: name.trim(), role: role.trim() })
  if (error) throw new Error('Failed to create team member')
  revalidatePath('/admin/team')
  revalidatePath('/about')
}

export async function deleteTeamMember(id: string) {
  await requireAdmin()
  const { error } = await supabaseAdmin.from('team_members').delete().eq('id', id)
  if (error) throw new Error('Failed to delete team member')
  revalidatePath('/admin/team')
  revalidatePath('/about')
}
