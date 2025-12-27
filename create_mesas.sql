-- Create the 'mesas_disponiveis' table which is missing
-- Run this if you see errors like "Could not find the table public.mesas_disponiveis"

create table if not exists public.mesas_disponiveis (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique, -- Ex: "M01", "M02", "Balcao"
  status text default 'disponivel' check (status in ('disponivel', 'ocupada'))
);

-- Enable security
alter table public.mesas_disponiveis enable row level security;
create policy "Public view mesas" on public.mesas_disponiveis for select to anon using (true);
create policy "Public update mesas" on public.mesas_disponiveis for update to anon using (true);

-- Optional: Insert some default tables
insert into public.mesas_disponiveis (codigo) values ('M01'), ('M02'), ('M03') on conflict do nothing;
