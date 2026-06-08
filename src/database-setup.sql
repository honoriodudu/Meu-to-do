-- Criação da tabela de categorias
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criação da tabela de tarefas
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criação da tabela de queries salvas
CREATE TABLE public.saved_queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  query_name TEXT NOT NULL,
  sql_query TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Atualização automática do campo updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger para atualizar updated_at na tabela categories
DROP TRIGGER IF EXISTS set_updated_at_categories ON public.categories;
CREATE TRIGGER set_updated_at_categories
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Trigger para atualizar updated_at na tabela tasks
DROP TRIGGER IF EXISTS set_updated_at_tasks ON public.tasks;
CREATE TRIGGER set_updated_at_tasks
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Trigger para atualizar updated_at na tabela saved_queries
DROP TRIGGER IF EXISTS set_updated_at_saved_queries ON public.saved_queries;
CREATE TRIGGER set_updated_at_saved_queries
  BEFORE UPDATE ON public.saved_queries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Enable Row Level Security (RLS) em todas as tabelas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_queries ENABLE ROW LEVEL SECURITY;

-- Garantias de acesso via API
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.categories TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.categories TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tasks TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tasks TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.saved_queries TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.saved_queries TO authenticated;

-- Políticas de segurança para categorias
CREATE POLICY "Categories access own data" ON public.categories
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Políticas de segurança para tarefas
CREATE POLICY "Tasks access own data" ON public.tasks
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Políticas de segurança para saved_queries
CREATE POLICY "Saved queries access own data" ON public.saved_queries
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Função para executar SQL de forma segura
CREATE OR REPLACE FUNCTION public.exec_sql(sql TEXT)
RETURNS TABLE(results JSONB)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  query_result JSONB;
BEGIN
  -- Validação básica para evitar comandos perigosos
  IF sql IS NULL THEN
    RAISE EXCEPTION 'SQL query cannot be null';
  END IF;
  
  -- Remove whitespace e converte para minúsculas
  sql := trim(upper(sql));
  
  -- Verifica se é uma consulta permitida
  IF sql NOT LIKE 'SELECT%' AND sql NOT LIKE 'INSERT%' AND sql NOT LIKE 'UPDATE%' AND sql NOT LIKE 'DELETE%' THEN
    RAISE EXCEPTION 'Only SELECT, INSERT, UPDATE, and DELETE commands are allowed';
  END IF;
  
  -- Executa a consulta e retorna resultados
  RETURN QUERY EXECUTE format('WITH results AS (%s) SELECT jsonb_agg(to_jsonb(r)) FROM results r', sql);
  
  RETURN;
END;
$$;

-- Função para criar perfil de usuário automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    now(),
    now()
  );
  
  -- Criar categorias padrão para novos usuários
  INSERT INTO public.categories (user_id, name, color, created_at)
  VALUES (
    new.id,
    'Pessoal',
    '#3B82F6',
    now()
  );
  
  INSERT INTO public.categories (user_id, name, color, created_at)
  VALUES (
    new.id,
    'Trabalho',
    '#10B981',
    now()
  );
  
  INSERT INTO public.categories (user_id, name, color, created_at)
  VALUES (
    new.id,
    'Estudos',
    '#F59E0B',
    now()
  );
  
  RETURN new;
END;
$$;

-- Trigger para criar perfil de usuário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Índices para performance
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_completed ON public.tasks(is_completed);
CREATE INDEX idx_tasks_category_id ON public.tasks(category_id);
CREATE INDEX idx_tasks_created_at ON public.tasks(created_at);

CREATE INDEX idx_categories_user_id ON public.categories(user_id);
CREATE INDEX idx_categories_name ON public.categories(name);

CREATE INDEX idx_saved_queries_user_id ON public.saved_queries(user_id);
CREATE INDEX idx_saved_queries_created_at ON public.saved_queries(created_at);