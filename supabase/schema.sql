create extension if not exists pgcrypto;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pixel-generations',
  'pixel-generations',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  prompt text not null,
  image_path text not null,
  image_url text not null,
  model text not null,
  width integer not null default 512,
  height integer not null default 512,
  created_at timestamptz not null default now()
);

alter table public.generations enable row level security;

drop policy if exists "Public can view generations" on public.generations;
create policy "Public can view generations"
on public.generations
for select
using (true);

drop policy if exists "Public can read pixel generation images" on storage.objects;
create policy "Public can read pixel generation images"
on storage.objects
for select
using (bucket_id = 'pixel-generations');

create index if not exists generations_created_at_idx
on public.generations (created_at desc);
