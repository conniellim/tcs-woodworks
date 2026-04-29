const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function AvailabilityPage() {
  const calUsername = process.env.NEXT_PUBLIC_CAL_USERNAME
  const calUrl = calUsername ? `https://cal.com/${calUsername}/availability` : 'https://cal.com'

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-black text-forest mb-2">Availability</h1>
      <p className="text-sm text-sage-dark mb-8">
        Your availability is managed in Cal.com. Click below to edit your working hours, blocked dates, and buffer time between appointments.
      </p>

      <div className="bg-white border border-stone-border rounded p-6 mb-6">
        <h2 className="font-bold text-forest mb-4">Default Working Hours</h2>
        <div className="space-y-2">
          {DAYS.map((day) => {
            const isWeekend = day === 'Saturday' || day === 'Sunday'
            return (
              <div key={day} className="flex items-center justify-between py-1.5 border-b border-stone-border last:border-0">
                <span className={`text-sm font-medium ${isWeekend ? 'text-sage-dark' : 'text-forest'}`}>{day}</span>
                <span className={`text-sm ${isWeekend ? 'text-stone-muted' : 'text-sage-deeper'}`}>
                  {isWeekend ? 'Unavailable' : '8:00 AM – 5:00 PM'}
                </span>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-sage-dark mt-4">* Edit actual hours in Cal.com</p>
      </div>

      <a
        href={calUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-forest text-stone px-5 py-3 rounded font-semibold text-sm hover:bg-forest-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
      >
        Manage Availability in Cal.com →
      </a>
    </div>
  )
}
