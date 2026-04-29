import { supabase } from '@/lib/supabase'
import Image from 'next/image'

const STRIP_LABELS = [
  'Custom Furniture & Cabinetry',
  'Deck & Outdoor Structures',
  'Home Additions & Remodels',
  'Finish Carpentry & Trim',
]

export async function PhotoStrip() {
  const { data: categories } = await supabase
    .from('service_categories')
    .select('name, cover_image_url')
    .eq('visible', true)
    .order('sort_order')
    .limit(4)

  const items = categories ?? STRIP_LABELS.map((name) => ({ name, cover_image_url: null }))

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5 bg-stone-border">
      {items.map((item) => (
        <div key={item.name} className="relative aspect-[4/3] bg-stone-muted overflow-hidden group">
          {item.cover_image_url ? (
            <Image
              src={item.cover_image_url}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-stone-muted to-stone-border" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/70 to-transparent" />
          <p className="absolute bottom-3 left-3 text-[10px] font-bold text-white tracking-widest uppercase">
            {item.name.split('&')[0].trim()}
          </p>
        </div>
      ))}
    </div>
  )
}
