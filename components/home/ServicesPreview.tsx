import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { SectionLabel } from '@/components/ui/SectionLabel'

const SERVICES_FALLBACK = [
  { id: '1', name: 'Custom Furniture & Cabinetry', description: 'Handcrafted built-ins, cabinets, and custom furniture pieces tailored to your space.', cover_image_url: '/photos/cabinetry.jpg' },
  { id: '2', name: 'Fencing & Landscaping',    description: 'Decks, pergolas, fences, and outdoor living spaces built to last.',                  cover_image_url: '/photos/fence-and-landscaping.jpg' },
  { id: '3', name: 'Home Additions & Remodels',    description: 'Room additions and full-service renovations, from design to final walkthrough.',        cover_image_url: '/photos/kitchen-remodel.jpg' },
]

export async function ServicesPreview() {
  const { data: categories } = await supabase
    .from('service_categories')
    .select('id, name, description, cover_image_url')
    .eq('visible', true)
    .order('sort_order')
    .limit(3)

  const items = (categories && categories.length > 0) ? categories : SERVICES_FALLBACK

  return (
    <section className="py-20 px-6 bg-stone">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <SectionLabel>What We Do</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black text-forest tracking-tight">Every Job, Done Right</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((cat) => (
            <div key={cat.id} className="bg-stone-mid rounded overflow-hidden group">
              <div className="relative aspect-video bg-stone-muted">
                {cat.cover_image_url ? (
                  <Image src={cat.cover_image_url} alt={cat.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-stone-muted" />
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-forest mb-1">{cat.name}</h3>
                <p className="text-sm text-sage-deeper">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/services" className="text-sm text-forest font-semibold border-b border-forest pb-0.5 hover:opacity-70 transition-opacity">
            View All Services →
          </Link>
        </div>
      </div>
    </section>
  )
}
