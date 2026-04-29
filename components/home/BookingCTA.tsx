import { Button } from '@/components/ui/Button'

export function BookingCTA() {
  return (
    <section className="bg-forest py-24 px-6 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-stone tracking-tight mb-4">
          Ready to Start Your Project?
        </h2>
        <p className="text-sage mb-10 text-lg">
          Book a free consultation — let&apos;s talk about what you have in mind.
        </p>
        <Button href="/book" size="lg" variant="ghost">
          Schedule a Free Consultation →
        </Button>
      </div>
    </section>
  )
}
