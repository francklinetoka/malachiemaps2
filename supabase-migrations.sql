-- Run this in Supabase SQL Editor (Project -> SQL Editor -> New query)
-- Creates tables used by the app and bucket for images.

-- Extension for UUID and crypto (already present in Supabase)
create extension if not exists "pgcrypto";

-- Profiles table (linked to auth.users via id, but here we keep simple)
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid, -- optional: link to supabase auth user id
  first_name text not null,
  last_name text not null,
  email text unique not null,
  phone text,
  country text,
  role text not null default 'CONTENT_ADMIN', -- SUPERADMIN | CONTENT_ADMIN | USER
  is_approved boolean not null default false,
  is_blocked boolean not null default false,
  created_at timestamptz default timezone('utc'::text, now())
);

-- Churches table
create table if not exists churches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  photos text[] default array[]::text[],
  country text not null,
  city text not null,
  province text,
  neighborhood text,
  address_reference text not null,
  description text not null,
  phone1 text,
  phone2 text,
  email text,
  socials jsonb,
  lat double precision,
  lng double precision,
  is_visible boolean default true,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default timezone('utc'::text, now()),
  updated_at timestamptz default timezone('utc'::text, now())
);

-- Announcements table (for ticker and notifications)
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text,
  content text,
  language text default 'fr',
  starts_at timestamptz default timezone('utc'::text, now()),
  ends_at timestamptz,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default timezone('utc'::text, now())
);

-- Create a storage bucket for church photos (you can also create from Supabase UI)
-- NOTE: If using SQL, Supabase Storage operations are usually done from UI; this is informative.
-- To create bucket: go to Storage > Create a new bucket -> name: church-photos (public)

-- Seed SuperAdmin (change password in UI/Use service_role to create auth user if desired)
insert into profiles (first_name, last_name, email, country, role, is_approved)
values ('Super','Admin','superadmin@localhost','République du Congo','SUPERADMIN', true)
on conflict (email) do nothing;