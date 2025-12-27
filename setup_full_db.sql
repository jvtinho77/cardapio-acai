-- SETUP FULL DB (Corrects all missing tables/columns)
-- RUN THIS TO FIX EVERYTHING

-- 1. Create 'mesas_disponiveis' (Fixes "Could not find table" error)
create table if not exists public.mesas_disponiveis (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  status text default 'disponivel' check (status in ('disponivel', 'ocupada'))
);
alter table public.mesas_disponiveis enable row level security;
create policy "Public view mesas" on public.mesas_disponiveis for select to anon using (true);
create policy "Public update mesas" on public.mesas_disponiveis for update to anon using (true);

-- 2. Create 'pedidosdo_cardapio' (Fixes "Could not find column" error)
create table if not exists public.pedidosdo_cardapio (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  cliente_nome text default 'Cliente App',
  mesa text,
  total numeric not null,
  status text default 'pendente',
  tamanho jsonb,
  base jsonb,
  complementos jsonb,
  localizacao jsonb,
  user_id uuid references auth.users(id)
);
alter table public.pedidosdo_cardapio enable row level security;
create policy "Public insert pedidos" on public.pedidosdo_cardapio for insert to anon with check (true);
create policy "Public select pedidos" on public.pedidosdo_cardapio for select to anon using (true);

-- 3. Ensure columns exist if table was already created empty
alter table public.pedidosdo_cardapio add column if not exists tamanho jsonb;
alter table public.pedidosdo_cardapio add column if not exists base jsonb;
alter table public.pedidosdo_cardapio add column if not exists localizacao jsonb;
alter table public.pedidosdo_cardapio add column if not exists complementos jsonb;
