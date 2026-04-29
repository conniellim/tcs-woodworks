'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/require-admin'
import type { BookingStatus } from '@/types'

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  await requireAdmin()
  const { error } = await supabaseAdmin.from('bookings').update({ status }).eq('id', bookingId)
  if (error) throw new Error('Failed to update booking status')
  revalidatePath('/admin/bookings')
}

export async function assignTeamMember(bookingId: string, teamMemberId: string | null) {
  await requireAdmin()
  const { error } = await supabaseAdmin.from('bookings').update({ assigned_team_member_id: teamMemberId }).eq('id', bookingId)
  if (error) throw new Error('Failed to assign team member')
  revalidatePath('/admin/bookings')
}
