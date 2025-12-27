-- FORCE FIX SCRIPT
-- Run this to ensure all tables and columns exist regardless of previous state.

-- 1. Create 'mesas_disponiveis' if missing
CREATE TABLE IF NOT EXISTS public.mesas_disponiveis (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  status text default 'disponivel' check (status in ('disponivel', 'ocupada'))
);

-- Enable RLS for mesas
ALTER TABLE public.mesas_disponiveis ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view mesas" ON public.mesas_disponiveis;
CREATE POLICY "Public view mesas" ON public.mesas_disponiveis FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "Public update mesas" ON public.mesas_disponiveis;
CREATE POLICY "Public update mesas" ON public.mesas_disponiveis FOR UPDATE TO anon USING (true);


-- 2. Add columns to 'Pedidos' (Case Sensitive Name -> "Pedidos")
-- We use IF NOT EXISTS to avoid errors if they already exist.

ALTER TABLE public."Pedidos" ADD COLUMN IF NOT EXISTS cliente_nome text;
ALTER TABLE public."Pedidos" ADD COLUMN IF NOT EXISTS mesa text;
ALTER TABLE public."Pedidos" ADD COLUMN IF NOT EXISTS total numeric default 0;
ALTER TABLE public."Pedidos" ADD COLUMN IF NOT EXISTS status text default 'pendente';
ALTER TABLE public."Pedidos" ADD COLUMN IF NOT EXISTS itens JSONB;

ALTER TABLE public."Pedidos" ADD COLUMN IF NOT EXISTS tamanho JSONB;
ALTER TABLE public."Pedidos" ADD COLUMN IF NOT EXISTS base JSONB;
ALTER TABLE public."Pedidos" ADD COLUMN IF NOT EXISTS complementos JSONB;
ALTER TABLE public."Pedidos" ADD COLUMN IF NOT EXISTS localizacao JSONB;

-- 3. Grants (Just in case)
GRANT ALL ON public."Pedidos" TO anon;
GRANT ALL ON public."Pedidos" TO authenticated;
GRANT ALL ON public.mesas_disponiveis TO anon;
GRANT ALL ON public.mesas_disponiveis TO authenticated;
