-- consolidated SQL to update 'pedidosdo_cardapio' table with new features
-- Adds support for multi-cup structured data, human-readable summary, and change (troco) information.

-- 1. Add 'itens' column for structured JSON data of all cups
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pedidosdo_cardapio' AND column_name = 'itens') THEN
        ALTER TABLE public.pedidosdo_cardapio ADD COLUMN itens JSONB;
    END IF;
END $$;

-- 2. Add 'resumo' column for human-readable text summary
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pedidosdo_cardapio' AND column_name = 'resumo') THEN
        ALTER TABLE public.pedidosdo_cardapio ADD COLUMN resumo TEXT;
    END IF;
END $$;

-- 3. Add 'troco_para' column for change request information
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pedidosdo_cardapio' AND column_name = 'troco_para') THEN
        ALTER TABLE public.pedidosdo_cardapio ADD COLUMN troco_para NUMERIC;
    END IF;
END $$;

-- Add documentation comments
COMMENT ON COLUMN public.pedidosdo_cardapio.itens IS 'Array estruturado com os detalhes de todos os itens (copos) do pedido';
COMMENT ON COLUMN public.pedidosdo_cardapio.resumo IS 'Resumo textual legível para exibição rápida no CRM';
COMMENT ON COLUMN public.pedidosdo_cardapio.troco_para IS 'Valor informado pelo cliente para cálculo do troco';
