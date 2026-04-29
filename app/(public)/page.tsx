import { Hero } from '@/components/home/Hero'
import { PhotoStrip } from '@/components/home/PhotoStrip'
import { MissionSection } from '@/components/home/MissionSection'
import { ServicesPreview } from '@/components/home/ServicesPreview'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { BookingCTA } from '@/components/home/BookingCTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <PhotoStrip />
      <MissionSection />
      <ServicesPreview />
      <TestimonialsSection />
      <BookingCTA />
    </>
  )
}
