import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { supabase } from '@/lib/supabase'

export default async function ServicesPage() {
  const { data: categories } = await supabase
    .from('service_categories')
    .select('*')
    .eq('visible', true)
    .order('sort_order')

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="mb-16">
        <SectionLabel>What We Do</SectionLabel>
        <h1 className="text-4xl md:text-5xl font-black text-forest tracking-tight">Our Services</h1>
        <p className="text-sage-deeper mt-4 max-w-xl">
          From small repairs to full construction projects, every job gets the same attention to detail.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {(categories ?? []).map((cat) => (
          <div key={cat.id} className="bg-stone-mid rounded overflow-hidden flex flex-col">
            <div className="relative aspect-video bg-stone-muted">
              {cat.cover_image_url ? (
                <Image src={cat.cover_image_url} alt={cat.name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-stone-muted" />
              )}
            </div>
            <div className="p-8 flex flex-col flex-1">
              <h2 className="text-xl font-black text-forest mb-2">{cat.name}</h2>
              <p className="text-sage-deeper leading-relaxed flex-1">{cat.description}</p>
              <div className="mt-6">
                <Button href={`/book?category=${cat.id}`} size="sm">Book a Consultation</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
