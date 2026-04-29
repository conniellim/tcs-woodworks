import Image from 'next/image'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { addPortfolioPhoto, deletePortfolioPhoto } from './actions'

export default async function PortfolioPage() {
  const [{ data: photos }, { data: categories }] = await Promise.all([
    supabaseAdmin.from('portfolio_photos').select('*, service_category:service_categories(name)').order('created_at', { ascending: false }),
    supabaseAdmin.from('service_categories').select('id, name').order('sort_order'),
  ])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black text-forest mb-8">Portfolio</h1>

      <div className="bg-white border border-stone-border rounded p-6 mb-8 max-w-lg">
        <h2 className="font-bold text-forest mb-4">Add Photo</h2>
        <form action={addPortfolioPhoto} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-semibold text-forest mb-1">Photo</label>
            <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" required
              className="w-full text-sm text-sage-dark file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-stone-mid file:text-forest file:text-xs file:font-semibold" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-forest mb-1">Category</label>
            <select name="category_id" className="w-full border border-stone-border rounded px-3 py-2 text-sm focus:outline-none focus:border-forest">
              <option value="">No category</option>
              {(categories ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-forest mb-1">Caption (optional)</label>
            <input name="caption" className="w-full border border-stone-border rounded px-3 py-2 text-sm focus:outline-none focus:border-forest" />
          </div>
          <button type="submit" className="bg-forest text-stone px-4 py-2 rounded text-sm font-semibold hover:bg-forest-light transition-colors">
            Upload Photo
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(photos ?? []).map((photo) => (
          <div key={photo.id} className="relative group rounded overflow-hidden bg-stone-mid">
            <Image src={photo.image_url} alt={photo.caption ?? 'Portfolio photo'} width={300} height={200} className="w-full h-40 object-cover" />
            <div className="p-2">
              {photo.caption && <p className="text-xs text-sage-dark truncate">{photo.caption}</p>}
            </div>
            <form action={deletePortfolioPhoto.bind(null, photo.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button type="submit" className="w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold"
                aria-label="Delete photo">
                ✕
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
