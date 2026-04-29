import { supabaseAdmin } from '@/lib/supabase-admin'
import { createCategory, deleteCategory, toggleCategoryVisibility } from './actions'

export default async function ServicesPage() {
  const { data: categories } = await supabaseAdmin
    .from('service_categories')
    .select('*')
    .order('sort_order')

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-black text-forest mb-8">Service Categories</h1>

      <div className="bg-white border border-stone-border rounded p-6 mb-8">
        <h2 className="font-bold text-forest mb-4">Add New Category</h2>
        <form action={createCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-forest mb-1">Name</label>
            <input name="name" required className="w-full border border-stone-border rounded px-3 py-2 text-sm focus:outline-none focus:border-forest" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-forest mb-1">Description</label>
            <textarea name="description" rows={3} className="w-full border border-stone-border rounded px-3 py-2 text-sm focus:outline-none focus:border-forest resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-forest mb-1">Sort Order</label>
            <input name="sort_order" type="number" defaultValue={99} className="w-24 border border-stone-border rounded px-3 py-2 text-sm focus:outline-none focus:border-forest" />
          </div>
          <button type="submit" className="bg-forest text-stone px-4 py-2 rounded text-sm font-semibold hover:bg-forest-light transition-colors">
            Add Category
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {(categories ?? []).map((cat) => (
          <div key={cat.id} className="bg-white border border-stone-border rounded p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-forest">{cat.name}</p>
              <p className="text-xs text-sage-dark mt-0.5 max-w-md truncate">{cat.description}</p>
              <span className={`text-xs mt-1 inline-block font-medium ${cat.visible ? 'text-forest' : 'text-sage-dark'}`}>
                {cat.visible ? '● Visible' : '○ Hidden'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <form action={toggleCategoryVisibility.bind(null, cat.id, cat.visible)}>
                <button type="submit" className="text-xs text-sage-dark hover:text-forest font-semibold border border-stone-border px-2 py-1 rounded">
                  {cat.visible ? 'Hide' : 'Show'}
                </button>
              </form>
              <form action={deleteCategory.bind(null, cat.id)}>
                <button type="submit" className="text-xs text-red-500 hover:text-red-700 font-semibold">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
