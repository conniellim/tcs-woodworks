import Image from 'next/image'
import Link from 'next/link'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { supabase } from '@/lib/supabase'

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const { data: categories } = await supabase
    .from('service_categories')
    .select('id, name')
    .eq('visible', true)
    .order('sort_order')

  let photosQuery = supabase
    .from('portfolio_photos')
    .select('*, service_category:service_categories(name)')
    .order('created_at', { ascending: false })

  if (params.category) {
    photosQuery = photosQuery.eq('category_id', params.category)
  }

  const { data: photos } = await photosQuery

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="mb-12">
        <SectionLabel>Our Work</SectionLabel>
        <h1 className="text-4xl md:text-5xl font-black text-forest tracking-tight">Portfolio</h1>
      </div>
      <div className="flex gap-3 flex-wrap mb-12">
        <Link
          href="/portfolio"
          className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
            !params.category ? 'bg-forest text-stone' : 'bg-stone-mid text-sage-dark hover:bg-stone-border'
          }`}
        >
          All
        </Link>
        {(categories ?? []).map((cat) => (
          <Link
            key={cat.id}
            href={`/portfolio?category=${cat.id}`}
            className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
              params.category === cat.id
                ? 'bg-forest text-stone'
                : 'bg-stone-mid text-sage-dark hover:bg-stone-border'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
      {photos && photos.length > 0 ? (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {photos.map((photo) => (
            <div key={photo.id} className="break-inside-avoid rounded overflow-hidden bg-stone-mid">
              <div className="relative">
                <Image
                  src={photo.image_url}
                  alt={photo.caption ?? 'Portfolio photo'}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              {photo.caption && (
                <p className="p-3 text-xs text-sage-dark">{photo.caption}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sage-dark text-center py-20">Portfolio photos coming soon.</p>
      )}
    </div>
  )
}
