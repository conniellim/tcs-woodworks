import { supabase } from '@/lib/supabase'
import Image from 'next/image'

const STRIP_FALLBACK = [
  { name: 'Custom Furniture & Cabinetry', cover_image_url: '/photos/cabinetry.jpg' },
  { name: 'Fence & Landscaping',    cover_image_url: '/photos/fence-and-landscaping.jpg' },
  { name: 'Home Additions & Remodels',    cover_image_url: '/photos/kitchen-remodel.jpg' },
  { name: 'Finish Carpentry & Trim',      cover_image_url: '/photos/built-in-entertainment-center.jpg' },
]

export async function PhotoStrip() {
  const { data: categories } = await supabase
    .from('service_categories')
    .select('name, cover_image_url')
    .eq('visible', true)
    .order('sort_order')
    .limit(4)

  const items = (categories && categories.length > 0) ? categories : STRIP_FALLBACK

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
