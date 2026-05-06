import Image from 'next/image'
import Link from 'next/link'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { supabase } from '@/lib/supabase'

const PHOTOS_FALLBACK = [
  { id: '1',  image_url: '/photos/custom-kitchen-cabs.jpg',           caption: 'Custom kitchen cabinets' },
  { id: '2',  image_url: '/photos/entertainment-wall.jpg',            caption: 'Entertainment wall' },
  { id: '3',  image_url: '/photos/kitchen-remodel.jpg',              caption: 'Kitchen remodel' },
  { id: '4',  image_url: '/photos/cabinetry.jpg',                    caption: 'Custom cabinetry' },
  { id: '5',  image_url: '/photos/bathroom.jpg',                     caption: 'Bathroom remodel' },
  { id: '6',  image_url: '/photos/custom-cabinet.jpg',               caption: 'Custom cabinet' },
  { id: '7',  image_url: '/photos/custom-vanity-cabinet.jpg',        caption: 'Custom vanity cabinet' },
  { id: '8',  image_url: '/photos/wine-cabinet.jpg',                 caption: 'Wine cabinet' },
  { id: '9',  image_url: '/photos/slide-out-pantry.jpg',             caption: 'Slide-out pantry' },
  { id: '10', image_url: '/photos/built-in-entertainment-center.jpg',caption: 'Built-in entertainment center' },
  { id: '11', image_url: '/photos/fence-and-landscaping.jpg',        caption: 'Fence and landscaping' },
  { id: '12', image_url: '/photos/kitchen.jpg',                      caption: 'Kitchen' },
  { id: '13', image_url: '/photos/kitchen-install.jpg',              caption: 'Kitchen installation' },
  { id: '14', image_url: '/photos/fireplace.jpg',                    caption: 'Fireplace build' },
  { id: '15', image_url: '/photos/commercial.jpg',                   caption: 'Commercial project' },
  { id: '16', image_url: '/photos/metal-work.jpg',                   caption: 'Metal work' },
  { id: '17', image_url: '/photos/table-restoration.jpg',            caption: 'Table restoration' },
  { id: '18', image_url: '/photos/process.jpg',                      caption: 'Project in progress' },
  { id: '19', image_url: '/photos/process-2.jpg',                    caption: 'Project in progress' },
]

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

  const { data: photosData } = await photosQuery
  const photos = (photosData && photosData.length > 0) ? photosData : PHOTOS_FALLBACK

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
      {photos.length > 0 ? (
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
