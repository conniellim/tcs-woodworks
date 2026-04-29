'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { BookingStatus } from '@/types'

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  await supabaseAdmin
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
  revalidatePath('/admin/bookings')
}

export async function assignTeamMember(bookingId: string, teamMemberId: string | null) {
  await supabaseAdmin
    .from('bookings')
    .update({ assigned_team_member_id: teamMemberId })
    .eq('id', bookingId)
  revalidatePath('/admin/bookings')
}
