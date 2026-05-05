import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { TCSLogo } from '@/components/ui/TCSLogo'

export function Nav() {
  return (
    <nav className="bg-stone border-b border-stone-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <TCSLogo size={36} />
          <span className="text-sm font-black text-forest tracking-[0.2em] uppercase">
            The Carpenter&apos;s Son
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: '/services', label: 'Services' },
            { href: '/portfolio', label: 'Portfolio' },
            { href: '/about', label: 'About' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm text-sage-dark hover:text-forest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 rounded">
              {label}
            </Link>
          ))}
          <Button href="/book" size="sm">Book a Consult</Button>
        </div>
        <button
          className="md:hidden text-forest p-2"
          aria-label="Open navigation menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </nav>
  )
}
