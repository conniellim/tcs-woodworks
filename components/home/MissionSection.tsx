import { SectionLabel } from '@/components/ui/SectionLabel'

const STATS = [
  { value: '25+', label: 'Years Experience' },
  { value: 'Bay Area', label: 'Based & Serving' },
  { value: '100%', label: 'Client-Oriented' },
]

export function MissionSection() {
  return (
    <section className="bg-stone-mid py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <SectionLabel>Our Story</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-black text-forest tracking-tight mb-6">
          A Family Trade, Perfected Over Generations
        </h2>
        <p className="text-sage-deeper text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12">
          Established in 2001, The Carpenter&apos;s Son takes pride in delivering high-quality products
          and personal service. We take the time to listen — because attention to detail starts with
          understanding exactly what you need.
        </p>
        <div className="flex justify-center gap-16">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-4xl font-black text-forest">{value}</p>
              <p className="text-xs text-sage-dark tracking-widest uppercase mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
