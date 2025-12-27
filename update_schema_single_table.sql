-- 1. Adicionar a coluna de itens na tabela de pedidos
-- Usamos JSONB para guardar a estrutura dos itens (nome, qtd, preco)
alter table public.pedidos 
add column if not exists itens jsonb default '[]'::jsonb;

-- 2. Remover a tabela antiga de itens (Opcional, se quiser limpar)
-- drop table if exists public.itens_pedido;

-- Se decidir manter a tabela antiga por enquanto, tudo bem. 
-- O código vai passar a usar apenas a coluna 'itens' na tabela 'pedidos'.
