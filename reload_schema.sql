-- Força o Supabase/PostgREST a atualizar o cache do esquema do banco de dados
NOTIFY pgrst, 'reload schema';
