interface StepIndicatorProps {
  current: 1 | 2 | 3
  labels: [string, string, string]
}

export function StepIndicator({ current, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {([1, 2, 3] as const).map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step < current
                  ? 'bg-sage text-forest'
                  : step === current
                  ? 'bg-forest text-stone'
                  : 'bg-stone-muted text-sage-dark'
              }`}
            >
              {step < current ? '✓' : step}
            </div>
            <span className={`text-xs hidden sm:block ${step === current ? 'text-forest font-semibold' : 'text-sage-dark'}`}>
              {labels[step - 1]}
            </span>
          </div>
          {step < 3 && <div className={`w-8 h-0.5 ${step < current ? 'bg-sage' : 'bg-stone-muted'}`} />}
        </div>
      ))}
    </div>
  )
}
