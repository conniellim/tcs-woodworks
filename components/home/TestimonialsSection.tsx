import { supabase } from '@/lib/supabase'
import { SectionLabel } from '@/components/ui/SectionLabel'

export async function TestimonialsSection() {
  const { data: reviews } = await supabase
    .from('testimonials')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(3)

  if (!reviews || reviews.length === 0) return null

  return (
    <section className="py-20 px-6 bg-stone-mid">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <SectionLabel>Reviews</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black text-forest tracking-tight">What Our Customers Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.id} className="bg-stone rounded p-8">
              <div className="text-forest text-lg mb-3">{'★'.repeat(r.star_rating)}</div>
              <p className="text-sage-deeper italic leading-relaxed mb-6">&ldquo;{r.quote}&rdquo;</p>
              <p className="text-xs font-bold text-forest tracking-wide">
                {r.customer_name} · {r.customer_city}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
