create table if not exists public.colors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  hex text not null,
  image_key text,
  upvotes integer default 0,
  downvotes integer default 0,
  created_at timestamptz default now()
);

alter table public.colors enable row level security;

create policy "Workshop demo access"
  on public.colors
  for all
  to anon, authenticated
  using (true)
  with check (true);
