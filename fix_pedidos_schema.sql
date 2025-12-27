-- Garante que a coluna cliente_nome exista
alter table public.pedidos 
add column if not exists cliente_nome text;

-- Garante que a coluna itens exista
alter table public.pedidos 
add column if not exists itens jsonb default '[]'::jsonb;

-- Garante que a coluna mesa exista
alter table public.pedidos 
add column if not exists mesa text;

-- Força uma atualização do cache do esquema (comentário apenas, o DDL acima já deve disparar)
-- notify pgrst, 'reload schema';
