-- Adicionar política para permitir atualização de status da mesa
create policy "Qualquer um pode atualizar status da mesa"
on public.mesas_disponiveis for update
to anon
using (true)
with check (true);
