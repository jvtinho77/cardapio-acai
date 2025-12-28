-- Add 'troco_para' column to 'pedidosdo_cardapio' table
-- This column will store the amount the customer will pay with, to calculate change.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pedidosdo_cardapio' AND column_name = 'troco_para') THEN
        ALTER TABLE public.pedidosdo_cardapio ADD COLUMN troco_para NUMERIC;
    END IF;
END $$;

COMMENT ON COLUMN public.pedidosdo_cardapio.troco_para IS 'Valor informado pelo cliente para cálculo do troco';
