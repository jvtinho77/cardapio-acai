-- Add 'itens' and 'resumo' columns to 'pedidosdo_cardapio' table
-- 'itens' will store a structured JSON array of all cups in the order
-- 'resumo' will store a human-readable string summary of the order details

-- 1. Add 'itens' column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pedidosdo_cardapio' AND column_name = 'itens') THEN
        ALTER TABLE public.pedidosdo_cardapio ADD COLUMN itens JSONB;
    END IF;
END $$;

-- 2. Add 'resumo' column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pedidosdo_cardapio' AND column_name = 'resumo') THEN
        ALTER TABLE public.pedidosdo_cardapio ADD COLUMN resumo TEXT;
    END IF;
END $$;

-- 3. Optional: Add comment for documentation
COMMENT ON COLUMN public.pedidosdo_cardapio.itens IS 'Array estruturado com os detalhes de todos os itens (copos) do pedido';
COMMENT ON COLUMN public.pedidosdo_cardapio.resumo IS 'Resumo textual legível para exibição rápida no CRM';
