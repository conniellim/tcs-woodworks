import 'server-only'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function requireAdmin(): Promise<void> {
  const session = await auth()
  if (!session) redirect('/admin/login')
}
