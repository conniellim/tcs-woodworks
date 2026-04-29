import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminNav } from '@/components/admin/AdminNav'

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/admin/login')
  return (
    <div className="flex min-h-screen bg-stone">
      <AdminNav />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
