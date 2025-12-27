-- Add localizacao column to pedidos table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pedidos' AND column_name = 'localizacao') THEN
        ALTER TABLE public.pedidos ADD COLUMN localizacao JSONB;
    END IF;
END $$;
