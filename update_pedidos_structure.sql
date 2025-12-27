-- Update 'Pedidos' table to match the new Açaí Builder structure
-- User requested to "exclude old columns" but we must preserve core fields for CRM (id, status, total, mesa, cliente_nome)

DO $$
BEGIN
    -- 1. Add new structured data columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Pedidos' AND column_name = 'tamanho') THEN
        ALTER TABLE public."Pedidos" ADD COLUMN tamanho JSONB;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Pedidos' AND column_name = 'base') THEN
        ALTER TABLE public."Pedidos" ADD COLUMN base JSONB;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Pedidos' AND column_name = 'complementos') THEN
        ALTER TABLE public."Pedidos" ADD COLUMN complementos JSONB;
    END IF;

    -- Localizacao might have been added in previous step, but ensuring it's here
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Pedidos' AND column_name = 'localizacao') THEN
        ALTER TABLE public."Pedidos" ADD COLUMN localizacao JSONB;
    END IF;

    -- 2. Optional: cleanup old columns if they exist and are no longer needed
    -- We keep 'itens' / 'itens_pedido' logic if you want backward compatibility, 
    -- but usually we can ignore them or drop them if you are sure.
    -- ALTER TABLE public."Pedidos" DROP COLUMN IF EXISTS descricao; -- Example
    
END $$;
