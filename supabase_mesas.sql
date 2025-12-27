-- Tabela de mesas
create table public.mesas_disponiveis (
    id text primary key default substring(gen_random_uuid()::text from 1 for 8),
    codigo text not null, -- Ex: '001', '002'
    status text default 'disponivel', -- disponivel, ocupada
    link text, -- Link gerado automaticamente
    created_at timestamp with time zone default now()
);

-- Habilitar RLS
alter table public.mesas_disponiveis enable row level security;

-- Políticas de segurança
create policy "Qualquer um pode ver mesas"
on public.mesas_disponiveis for select
to anon
using (true);

create policy "Anonimos podem criar mesas (para teste)"
on public.mesas_disponiveis for insert
to anon
with check (true);

-- Função para gerar o link automaticamente
create or replace function public.gerar_link_mesa()
returns trigger as $$
begin
    -- Substitua 'http://localhost:8080' pelo seu domínio de produção se necessário
    -- O link será: SEU_SITE/ID_DA_MESA
    NEW.link := 'http://localhost:8080/' || NEW.id;
    return NEW;
end;
$$ language plpgsql;

-- Trigger que chama a função antes de criar a mesa
create trigger trigger_gerar_link_mesa
before insert on public.mesas_disponiveis
for each row
execute function public.gerar_link_mesa();
