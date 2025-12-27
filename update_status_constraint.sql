-- Atualizar a restrição de status para incluir 'pedido'
-- Primeiro, removemos a restrição antiga
alter table public.pedidos 
drop constraint if exists pedidos_status_check;

-- Adicionamos a nova restrição com 'pedido'
alter table public.pedidos 
add constraint pedidos_status_check 
check (status in ('pedido', 'pendente', 'preparando', 'pronto', 'entregue', 'cancelado'));

-- Opcional: Atualizar pedidos existentes 'pendente' para 'pedido' se desejar
-- update public.pedidos set status = 'pedido' where status = 'pendente';
