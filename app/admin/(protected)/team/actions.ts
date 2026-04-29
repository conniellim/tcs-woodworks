'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function createTeamMember(formData: FormData) {
  const name = formData.get('name') as string
  const role = formData.get('role') as string
  if (!name.trim()) return
  await supabaseAdmin.from('team_members').insert({ name: name.trim(), role: role.trim() })
  revalidatePath('/admin/team')
  revalidatePath('/about')
}

export async function deleteTeamMember(id: string) {
  await supabaseAdmin.from('team_members').delete().eq('id', id)
  revalidatePath('/admin/team')
  revalidatePath('/about')
}
