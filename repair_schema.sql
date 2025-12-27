-- REPAIR SCRIPT: Fix missing columns and tables

-- 1. Create 'mesas_disponiveis' if it doesn't exist (Used for QR Code status)
create table if not exists public.mesas_disponiveis (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique, -- e.g. "M01"
  status text default 'disponivel' check (status in ('disponivel', 'ocupada'))
);

-- Enable RLS for mesas
alter table public.mesas_disponiveis enable row level security;
create policy "Public view mesas" on public.mesas_disponiveis for select to anon using (true);
create policy "Public update mesas" on public.mesas_disponiveis for update to anon using (true);


-- 2. Ensure 'Pedidos' table has all required core columns (Base fields expected by App)
DO $$
BEGIN
    -- Check and add 'cliente_nome'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Pedidos' AND column_name = 'cliente_nome') THEN
        ALTER TABLE public."Pedidos" ADD COLUMN cliente_nome text;
    END IF;

    -- Check and add 'mesa'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Pedidos' AND column_name = 'mesa') THEN
        ALTER TABLE public."Pedidos" ADD COLUMN mesa text;
    END IF;

    -- Check and add 'total'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Pedidos' AND column_name = 'total') THEN
        ALTER TABLE public."Pedidos" ADD COLUMN total numeric default 0;
    END IF;

    -- Check and add 'status'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Pedidos' AND column_name = 'status') THEN
        ALTER TABLE public."Pedidos" ADD COLUMN status text default 'pendente';
    END IF;
    
    -- Check and add 'itens' (Summary text for CRM)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Pedidos' AND column_name = 'itens') THEN
        ALTER TABLE public."Pedidos" ADD COLUMN itens JSONB;
    END IF;

END $$;
