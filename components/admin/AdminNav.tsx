'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { signOut } from 'next-auth/react'

const NAV_ITEMS = [
  { href: '/admin/bookings', label: 'Bookings', icon: '📅' },
  { href: '/admin/services', label: 'Services', icon: '🗂' },
  { href: '/admin/portfolio', label: 'Portfolio', icon: '🖼' },
  { href: '/admin/reviews', label: 'Reviews', icon: '★' },
  { href: '/admin/team', label: 'Team', icon: '👥' },
  { href: '/admin/availability', label: 'Availability', icon: '🕐' },
]

export function AdminNav() {
  const path = usePathname()
  return (
    <aside className="w-52 min-h-screen bg-forest-deeper flex flex-col flex-shrink-0">
      <div className="px-5 py-6 border-b border-forest">
        <p className="text-xs font-black text-stone tracking-[0.2em] uppercase">TCS Admin</p>
      </div>
      <nav className="flex-1 py-4">
        {NAV_ITEMS.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex items-center gap-3 px-5 py-3 text-sm transition-colors',
              path.startsWith(href)
                ? 'bg-forest text-stone border-l-2 border-sage font-semibold'
                : 'text-sage-deeper hover:text-stone hover:bg-forest/50'
            )}
          >
            <span aria-hidden="true">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-forest">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="text-xs text-sage-deeper hover:text-stone transition-colors"
        >
          ← Sign Out
        </button>
      </div>
    </aside>
  )
}
