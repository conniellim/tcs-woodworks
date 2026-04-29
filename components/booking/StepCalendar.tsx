'use client'

import Cal, { getCalApi } from '@calcom/embed-react'
import { useEffect } from 'react'

interface StepCalendarProps {
  draftId: string
  customerEmail: string
  customerName: string
}

export function StepCalendar({ draftId, customerEmail, customerName }: StepCalendarProps) {
  useEffect(() => {
    getCalApi({}).then((cal) => {
      cal('ui', {
        theme: 'light',
        styles: { branding: { brandColor: '#2C3E2D' } },
        hideEventTypeDetails: false,
      })
    })
  }, [])

  const calLink = `${process.env.NEXT_PUBLIC_CAL_USERNAME}/${process.env.NEXT_PUBLIC_CAL_EVENT_SLUG}`

  return (
    <div>
      <h2 className="text-2xl font-black text-forest mb-2">Choose a time that works for you</h2>
      <p className="text-sage-dark text-sm mb-8">Pick a slot — you&apos;ll both get a Google Calendar invite automatically.</p>
      <div className="rounded overflow-hidden border border-stone-border">
        <Cal
          calLink={calLink}
          config={{
            name: customerName,
            email: customerEmail,
            metadata: { draft_id: draftId } as Record<string, string>,
          }}
          style={{ width: '100%', height: '600px', overflow: 'scroll' }}
        />
      </div>
      <div className="mt-4 p-4 bg-stone-mid rounded flex items-start gap-3">
        <span className="text-sage text-lg">✓</span>
        <p className="text-sm text-sage-deeper">
          After booking, you and the owner both receive a Google Calendar invite. Your project details are saved so the owner can review them before your call.
        </p>
      </div>
    </div>
  )
}
