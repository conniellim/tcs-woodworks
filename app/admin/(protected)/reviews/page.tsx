import { supabaseAdmin } from '@/lib/supabase-admin'
import { createReview, deleteReview, toggleFeatured } from './actions'

export default async function ReviewsPage() {
  const { data: reviews } = await supabaseAdmin
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-black text-forest mb-2">Reviews</h1>
      <p className="text-sm text-sage-dark mb-8">Featured reviews (max 3) appear on the homepage.</p>

      <div className="bg-white border border-stone-border rounded p-6 mb-8">
        <h2 className="font-bold text-forest mb-4">Add Review</h2>
        <form action={createReview} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-forest mb-1">Customer Name</label>
              <input name="customer_name" required className="w-full border border-stone-border rounded px-3 py-2 text-sm focus:outline-none focus:border-forest" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-forest mb-1">City</label>
              <input name="customer_city" className="w-full border border-stone-border rounded px-3 py-2 text-sm focus:outline-none focus:border-forest" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-forest mb-1">Quote</label>
            <textarea name="quote" rows={3} required className="w-full border border-stone-border rounded px-3 py-2 text-sm focus:outline-none focus:border-forest resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-forest mb-1">Star Rating</label>
            <select name="star_rating" defaultValue="5" className="border border-stone-border rounded px-3 py-2 text-sm focus:outline-none focus:border-forest">
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
            </select>
          </div>
          <button type="submit" className="bg-forest text-stone px-4 py-2 rounded text-sm font-semibold hover:bg-forest-light transition-colors">
            Add Review
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {(reviews ?? []).map((r) => (
          <div key={r.id} className={`bg-white border rounded p-4 ${r.featured ? 'border-sage' : 'border-stone-border'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-forest text-sm">{r.customer_name}</p>
                  {r.customer_city && <span className="text-xs text-sage-dark">· {r.customer_city}</span>}
                  <span className="text-xs text-amber-500">{'★'.repeat(r.star_rating)}</span>
                </div>
                <p className="text-sm text-sage-deeper italic">&ldquo;{r.quote}&rdquo;</p>
              </div>
              <div className="flex flex-col gap-2 items-end flex-shrink-0">
                <form action={toggleFeatured.bind(null, r.id, r.featured)}>
                  <button type="submit" className={`text-xs px-2 py-1 rounded font-semibold ${r.featured ? 'bg-sage text-forest' : 'bg-stone-mid text-sage-dark'}`}>
                    {r.featured ? '★ Featured' : 'Feature'}
                  </button>
                </form>
                <form action={deleteReview.bind(null, r.id)}>
                  <button type="submit" className="text-xs text-red-500 hover:text-red-700"
                    onClick={(e) => { if (!confirm('Delete this review?')) e.preventDefault() }}>
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
