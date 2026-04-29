'use client'

import { useTransition } from 'react'
import type { TeamMember } from '@/types'
import { assignTeamMember } from '@/app/admin/(protected)/bookings/actions'

interface TeamAssignSelectProps {
  bookingId: string
  currentMemberId: string | null | undefined
  teamMembers: TeamMember[]
}

export function TeamAssignSelect({ bookingId, currentMemberId, teamMembers }: TeamAssignSelectProps) {
  const [isPending, startTransition] = useTransition()
  return (
    <select
      defaultValue={currentMemberId ?? ''}
      disabled={isPending}
      onChange={(e) =>
        startTransition(() => assignTeamMember(bookingId, e.target.value || null))
      }
      className="text-xs border border-stone-border rounded px-2 py-1 bg-white focus:outline-none focus:border-forest disabled:opacity-50"
    >
      <option value="">Unassigned</option>
      {teamMembers.map((m) => (
        <option key={m.id} value={m.id}>{m.name}</option>
      ))}
    </select>
  )
}
