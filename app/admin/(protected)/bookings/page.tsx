import { BookingCard } from '@/components/admin/BookingCard'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { BookingStatus, Booking, TeamMember } from '@/types'
import Link from 'next/link'

const STATUS_TABS: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const statusFilter = params.status as BookingStatus | 'all' | undefined

  let query = supabaseAdmin
    .from('bookings')
    .select(`
      *,
      service_category:service_categories(name),
      assigned_team_member:team_members(*)
    `)
    .neq('status', 'pending_cal')
    .order('created_at', { ascending: false })

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter)
  }

  const [{ data: bookings }, { data: teamMembers }] = await Promise.all([
    query,
    supabaseAdmin.from('team_members').select('*').order('name'),
  ])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-forest">Bookings</h1>
        <span className="text-sm text-sage-dark bg-stone-mid px-3 py-1 rounded">
          {bookings?.length ?? 0} booking{bookings?.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex gap-2 flex-wrap mb-8">
        {STATUS_TABS.map(({ value, label }) => (
          <Link
            key={value}
            href={value === 'all' ? '/admin/bookings' : `/admin/bookings?status=${value}`}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              (value === 'all' && !statusFilter) || statusFilter === value
                ? 'bg-forest text-stone'
                : 'bg-stone-mid text-sage-dark hover:bg-stone-border'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
      <div className="space-y-4">
        {bookings && bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking as Booking & { service_category?: { name: string } | null; assigned_team_member?: TeamMember | null }}
              teamMembers={(teamMembers ?? []) as TeamMember[]}
            />
          ))
        ) : (
          <p className="text-sage-dark text-center py-20">No bookings yet.</p>
        )}
      </div>
    </div>
  )
}
