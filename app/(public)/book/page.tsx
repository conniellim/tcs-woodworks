import { BookingWizard } from '@/components/booking/BookingWizard'
import { supabase } from '@/lib/supabase'

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const { data: categories } = await supabase
    .from('service_categories')
    .select('*')
    .eq('visible', true)
    .order('sort_order')

  return (
    <div className="min-h-screen bg-stone">
      <div className="bg-forest py-12 px-6 text-center">
        <h1 className="text-3xl font-black text-stone">Book a Free Consultation</h1>
        <p className="text-sage mt-2">Tell us about your project — we&apos;ll find a time that works.</p>
      </div>
      <BookingWizard
        categories={categories ?? []}
        initialCategoryId={params.category}
      />
    </div>
  )
}
