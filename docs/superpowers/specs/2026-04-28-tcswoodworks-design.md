# TCS Woodworks — Website & Scheduling System Design

**Date:** 2026-04-28  
**Business:** The Carpenter's Son — Custom Carpentry & Full-Service Construction, Hayward, CA  
**Stack:** Next.js · Vercel · Cal.com · Supabase · Google OAuth · Google Calendar API

---

## 1. Overview

A modern marketing and booking website for The Carpenter's Son. Customers can browse services, view portfolio work, read reviews, and self-schedule consultations. The owner manages bookings, team assignments, service categories, portfolio, and testimonials through a Google-authenticated admin panel. Cal.com handles calendar availability and Google Calendar invites.

---

## 2. Visual Design

- **Palette:** Forest & Stone — deep forest green (`#2C3E2D`), natural off-white (`#F7F5F2`), stone grey (`#EDE9E3`), sage accent (`#A8C5A0`)
- **Typography:** Sans-serif (Inter or Helvetica Neue), heavy weight for headings, generous spacing
- **Style:** Contemporary, clean, bold — not rustic. Large photos, strong typographic hierarchy.
- **Homepage hero:** Full-bleed dark green hero with white headline overlay, dual CTA buttons

---

## 3. Site Structure

| Route | Page | Auth |
|---|---|---|
| `/` | Homepage | Public |
| `/services` | Service categories with images & descriptions | Public |
| `/portfolio` | Work gallery, filterable by category | Public |
| `/book` | 3-step booking wizard | Public |
| `/about` | Story, team, credentials | Public |
| `/admin` | Admin dashboard (redirect to login if unauthenticated) | Owner only |
| `/admin/bookings` | Booking list with status & team assignment | Owner only |
| `/admin/services` | Manage service categories | Owner only |
| `/admin/portfolio` | Manage gallery photos | Owner only |
| `/admin/reviews` | Manage testimonials | Owner only |
| `/admin/team` | Manage team members | Owner only |
| `/admin/availability` | Availability summary + Cal.com deep-link | Owner only |

---

## 4. Homepage Sections (top to bottom)

1. **Nav** — Logo, Services, Portfolio, About, Reviews, "Book a Consult" CTA button
2. **Hero** — Full-bleed forest green, large headline "Built by Hand. Built to Last.", subhead, two CTAs (Schedule Consult + View Our Work)
3. **Photo strip** — 4-column grid of work photos labeled by category (Cabinetry, Decks, Remodels, Trim Work)
4. **Mission / About** — Headline, 2–3 sentence narrative, 3 stats (years experience, projects completed, Yelp rating)
5. **Services preview** — 3-up grid of top service categories with photos, "View All Services" link
6. **Testimonials** — 3-column review cards (star rating, quote, customer name + city)
7. **Booking CTA** — Dark green band: "Ready to Start Your Project?" + "Schedule a Free Consultation" button
8. **Footer** — Copyright, license number, Yelp / Instagram / Facebook links

---

## 5. Service Categories

Stored in Supabase, manageable from admin panel:

1. Custom Furniture & Cabinetry
2. Deck & Outdoor Structures
3. Home Additions & Remodels
4. Finish Carpentry & Trim
5. Full Construction Projects
6. Repairs & Small Jobs

Each category has: name, description, cover image, sort order, visible/hidden toggle.

---

## 6. Booking Flow (3-step wizard)

### Step 1 — Select Service Category
- Grid of category cards (image + name + short description)
- "Next" button activates only after a category is selected

### Step 2 — Describe Your Project
- Fields: Full name, email address, project description (textarea), reference photos (optional file upload, JPG/PNG, up to 10MB each)
- "Next: Pick a Time" button

### Step 3 — Pick a Time (Cal.com embed)
- Cal.com calendar widget embedded inline, styled to match site palette
- Before showing the Cal.com embed, Steps 1–2 data is saved to Supabase as a **draft booking** (status: `pending_cal`) with a generated `draft_id`
- The `draft_id` is passed to the Cal.com embed as a metadata field
- Cal.com fires a webhook to `/api/cal-webhook` on booking confirmation
- The webhook handler reads `draft_id` from the Cal.com payload, promotes the draft to a confirmed booking, stores `cal_booking_uid`, sets status to `new`
- On booking confirmation:
  - Full Supabase booking record created (draft promoted)
  - Google Calendar invite sent to customer (via Cal.com)
  - Google Calendar invite sent to owner (via Cal.com)
  - Booking appears in admin panel with status "New" and unassigned team

---

## 7. Admin Panel

### Authentication
- Google OAuth via NextAuth.js
- Only the owner's Google account (whitelisted by email) can access `/admin` routes — email configured via `ADMIN_EMAIL` environment variable on Vercel
- All other Google sign-in attempts receive a 403

### Bookings View
- Filter tabs: All / New / Confirmed / Pending Review / In Progress / Completed / Cancelled
- Each booking card shows:
  - Customer name, email, phone
  - Service category tag
  - Project description excerpt
  - Photo count badge (clickable to view uploads)
  - Date/time of consultation
  - **Status pill** (color-coded): New (amber), Confirmed (green), Pending Review (purple), In Progress (blue), Completed (grey), Cancelled (red)
  - **Assigned team member** with avatar initial + name, "Reassign" link
- Left border color on card matches status color for quick scan

### Services Management
- List view with cover image thumbnail, category name, edit and delete actions
- "Add New" button opens a form: name, description, image upload, sort order

### Portfolio Management
- Grid of uploaded photos with category tag, caption, delete action
- "Add Photo" button: upload image, select category, add caption

### Reviews / Testimonials Management
- List of testimonials: star rating, quote, customer name, city, featured toggle
- Featured testimonials appear on homepage (max 3)
- "Add Review" button: manual entry form

### Team Management
- List of team members: name, role, avatar
- Assign to bookings from the bookings view

### Availability
- Summary view of working hours (read-only, synced from Cal.com)
- "Manage in Cal.com" deep-link button for editing hours, blocked dates, buffer times

---

## 8. Data Model (Supabase)

### `bookings`
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| customer_name | text | |
| customer_email | text | |
| customer_phone | text | Optional |
| service_category_id | uuid | FK → service_categories |
| project_description | text | |
| photo_urls | text[] | Supabase Storage URLs |
| cal_booking_uid | text | Cal.com booking reference |
| scheduled_at | timestamptz | |
| status | enum | new, confirmed, pending_review, in_progress, completed, cancelled |
| assigned_team_member_id | uuid | FK → team_members, nullable |
| created_at | timestamptz | |

### `service_categories`
| Column | Type |
|---|---|
| id | uuid |
| name | text |
| description | text |
| cover_image_url | text |
| sort_order | int |
| visible | boolean |

### `portfolio_photos`
| Column | Type |
|---|---|
| id | uuid |
| image_url | text |
| category_id | uuid |
| caption | text |
| created_at | timestamptz |

### `testimonials`
| Column | Type |
|---|---|
| id | uuid |
| customer_name | text |
| customer_city | text |
| quote | text |
| star_rating | int |
| featured | boolean |
| created_at | timestamptz |

### `team_members`
| Column | Type |
|---|---|
| id | uuid |
| name | text |
| role | text |
| avatar_url | text |

---

## 9. Third-Party Integrations

| Service | Purpose | Plan |
|---|---|---|
| **Vercel** | Hosting + CI/CD | Free tier |
| **Cal.com** | Scheduling, availability management, Google Calendar sync | Free tier (Team plan if multiple team members need separate calendars) |
| **Supabase** | Database + file storage for photos | Free tier |
| **Google OAuth** | Admin sign-in via NextAuth.js | Free |
| **Google Calendar** | Calendar invites (handled by Cal.com integration) | Free |

---

## 10. Out of Scope

- Online payments / quotes
- Customer-facing project tracking portal
- SMS notifications
- Multi-location support
