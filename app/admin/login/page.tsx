import { signIn } from '@/lib/auth'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-mid">
      <div className="bg-white rounded-lg p-10 shadow-sm text-center max-w-sm w-full">
        <h1 className="text-xl font-bold text-forest mb-2">TCS Admin</h1>
        <p className="text-sage-dark text-sm mb-8">Sign in to manage your site</p>
        <form action={async () => {
          'use server'
          await signIn('google', { redirectTo: '/admin/bookings' })
        }}>
          <button
            type="submit"
            className="w-full bg-forest text-stone py-3 rounded font-semibold text-sm hover:bg-forest-light transition-colors"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </main>
  )
}
