# Marketing Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build all public-facing pages — homepage, services, portfolio, and about — with the Forest & Stone design system.

**Architecture:** All pages are Next.js App Router server components that fetch directly from Supabase. Shared layout components (Nav, Footer) wrap every public page. No client-side state needed on public pages.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase (server-side fetch), clsx

**Prerequisite:** Plan 1 (Foundation) must be complete — Tailwind tokens, Supabase client, and types must exist.

---

## File Map

| File | Purpose |
|---|---|
| `components/layout/Nav.tsx` | Top nav bar — logo, links, Book CTA |
| `components/layout/Footer.tsx` | Footer — copyright, license, social links |
| `components/ui/Button.tsx` | Reusable button with variant props |
| `components/ui/SectionLabel.tsx` | Small uppercase label used above section headings |
| `components/home/Hero.tsx` | Full-bleed green hero with headline + dual CTAs |
| `components/home/PhotoStrip.tsx` | 4-column strip of work photos |
| `components/home/MissionSection.tsx` | Story text + 3 stats |
| `components/home/ServicesPreview.tsx` | 3-up service category grid |
| `components/home/TestimonialsSection.tsx` | 3-column review cards |
| `components/home/BookingCTA.tsx` | Dark green CTA band |
| `app/(public)/layout.tsx` | Public layout wrapping Nav + Footer |
| `app/(public)/page.tsx` | Homepage — assembles all home sections |
| `app/(public)/services/page.tsx` | Full services page |
| `app/(public)/portfolio/page.tsx` | Portfolio gallery with category filter |
| `app/(public)/about/page.tsx` | About / story page |

---

## Task 1: Shared UI Primitives

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/SectionLabel.tsx`

- [ ] **Step 1: Create Button component**

```tsx
// components/ui/Button.tsx
import Link from 'next/link'
import clsx from 'clsx'

interface ButtonProps {
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit'
}

export function Button({
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  children,
  className,
  type = 'button',
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold rounded transition-colors tracking-wide'
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }
  const variants = {
    primary: 'bg-forest text-stone hover:bg-forest-light',
    outline: 'border border-forest text-forest hover:bg-forest hover:text-stone',
    ghost: 'border border-sage text-sage hover:bg-sage hover:text-forest',
  }
  const classes = clsx(base, sizes[size], variants[variant], className)
  if (href) return <Link href={href} className={classes}>{children}</Link>
  return <button type={type} onClick={onClick} className={classes}>{children}</button>
}
```

- [ ] **Step 2: Create SectionLabel component**

```tsx
// components/ui/SectionLabel.tsx
import clsx from 'clsx'

export function SectionLabel({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <p className={clsx(
      'text-xs tracking-[0.2em] uppercase font-medium mb-2',
      light ? 'text-sage' : 'text-sage-dark'
    )}>
      {children}
    </p>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/
git commit -m "feat: add Button and SectionLabel UI primitives"
```

---

## Task 2: Nav and Footer

**Files:**
- Create: `components/layout/Nav.tsx`
- Create: `components/layout/Footer.tsx`

- [ ] **Step 1: Create Nav**

```tsx
// components/layout/Nav.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function Nav() {
  return (
    <nav className="bg-stone border-b border-stone-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-sm font-black text-forest tracking-[0.2em] uppercase">
          The Carpenter's Son
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
```

- [ ] **Step 2: Create Footer**

```tsx
// components/layout/Footer.tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-forest-deeper">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-sage-deeper">
          © {new Date().getFullYear()} The Carpenter's Son · Hayward, CA · License #XXXXXX
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
```

- [ ] **Step 3: Commit**

```bash
git add components/layout/
git commit -m "feat: add Nav and Footer layout components"
```

---

## Task 3: Public Layout

**Files:**
- Create: `app/(public)/layout.tsx`
- Modify: `app/(public)/page.tsx` (move `app/page.tsx` into group)

- [ ] **Step 1: Create route group and layout**

```bash
mkdir -p app/\(public\)
mv app/page.tsx app/\(public\)/page.tsx
```

```tsx
// app/(public)/layout.tsx
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Verify still boots**

```bash
npm run dev
```

Expected: `http://localhost:3000` shows Nav + "coming soon" text + Footer.

- [ ] **Step 3: Commit**

```bash
git add app/
git commit -m "feat: add public route group with Nav/Footer layout"
```

---

## Task 4: Homepage — Hero and Photo Strip

**Files:**
- Create: `components/home/Hero.tsx`
- Create: `components/home/PhotoStrip.tsx`

- [ ] **Step 1: Create Hero**

```tsx
// components/home/Hero.tsx
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section className="bg-forest min-h-[520px] flex items-end pb-16 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-forest/60 to-forest-dark/80" />
      {/* Background photo placeholder — replace with real image via CSS or next/image */}
      <div className="absolute inset-0 bg-forest-light opacity-30" />
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <p className="text-xs text-sage tracking-[0.25em] uppercase mb-4">Hayward, CA · Est. 2005</p>
        <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-4">
          Built by Hand.<br />Built to Last.
        </h1>
        <p className="text-sage text-base md:text-lg mb-8 max-w-lg">
          Custom carpentry & full-service construction. Every project built with care, precision, and pride.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button href="/book" size="lg" variant="ghost">
            Schedule a Free Consultation →
          </Button>
          <Button href="/portfolio" size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
            View Our Work
          </Button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create PhotoStrip**

```tsx
// components/home/PhotoStrip.tsx
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

const STRIP_LABELS = [
  'Custom Furniture & Cabinetry',
  'Deck & Outdoor Structures',
  'Home Additions & Remodels',
  'Finish Carpentry & Trim',
]

export async function PhotoStrip() {
  const { data: categories } = await supabase
    .from('service_categories')
    .select('name, cover_image_url')
    .eq('visible', true)
    .order('sort_order')
    .limit(4)

  const items = categories ?? STRIP_LABELS.map((name) => ({ name, cover_image_url: null }))

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5 bg-stone-border">
      {items.map((item) => (
        <div key={item.name} className="relative aspect-[4/3] bg-stone-muted overflow-hidden group">
          {item.cover_image_url ? (
            <Image
              src={item.cover_image_url}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-stone-muted to-stone-border" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/70 to-transparent" />
          <p className="absolute bottom-3 left-3 text-[10px] font-bold text-white tracking-widest uppercase">
            {item.name.split('&')[0].trim()}
          </p>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/home/Hero.tsx components/home/PhotoStrip.tsx
git commit -m "feat: add Hero and PhotoStrip homepage sections"
```

---

## Task 5: Homepage — Mission, Services Preview, Testimonials, CTA

**Files:**
- Create: `components/home/MissionSection.tsx`
- Create: `components/home/ServicesPreview.tsx`
- Create: `components/home/TestimonialsSection.tsx`
- Create: `components/home/BookingCTA.tsx`

- [ ] **Step 1: Create MissionSection**

```tsx
// components/home/MissionSection.tsx
import { SectionLabel } from '@/components/ui/SectionLabel'

const STATS = [
  { value: '15+', label: 'Years Experience' },
  { value: '200+', label: 'Projects Completed' },
  { value: '5★', label: 'Yelp Rating' },
]

export function MissionSection() {
  return (
    <section className="bg-stone-mid py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <SectionLabel>Our Story</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-black text-forest tracking-tight mb-6">
          A Family Trade, Perfected Over Generations
        </h2>
        <p className="text-sage-deeper text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12">
          From custom furniture to full home additions, we bring the same dedication to craft
          whether the job is small or large. Every project is personal — we work directly with
          you from first sketch to final nail.
        </p>
        <div className="flex justify-center gap-16">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-4xl font-black text-forest">{value}</p>
              <p className="text-xs text-sage-dark tracking-widest uppercase mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create ServicesPreview**

```tsx
// components/home/ServicesPreview.tsx
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { SectionLabel } from '@/components/ui/SectionLabel'

export async function ServicesPreview() {
  const { data: categories } = await supabase
    .from('service_categories')
    .select('id, name, description, cover_image_url')
    .eq('visible', true)
    .order('sort_order')
    .limit(3)

  return (
    <section className="py-20 px-6 bg-stone">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <SectionLabel>What We Do</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black text-forest tracking-tight">Every Job, Done Right</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {(categories ?? []).map((cat) => (
            <div key={cat.id} className="bg-stone-mid rounded overflow-hidden group">
              <div className="relative aspect-video bg-stone-muted">
                {cat.cover_image_url ? (
                  <Image src={cat.cover_image_url} alt={cat.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-stone-muted" />
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-forest mb-1">{cat.name}</h3>
                <p className="text-sm text-sage-deeper">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/services" className="text-sm text-forest font-semibold border-b border-forest pb-0.5 hover:opacity-70 transition-opacity">
            View All Services →
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create TestimonialsSection**

```tsx
// components/home/TestimonialsSection.tsx
import { supabase } from '@/lib/supabase'
import { SectionLabel } from '@/components/ui/SectionLabel'

export async function TestimonialsSection() {
  const { data: reviews } = await supabase
    .from('testimonials')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(3)

  if (!reviews || reviews.length === 0) return null

  return (
    <section className="py-20 px-6 bg-stone-mid">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <SectionLabel>Reviews</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black text-forest tracking-tight">What Our Customers Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.id} className="bg-stone rounded p-8">
              <div className="text-forest text-lg mb-3">{'★'.repeat(r.star_rating)}</div>
              <p className="text-sage-deeper italic leading-relaxed mb-6">"{r.quote}"</p>
              <p className="text-xs font-bold text-forest tracking-wide">
                {r.customer_name} · {r.customer_city}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create BookingCTA**

```tsx
// components/home/BookingCTA.tsx
import { Button } from '@/components/ui/Button'

export function BookingCTA() {
  return (
    <section className="bg-forest py-24 px-6 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-stone tracking-tight mb-4">
          Ready to Start Your Project?
        </h2>
        <p className="text-sage mb-10 text-lg">
          Book a free consultation — let's talk about what you have in mind.
        </p>
        <Button href="/book" size="lg" variant="ghost">
          Schedule a Free Consultation →
        </Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/home/
git commit -m "feat: add MissionSection, ServicesPreview, TestimonialsSection, BookingCTA"
```

---

## Task 6: Assemble Homepage

**Files:**
- Modify: `app/(public)/page.tsx`

- [ ] **Step 1: Assemble all sections**

```tsx
// app/(public)/page.tsx
import { Hero } from '@/components/home/Hero'
import { PhotoStrip } from '@/components/home/PhotoStrip'
import { MissionSection } from '@/components/home/MissionSection'
import { ServicesPreview } from '@/components/home/ServicesPreview'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { BookingCTA } from '@/components/home/BookingCTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <PhotoStrip />
      <MissionSection />
      <ServicesPreview />
      <TestimonialsSection />
      <BookingCTA />
    </>
  )
}
```

- [ ] **Step 2: Verify homepage renders**

```bash
npm run dev
```

Visit `http://localhost:3000`. Expected: All sections render top to bottom with no console errors. Services and photo strip show placeholder styling until real data/images are added.

- [ ] **Step 3: Commit**

```bash
git add app/\(public\)/page.tsx
git commit -m "feat: assemble homepage with all sections"
```

---

## Task 7: Services Page

**Files:**
- Create: `app/(public)/services/page.tsx`

- [ ] **Step 1: Create services page**

```tsx
// app/(public)/services/page.tsx
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { supabase } from '@/lib/supabase'

export default async function ServicesPage() {
  const { data: categories } = await supabase
    .from('service_categories')
    .select('*')
    .eq('visible', true)
    .order('sort_order')

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="mb-16">
        <SectionLabel>What We Do</SectionLabel>
        <h1 className="text-4xl md:text-5xl font-black text-forest tracking-tight">Our Services</h1>
        <p className="text-sage-deeper mt-4 max-w-xl">
          From small repairs to full construction projects, every job gets the same attention to detail.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {(categories ?? []).map((cat) => (
          <div key={cat.id} className="bg-stone-mid rounded overflow-hidden flex flex-col">
            <div className="relative aspect-video bg-stone-muted">
              {cat.cover_image_url ? (
                <Image src={cat.cover_image_url} alt={cat.name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-stone-muted" />
              )}
            </div>
            <div className="p-8 flex flex-col flex-1">
              <h2 className="text-xl font-black text-forest mb-2">{cat.name}</h2>
              <p className="text-sage-deeper leading-relaxed flex-1">{cat.description}</p>
              <div className="mt-6">
                <Button href={`/book?category=${cat.id}`} size="sm">Book a Consultation</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npm run dev
```

Visit `http://localhost:3000/services`. Expected: all 6 seeded service categories render in a 2-column grid.

- [ ] **Step 3: Commit**

```bash
git add app/\(public\)/services/
git commit -m "feat: add services page with all categories"
```

---

## Task 8: Portfolio Page

**Files:**
- Create: `app/(public)/portfolio/page.tsx`

- [ ] **Step 1: Create portfolio page**

```tsx
// app/(public)/portfolio/page.tsx
import Image from 'next/image'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { supabase } from '@/lib/supabase'

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const { data: categories } = await supabase
    .from('service_categories')
    .select('id, name')
    .eq('visible', true)
    .order('sort_order')

  let photosQuery = supabase
    .from('portfolio_photos')
    .select('*, service_category:service_categories(name)')
    .order('created_at', { ascending: false })

  if (searchParams.category) {
    photosQuery = photosQuery.eq('category_id', searchParams.category)
  }

  const { data: photos } = await photosQuery

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="mb-12">
        <SectionLabel>Our Work</SectionLabel>
        <h1 className="text-4xl md:text-5xl font-black text-forest tracking-tight">Portfolio</h1>
      </div>
      {/* Category filter */}
      <div className="flex gap-3 flex-wrap mb-12">
        <a
          href="/portfolio"
          className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
            !searchParams.category ? 'bg-forest text-stone' : 'bg-stone-mid text-sage-dark hover:bg-stone-border'
          }`}
        >
          All
        </a>
        {(categories ?? []).map((cat) => (
          <a
            key={cat.id}
            href={`/portfolio?category=${cat.id}`}
            className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
              searchParams.category === cat.id
                ? 'bg-forest text-stone'
                : 'bg-stone-mid text-sage-dark hover:bg-stone-border'
            }`}
          >
            {cat.name}
          </a>
        ))}
      </div>
      {/* Photo grid */}
      {photos && photos.length > 0 ? (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {photos.map((photo) => (
            <div key={photo.id} className="break-inside-avoid rounded overflow-hidden bg-stone-mid">
              <div className="relative">
                <Image
                  src={photo.image_url}
                  alt={photo.caption ?? 'Portfolio photo'}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              {photo.caption && (
                <p className="p-3 text-xs text-sage-dark">{photo.caption}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sage-dark text-center py-20">Portfolio photos coming soon.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npm run dev
```

Visit `http://localhost:3000/portfolio`. Expected: page renders with filter buttons and "Portfolio photos coming soon." message (no photos in DB yet).

- [ ] **Step 3: Commit**

```bash
git add app/\(public\)/portfolio/
git commit -m "feat: add portfolio page with category filter"
```

---

## Task 9: About Page

**Files:**
- Create: `app/(public)/about/page.tsx`

- [ ] **Step 1: Create about page**

```tsx
// app/(public)/about/page.tsx
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'

export default async function AboutPage() {
  const { data: team } = await supabase
    .from('team_members')
    .select('*')

  return (
    <div>
      {/* Hero band */}
      <section className="bg-forest py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionLabel light>Our Story</SectionLabel>
          <h1 className="text-4xl md:text-5xl font-black text-stone tracking-tight mt-2 mb-6">
            A Family Trade, Perfected Over Generations
          </h1>
          <p className="text-sage text-lg leading-relaxed">
            The Carpenter's Son was founded on a simple belief: that great work speaks for itself.
            Based in Hayward, CA, we've been building custom carpentry and construction projects
            for Bay Area families and businesses since 2005.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-stone">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: 'Craftsmanship', body: 'Every cut, joint, and finish is executed with precision. We don\'t rush. We don\'t cut corners.' },
              { title: 'Transparency', body: 'Clear estimates, honest timelines, and direct communication from first call to final walkthrough.' },
              { title: 'Longevity', body: 'We build things that last decades, not years. Materials, methods, and workmanship chosen for the long run.' },
            ].map(({ title, body }) => (
              <div key={title}>
                <h3 className="text-lg font-black text-forest mb-3">{title}</h3>
                <p className="text-sage-deeper leading-relaxed text-sm">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {team && team.length > 0 && (
        <section className="py-20 px-6 bg-stone-mid">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <SectionLabel>The Team</SectionLabel>
              <h2 className="text-3xl font-black text-forest tracking-tight">People Behind the Work</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member) => (
                <div key={member.id} className="text-center">
                  <div className="w-20 h-20 rounded-full bg-stone-muted mx-auto mb-4 overflow-hidden">
                    {member.avatar_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <h3 className="font-bold text-forest">{member.name}</h3>
                  <p className="text-sm text-sage-dark">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-6 bg-stone text-center">
        <h2 className="text-2xl font-black text-forest mb-4">Let's Build Something Together</h2>
        <Button href="/book" size="lg">Schedule a Free Consultation</Button>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npm run dev
```

Visit `http://localhost:3000/about`. Expected: green hero band, three value cards, CTA section. Team section hidden until team members are added in admin.

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit and push**

```bash
git add app/\(public\)/about/ app/\(public\)/services/ app/\(public\)/portfolio/
git commit -m "feat: add services, portfolio, and about public pages"
git push
```

---

**Plan 2 complete.** All public pages live. Vercel auto-deploys on push. Proceed to Plan 3 (Booking System).
