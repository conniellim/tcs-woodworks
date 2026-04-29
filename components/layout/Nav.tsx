import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function Nav() {
  return (
    <nav className="bg-stone border-b border-stone-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-sm font-black text-forest tracking-[0.2em] uppercase">
          The Carpenter&apos;s Son
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: '/services', label: 'Services' },
            { href: '/portfolio', label: 'Portfolio' },
            { href: '/about', label: 'About' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm text-sage-dark hover:text-forest transition-colors">
              {label}
            </Link>
          ))}
          <Button href="/book" size="sm">Book a Consult</Button>
        </div>
      </div>
    </nav>
  )
}
