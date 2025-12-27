-- Create dedicated table for Açaí Builder orders
-- Exact schema requested by user

create table if not exists public.pedidosdo_cardapio (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone null default now(),
  cliente_nome text null default 'Cliente App'::text,
  mesa text null,
  tamanho jsonb null,
  base jsonb null,
  complementos jsonb null,
  localizacao jsonb null,
  total numeric not null,
  status text null default 'pendente'::text,
  user_id uuid null,
  constraint pedidosdo_cardapio_pkey primary key (id),
  constraint pedidosdo_cardapio_user_id_fkey foreign KEY (user_id) references auth.users (id),
  constraint pedidosdo_cardapio_status_check check (
    (
      status = any (
        array[
          'pendente'::text,
          'preparando'::text,
          'pronto'::text,
          'entregue'::text,
          'cancelado'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

-- Enable RLS
alter table public.pedidosdo_cardapio enable row level security;

-- Allow public insert (Anon)
create policy "Public insert pedidosdo_cardapio"
on public.pedidosdo_cardapio for insert
to anon
with check (true);

create policy "Public select pedidosdo_cardapio"
on public.pedidosdo_cardapio for select
to anon
using (true);
