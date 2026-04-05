-- Create drugs table for pharmacy inventory
create table if not exists public.drugs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  quantity integer not null default 0,
  price numeric(10, 2) not null default 0,
  qr_code text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.drugs enable row level security;

-- Create RLS policies
create policy "Users can view their own drugs" on public.drugs
  for select using (auth.uid() = user_id);

create policy "Users can insert their own drugs" on public.drugs
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own drugs" on public.drugs
  for update using (auth.uid() = user_id);

create policy "Users can delete their own drugs" on public.drugs
  for delete using (auth.uid() = user_id);

-- Create index on user_id for faster queries
create index if not exists idx_drugs_user_id on public.drugs(user_id);
