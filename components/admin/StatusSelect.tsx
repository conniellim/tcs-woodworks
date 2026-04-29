'use client'

import { useTransition } from 'react'
import type { BookingStatus } from '@/types'
import { updateBookingStatus } from '@/app/admin/(protected)/bookings/actions'

const STATUS_OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

interface StatusSelectProps {
  bookingId: string
  current: BookingStatus
}

export function StatusSelect({ bookingId, current }: StatusSelectProps) {
  const [isPending, startTransition] = useTransition()
  return (
    <select
      defaultValue={current}
      disabled={isPending}
      onChange={(e) =>
        startTransition(() => updateBookingStatus(bookingId, e.target.value as BookingStatus))
      }
      className="text-xs border border-stone-border rounded px-2 py-1 bg-white focus:outline-none focus:border-forest disabled:opacity-50"
    >
      {STATUS_OPTIONS.map(({ value, label }) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  )
}
