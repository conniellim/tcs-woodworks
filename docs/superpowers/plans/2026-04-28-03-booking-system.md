# Booking System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 3-step booking wizard (category picker → project description + photo upload → Cal.com time picker) with a webhook that creates confirmed Supabase records and triggers Google Calendar invites.

**Architecture:** The wizard is a client component orchestrating 3 steps. Step 2 saves a draft booking to Supabase via an API route before showing the Cal.com embed. Cal.com fires a webhook to `/api/cal-webhook` on confirmation; the handler promotes the draft to a confirmed booking using the `draft_id` passed as Cal.com metadata. Cal.com handles all Google Calendar invite delivery.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase, @calcom/embed-react, react-dropzone, Cal.com (hosted), Google Calendar (via Cal.com integration)

**Prerequisite:** Plans 1 & 2 complete. Supabase schema and types must exist.

---

## File Map

| File | Purpose |
|---|---|
| `components/booking/BookingWizard.tsx` | Client component — owns step state, assembles wizard |
| `components/booking/StepCategory.tsx` | Step 1 — service category grid selector |
| `components/booking/StepProject.tsx` | Step 2 — name, email, description, photo upload |
| `components/booking/StepCalendar.tsx` | Step 3 — Cal.com embed with draft_id metadata |
| `components/booking/StepIndicator.tsx` | Progress bar (3 dots) |
| `app/(public)/book/page.tsx` | /book page — renders BookingWizard |
| `app/api/bookings/draft/route.ts` | POST — creates pending_cal draft, returns draft_id |
| `app/api/bookings/upload/route.ts` | POST — uploads photos to Supabase storage, returns URLs |
| `app/api/cal-webhook/route.ts` | POST — Cal.com webhook handler, promotes draft to booking |

---

## Task 1: Step Indicator Component

**Files:**
- Create: `components/booking/StepIndicator.tsx`

- [ ] **Step 1: Create component**

```tsx
// components/booking/StepIndicator.tsx

interface StepIndicatorProps {
  current: 1 | 2 | 3
  labels: [string, string, string]
}

export function StepIndicator({ current, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {([1, 2, 3] as const).map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step < current
                  ? 'bg-sage text-forest'
                  : step === current
                  ? 'bg-forest text-stone'
                  : 'bg-stone-muted text-sage-dark'
              }`}
            >
              {step < current ? '✓' : step}
            </div>
            <span className={`text-xs hidden sm:block ${step === current ? 'text-forest font-semibold' : 'text-sage-dark'}`}>
              {labels[step - 1]}
            </span>
          </div>
          {step < 3 && <div className={`w-8 h-0.5 ${step < current ? 'bg-sage' : 'bg-stone-muted'}`} />}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/booking/StepIndicator.tsx
git commit -m "feat: add booking wizard StepIndicator component"
```

---

## Task 2: Draft Booking API Route

**Files:**
- Create: `app/api/bookings/draft/route.ts`

- [ ] **Step 1: Create draft booking endpoint**

```ts
// app/api/bookings/draft/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { customer_name, customer_email, customer_phone, service_category_id, project_description, photo_urls } = body

  if (!customer_name || !customer_email || !service_category_id || !project_description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .insert({
      customer_name,
      customer_email,
      customer_phone: customer_phone || null,
      service_category_id,
      project_description,
      photo_urls: photo_urls ?? [],
      status: 'pending_cal',
    })
    .select('id')
    .single()

  if (error) {
    console.error('Draft booking error:', error)
    return NextResponse.json({ error: 'Failed to create draft booking' }, { status: 500 })
  }

  return NextResponse.json({ draft_id: data.id })
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/bookings/
git commit -m "feat: add draft booking API route"
```

---

## Task 3: Photo Upload API Route

**Files:**
- Create: `app/api/bookings/upload/route.ts`

- [ ] **Step 1: Create upload endpoint**

```ts
// app/api/bookings/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const files = formData.getAll('files') as File[]

  if (files.length === 0) {
    return NextResponse.json({ urls: [] })
  }

  const urls: string[] = []

  for (const file of files) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabaseAdmin.storage
      .from('booking-photos')
      .upload(path, buffer, { contentType: file.type })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const { data } = supabaseAdmin.storage.from('booking-photos').getPublicUrl(path)
    urls.push(data.publicUrl)
  }

  return NextResponse.json({ urls })
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/bookings/upload/
git commit -m "feat: add photo upload API route to Supabase storage"
```

---

## Task 4: Step 1 — Category Selector

**Files:**
- Create: `components/booking/StepCategory.tsx`

- [ ] **Step 1: Create component**

```tsx
// components/booking/StepCategory.tsx
'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import type { ServiceCategory } from '@/types'

interface StepCategoryProps {
  categories: ServiceCategory[]
  selected: string | null
  onSelect: (id: string) => void
  onNext: () => void
}

export function StepCategory({ categories, selected, onSelect, onNext }: StepCategoryProps) {
  return (
    <div>
      <h2 className="text-2xl font-black text-forest mb-2">What type of work do you need?</h2>
      <p className="text-sage-dark text-sm mb-8">Select a category to get started</p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`text-left rounded overflow-hidden border-2 transition-all ${
              selected === cat.id
                ? 'border-forest shadow-md'
                : 'border-stone-border hover:border-sage'
            }`}
          >
            <div className="relative aspect-video bg-stone-muted">
              {cat.cover_image_url ? (
                <Image src={cat.cover_image_url} alt={cat.name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-stone-muted" />
              )}
              {selected === cat.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-forest rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <div className="p-4 bg-stone-mid">
              <p className="font-bold text-forest text-sm">{cat.name}</p>
              <p className="text-xs text-sage-deeper mt-1 line-clamp-2">{cat.description}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!selected} variant="primary">
          Next: Describe Your Project →
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/booking/StepCategory.tsx
git commit -m "feat: add booking Step 1 — category selector"
```

---

## Task 5: Step 2 — Project Description + Photo Upload

**Files:**
- Create: `components/booking/StepProject.tsx`

- [ ] **Step 1: Create component**

```tsx
// components/booking/StepProject.tsx
'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/Button'
import type { ServiceCategory } from '@/types'

export interface ProjectFormData {
  name: string
  email: string
  phone: string
  description: string
  photoFiles: File[]
}

interface StepProjectProps {
  category: ServiceCategory | undefined
  initialData: ProjectFormData
  onSubmit: (data: ProjectFormData) => Promise<void>
  onBack: () => void
  isSubmitting: boolean
}

export function StepProject({ category, initialData, onSubmit, onBack, isSubmitting }: StepProjectProps) {
  const [form, setForm] = useState<ProjectFormData>(initialData)
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({})

  const onDrop = useCallback((accepted: File[]) => {
    setForm((prev) => ({ ...prev, photoFiles: [...prev.photoFiles, ...accepted].slice(0, 5) }))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 5,
  })

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.description.trim()) e.description = 'Please describe your project'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (validate()) onSubmit(form)
  }

  return (
    <div>
      {category && (
        <p className="text-xs text-sage-dark tracking-widest uppercase mb-2">{category.name}</p>
      )}
      <h2 className="text-2xl font-black text-forest mb-8">Tell us about your project</h2>

      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-sm font-semibold text-forest mb-1.5">Your Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Full name"
            className="w-full border border-stone-border rounded px-4 py-3 text-sm focus:outline-none focus:border-forest"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-forest mb-1.5">Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="email@example.com"
            className="w-full border border-stone-border rounded px-4 py-3 text-sm focus:outline-none focus:border-forest"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-forest mb-1.5">
          Phone <span className="font-normal text-sage-dark">(optional)</span>
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          placeholder="(510) 555-0123"
          className="w-full border border-stone-border rounded px-4 py-3 text-sm focus:outline-none focus:border-forest"
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-forest mb-1.5">Project Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          placeholder="Describe what you're looking for — dimensions, materials, style, timeline, budget range..."
          rows={5}
          className="w-full border border-stone-border rounded px-4 py-3 text-sm focus:outline-none focus:border-forest resize-none"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      <div className="mb-8">
        <label className="block text-sm font-semibold text-forest mb-1.5">
          Reference Photos <span className="font-normal text-sage-dark">(optional, up to 5)</span>
        </label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-forest bg-stone-mid' : 'border-stone-muted hover:border-sage'
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-sm text-sage-dark">
            {isDragActive ? 'Drop photos here...' : '📎 Drag & drop photos or '}
            {!isDragActive && <span className="text-forest underline">browse</span>}
          </p>
          <p className="text-xs text-sage-dark mt-1">JPG, PNG, WebP · Max 10MB each</p>
        </div>
        {form.photoFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {form.photoFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-1 bg-stone-mid rounded px-3 py-1">
                <span className="text-xs text-forest">{f.name}</span>
                <button
                  onClick={() => setForm((p) => ({ ...p, photoFiles: p.photoFiles.filter((_, j) => j !== i) }))}
                  className="text-sage-dark hover:text-red-500 text-xs ml-1"
                >✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-sm text-sage-dark hover:text-forest transition-colors">← Back</button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Next: Pick a Time →'}
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/booking/StepProject.tsx
git commit -m "feat: add booking Step 2 — project description and photo upload"
```

---

## Task 6: Set Up Cal.com

**Files:** (no code — external setup)

- [ ] **Step 1: Create Cal.com account**

Go to https://cal.com → sign up for free → connect your Google Calendar under Settings → Calendars.

- [ ] **Step 2: Create an event type**

Create a new event type: "Free Consultation" · 30 minutes · set your availability.

Note the **event type slug** (e.g., `free-consultation`) — you'll need it for the embed.

- [ ] **Step 3: Set up webhook**

In Cal.com → Settings → Developer → Webhooks → Add webhook:
- URL: `https://your-vercel-domain.vercel.app/api/cal-webhook`
- Events: `BOOKING_CREATED`
- Secret: use the value of `CAL_WEBHOOK_SECRET` from your `.env.local`

- [ ] **Step 4: Add Cal.com username to .env.local**

```bash
# add to .env.local
NEXT_PUBLIC_CAL_USERNAME=your-cal-username
NEXT_PUBLIC_CAL_EVENT_SLUG=free-consultation
```

Also add these two env vars to Vercel dashboard.

---

## Task 7: Step 3 — Cal.com Calendar Embed

**Files:**
- Create: `components/booking/StepCalendar.tsx`

- [ ] **Step 1: Create component**

```tsx
// components/booking/StepCalendar.tsx
'use client'

import Cal, { getCalApi } from '@calcom/embed-react'
import { useEffect } from 'react'

interface StepCalendarProps {
  draftId: string
  customerEmail: string
  customerName: string
}

export function StepCalendar({ draftId, customerEmail, customerName }: StepCalendarProps) {
  useEffect(() => {
    getCalApi({}).then((cal) => {
      cal('ui', {
        theme: 'light',
        styles: { branding: { brandColor: '#2C3E2D' } },
        hideEventTypeDetails: false,
      })
    })
  }, [])

  const calLink = `${process.env.NEXT_PUBLIC_CAL_USERNAME}/${process.env.NEXT_PUBLIC_CAL_EVENT_SLUG}`

  return (
    <div>
      <h2 className="text-2xl font-black text-forest mb-2">Choose a time that works for you</h2>
      <p className="text-sage-dark text-sm mb-8">Pick a slot — you'll both get a Google Calendar invite automatically.</p>
      <div className="rounded overflow-hidden border border-stone-border">
        <Cal
          calLink={calLink}
          config={{
            name: customerName,
            email: customerEmail,
            metadata: { draft_id: draftId },
          }}
          style={{ width: '100%', height: '600px', overflow: 'scroll' }}
        />
      </div>
      <div className="mt-4 p-4 bg-stone-mid rounded flex items-start gap-3">
        <span className="text-sage text-lg">✓</span>
        <p className="text-sm text-sage-deeper">
          After booking, you and the owner both receive a Google Calendar invite. Your project details are saved so the owner can review them before your call.
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/booking/StepCalendar.tsx
git commit -m "feat: add booking Step 3 — Cal.com calendar embed"
```

---

## Task 8: Cal.com Webhook Handler

**Files:**
- Create: `lib/cal.ts`
- Create: `app/api/cal-webhook/route.ts`

- [ ] **Step 1: Create webhook signature verifier**

```ts
// lib/cal.ts
import crypto from 'crypto'

export function verifyCalWebhook(body: string, signature: string): boolean {
  const secret = process.env.CAL_WEBHOOK_SECRET!
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}
```

- [ ] **Step 2: Create webhook route**

```ts
// app/api/cal-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyCalWebhook } from '@/lib/cal'
import type { CalWebhookPayload } from '@/types'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-cal-signature-256') ?? ''

  if (!verifyCalWebhook(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload: CalWebhookPayload = JSON.parse(rawBody)

  if (payload.triggerEvent !== 'BOOKING_CREATED') {
    return NextResponse.json({ ok: true })
  }

  const draftId = payload.payload.metadata?.draft_id
  if (!draftId) {
    return NextResponse.json({ error: 'No draft_id in metadata' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('bookings')
    .update({
      status: 'new',
      cal_booking_uid: payload.payload.uid,
      scheduled_at: payload.payload.startTime,
    })
    .eq('id', draftId)
    .eq('status', 'pending_cal')

  if (error) {
    console.error('Webhook update error:', error)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/cal.ts app/api/cal-webhook/
git commit -m "feat: add Cal.com webhook handler to promote draft bookings"
```

---

## Task 9: Assemble BookingWizard and Book Page

**Files:**
- Create: `components/booking/BookingWizard.tsx`
- Create: `app/(public)/book/page.tsx`

- [ ] **Step 1: Create BookingWizard**

```tsx
// components/booking/BookingWizard.tsx
'use client'

import { useState } from 'react'
import { StepIndicator } from './StepIndicator'
import { StepCategory } from './StepCategory'
import { StepProject, type ProjectFormData } from './StepProject'
import { StepCalendar } from './StepCalendar'
import type { ServiceCategory } from '@/types'

interface BookingWizardProps {
  categories: ServiceCategory[]
  initialCategoryId?: string
}

export function BookingWizard({ categories, initialCategoryId }: BookingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialCategoryId ?? null)
  const [projectData, setProjectData] = useState<ProjectFormData>({
    name: '', email: '', phone: '', description: '', photoFiles: [],
  })
  const [draftId, setDraftId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)

  async function handleProjectSubmit(data: ProjectFormData) {
    setIsSubmitting(true)
    try {
      // Upload photos first
      let photoUrls: string[] = []
      if (data.photoFiles.length > 0) {
        const formData = new FormData()
        data.photoFiles.forEach((f) => formData.append('files', f))
        const uploadRes = await fetch('/api/bookings/upload', { method: 'POST', body: formData })
        const uploadJson = await uploadRes.json()
        photoUrls = uploadJson.urls ?? []
      }

      // Create draft booking
      const draftRes = await fetch('/api/bookings/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: data.name,
          customer_email: data.email,
          customer_phone: data.phone || null,
          service_category_id: selectedCategoryId,
          project_description: data.description,
          photo_urls: photoUrls,
        }),
      })
      const draftJson = await draftRes.json()
      if (!draftJson.draft_id) throw new Error('No draft_id returned')

      setProjectData(data)
      setDraftId(draftJson.draft_id)
      setStep(3)
    } catch (err) {
      console.error('Failed to save project details:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <StepIndicator
        current={step}
        labels={['Select Service', 'Your Project', 'Pick a Time']}
      />
      {step === 1 && (
        <StepCategory
          categories={categories}
          selected={selectedCategoryId}
          onSelect={setSelectedCategoryId}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <StepProject
          category={selectedCategory}
          initialData={projectData}
          onSubmit={handleProjectSubmit}
          onBack={() => setStep(1)}
          isSubmitting={isSubmitting}
        />
      )}
      {step === 3 && draftId && (
        <StepCalendar
          draftId={draftId}
          customerEmail={projectData.email}
          customerName={projectData.name}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create book page**

```tsx
// app/(public)/book/page.tsx
import { BookingWizard } from '@/components/booking/BookingWizard'
import { supabase } from '@/lib/supabase'

export default async function BookPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const { data: categories } = await supabase
    .from('service_categories')
    .select('*')
    .eq('visible', true)
    .order('sort_order')

  return (
    <div className="min-h-screen bg-stone">
      <div className="bg-forest py-12 px-6 text-center">
        <h1 className="text-3xl font-black text-stone">Book a Free Consultation</h1>
        <p className="text-sage mt-2">Tell us about your project — we'll find a time that works.</p>
      </div>
      <BookingWizard
        categories={categories ?? []}
        initialCategoryId={searchParams.category}
      />
    </div>
  )
}
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Test the full booking flow locally**

```bash
npm run dev
```

1. Visit `http://localhost:3000/book`
2. Select a service category → click Next
3. Fill in name, email, description → click "Next: Pick a Time"
4. Verify a row appears in Supabase `bookings` table with `status = 'pending_cal'`
5. Cal.com embed should show (if Cal.com credentials are set)
6. To test webhook locally, use [ngrok](https://ngrok.com): `ngrok http 3000` → update Cal.com webhook URL to the ngrok URL → complete a test booking → verify the Supabase row updates to `status = 'new'`

- [ ] **Step 5: Commit and push**

```bash
git add components/booking/ app/\(public\)/book/ app/api/ lib/cal.ts
git commit -m "feat: complete 3-step booking wizard with Cal.com and webhook"
git push
```

---

**Plan 3 complete.** Booking system is live. Proceed to Plan 4 (Admin Panel).
