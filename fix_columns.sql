-- FIX MISSING COLUMNS SCRIPT
-- Run this to fix the "Could not find the 'mesa' column" error.

ALTER TABLE public.pedidosdo_cardapio ADD COLUMN IF NOT EXISTS mesa text;
ALTER TABLE public.pedidosdo_cardapio ADD COLUMN IF NOT EXISTS cliente_nome text;
ALTER TABLE public.pedidosdo_cardapio ADD COLUMN IF NOT EXISTS total numeric;
ALTER TABLE public.pedidosdo_cardapio ADD COLUMN IF NOT EXISTS status text DEFAULT 'pendente';

-- Ensure JSON columns exist too
ALTER TABLE public.pedidosdo_cardapio ADD COLUMN IF NOT EXISTS tamanho jsonb;
ALTER TABLE public.pedidosdo_cardapio ADD COLUMN IF NOT EXISTS base jsonb;
ALTER TABLE public.pedidosdo_cardapio ADD COLUMN IF NOT EXISTS complementos jsonb;
ALTER TABLE public.pedidosdo_cardapio ADD COLUMN IF NOT EXISTS localizacao jsonb;

-- Grant permissions just in case
GRANT ALL ON public.pedidosdo_cardapio TO anon;
GRANT ALL ON public.pedidosdo_cardapio TO authenticated;
