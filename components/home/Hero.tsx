import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section className="bg-forest min-h-[520px] flex items-end pb-16 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-forest/60 to-forest-dark/80" />
      <div className="absolute inset-0 bg-forest-light opacity-30" />
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <p className="text-xs text-sage tracking-[0.25em] uppercase mb-4">Hayward, CA · Est. 2001</p>
        <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-4">
          Built by Hand.<br />Built to Last.
        </h1>
        <p className="text-sage text-base md:text-lg mb-8 max-w-lg">
          Custom cabinetry and full-service construction across the Bay Area, since 2001.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button href="/book" size="lg" variant="ghost">
            Schedule a Free Consultation →
          </Button>
          <Button href="/portfolio" size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
            View Our Work
          </Button>
        </div>
      </div>
    </section>
  )
}
