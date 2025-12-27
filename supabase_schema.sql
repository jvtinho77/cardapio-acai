-- Drop table logic specifically for recreating with new schema (CAUTION: Deletes existing data)
drop table if exists public.itens_pedido;
drop table if exists public.pedidos;

-- Criação da tabela de pedidos
create table public.pedidos (
  -- ID agora é texto e pega apenas os 8 primeiros caracteres do UUID gerado
  id text primary key default substring(gen_random_uuid()::text from 1 for 8),
  created_at timestamp with time zone default now(),
  cliente_nome text,
  mesa text,
  total numeric not null,
  status text default 'pendente' check (status in ('pendente', 'preparando', 'pronto', 'entregue', 'cancelado'))
);

-- Criação da tabela de itens do pedido
create table public.itens_pedido (
  id uuid primary key default gen_random_uuid(),
  -- fk agora referencia o id tipo texto
  pedido_id text references public.pedidos(id) on delete cascade,
  item_nome text not null,
  quantidade integer not null,
  preco numeric not null
);

-- Habilitar RLS (Row Level Security)
alter table public.pedidos enable row level security;
alter table public.itens_pedido enable row level security;

-- Políticas
create policy "Qualquer um pode criar pedidos"
on public.pedidos for insert
to anon
with check (true);

create policy "Qualquer um pode criar itens de pedido"
on public.itens_pedido for insert
to anon
with check (true);

create policy "Visualizar pedidos publicos"
on public.pedidos for select
to anon
using (true);
