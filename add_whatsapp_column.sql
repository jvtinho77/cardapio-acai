-- Add 'whatsapp_cliente' column to 'pedidosdo_cardapio' table
-- Stores the cleaned WhatsApp number (e.g., 5511999999999)

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pedidosdo_cardapio' AND column_name = 'whatsapp_cliente') THEN 
        ALTER TABLE public.pedidosdo_cardapio ADD COLUMN whatsapp_cliente TEXT;
    END IF;
END $$;

COMMENT ON COLUMN public.pedidosdo_cardapio.whatsapp_cliente IS 'Número de WhatsApp do cliente no formato 55DD9XXXXXXXX';
