import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-forest-deeper">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-sage-deeper">
          © {new Date().getFullYear()} The Carpenter&apos;s Son · Hayward, CA · License #XXXXXX
        </p>
        <div className="flex gap-6">
          {[
            { href: 'https://www.yelp.com/biz/the-carpenters-son-hayward-2', label: 'Yelp' },
            { href: '#', label: 'Instagram' },
            { href: '#', label: 'Facebook' },
          ].map(({ href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className="text-xs text-sage-deeper hover:text-sage transition-colors">
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
