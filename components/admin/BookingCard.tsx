import { StatusSelect } from './StatusSelect'
import { TeamAssignSelect } from './TeamAssignSelect'
import type { Booking, TeamMember, BookingStatus } from '@/types'

const STATUS_BORDER: Record<BookingStatus, string> = {
  new: 'border-l-amber-400',
  confirmed: 'border-l-green-400',
  pending_review: 'border-l-purple-400',
  in_progress: 'border-l-blue-400',
  completed: 'border-l-gray-400',
  cancelled: 'border-l-red-400',
  pending_cal: 'border-l-stone-400',
}

interface BookingCardProps {
  booking: Booking & {
    service_category?: { name: string } | null
    assigned_team_member?: TeamMember | null
  }
  teamMembers: TeamMember[]
}

export function BookingCard({ booking, teamMembers }: BookingCardProps) {
  const border = STATUS_BORDER[booking.status] ?? 'border-l-stone-400'
  const scheduledDate = booking.scheduled_at
    ? new Date(booking.scheduled_at).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
      })
    : 'Time not set'

  return (
    <div className={`bg-white border border-stone-border border-l-4 ${border} rounded p-5`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-bold text-forest">{booking.customer_name}</p>
          <p className="text-xs text-sage-dark">
            {booking.customer_email}
            {booking.customer_phone && ` · ${booking.customer_phone}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusSelect bookingId={booking.id} current={booking.status} />
          <span className="text-xs font-semibold text-sage-dark bg-stone-mid px-2 py-1 rounded">
            {scheduledDate}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 items-center mb-3">
        {booking.service_category && (
          <span className="text-xs bg-stone-mid text-forest px-2 py-0.5 rounded font-medium">
            {booking.service_category.name}
          </span>
        )}
        <p className="text-xs text-sage-deeper line-clamp-1 flex-1">
          {booking.project_description}
        </p>
        {booking.photo_urls.length > 0 && (
          <span className="text-xs bg-stone-mid text-sage-dark px-2 py-0.5 rounded">
            📷 {booking.photo_urls.length}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-stone-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-forest-deeper flex items-center justify-center text-xs font-bold text-sage">
            {booking.assigned_team_member?.name?.[0] ?? '—'}
          </div>
          <TeamAssignSelect
            bookingId={booking.id}
            currentMemberId={booking.assigned_team_member_id}
            teamMembers={teamMembers}
          />
        </div>
      </div>
    </div>
  )
}
