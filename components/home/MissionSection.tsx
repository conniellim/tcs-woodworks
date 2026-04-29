import { SectionLabel } from '@/components/ui/SectionLabel'

const STATS = [
  { value: '15+', label: 'Years Experience' },
  { value: '200+', label: 'Projects Completed' },
  { value: '5★', label: 'Yelp Rating' },
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
          From custom furniture to full home additions, we bring the same dedication to craft
          whether the job is small or large. Every project is personal — we work directly with
          you from first sketch to final nail.
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
