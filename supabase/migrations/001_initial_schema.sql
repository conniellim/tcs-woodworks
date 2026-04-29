-- supabase/migrations/001_initial_schema.sql

create extension if not exists "uuid-ossp";

create table service_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null default '',
  cover_image_url text,
  sort_order int not null default 0,
  visible boolean not null default true
);

create table team_members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text not null default '',
  avatar_url text
);

create table bookings (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  service_category_id uuid references service_categories(id) on delete set null,
  project_description text not null default '',
  photo_urls text[] not null default '{}',
  cal_booking_uid text,
  scheduled_at timestamptz,
  status text not null default 'new'
    check (status in ('new','confirmed','pending_review','in_progress','completed','cancelled','pending_cal')),
  assigned_team_member_id uuid references team_members(id) on delete set null,
  created_at timestamptz not null default now()
);

create table portfolio_photos (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  category_id uuid references service_categories(id) on delete set null,
  caption text,
  created_at timestamptz not null default now()
);

create table testimonials (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  customer_city text not null default '',
  quote text not null,
  star_rating int not null default 5 check (star_rating between 1 and 5),
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- Seed service categories
insert into service_categories (name, description, sort_order) values
  ('Custom Furniture & Cabinetry', 'Handcrafted built-ins, cabinets, and custom furniture pieces tailored to your space.', 1),
  ('Deck & Outdoor Structures', 'Decks, pergolas, fences, and outdoor living spaces built to last.', 2),
  ('Home Additions & Remodels', 'Room additions and full-service renovations, from design to final walkthrough.', 3),
  ('Finish Carpentry & Trim', 'Crown molding, baseboards, door casings, stair railings, and detail work.', 4),
  ('Full Construction Projects', 'New builds and large-scale construction managed start to finish.', 5),
  ('Repairs & Small Jobs', 'Quick fixes, touch-ups, and small carpentry repairs done right.', 6);
