-- Configuração inicial do banco de dados para Meu To Do

-- Habilita RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_queries ENABLE ROW LEVEL SECURITY;

-- Cria função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Cria trigger para atualizar updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.categories;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.tasks;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.saved_queries;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.saved_queries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Cria função para lidar com novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insere perfil do usuário
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  
  -- Cria categorias padrão para novos usuários
  INSERT INTO public.categories (user_id, name, color)
  VALUES (
    new.id,
    'Pessoal',
    '#3B82F6'
  );
  
  INSERT INTO public.categories (user_id, name, color)
  VALUES (
    new.id,
    'Trabalho',
    '#10B981'
  );
  
  INSERT INTO public.categories (user_id, name, color)
  VALUES (
    new.id,
    'Estudos',
    '#F59E0B'
  );
  
  RETURN new;
END;
$$;

-- Cria trigger para novos usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Concede permissões
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.categories TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tasks TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.saved_queries TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.saved_queries TO authenticated;

-- Habilita RLS nas tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_queries ENABLE ROW LEVEL SECURITY;

-- Cria políticas de segurança para profiles
CREATE POLICY "Users can view their profile" ON public.profiles
FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their profile" ON public.profiles
FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Cria políticas de segurança para categories
CREATE POLICY "Users can view their categories" ON public.categories
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their categories" ON public.categories
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their categories" ON public.categories
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their categories" ON public.categories
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Cria políticas de segurança para tasks
CREATE POLICY "Users can view their tasks" ON public.tasks
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their tasks" ON public.tasks
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their tasks" ON public.tasks
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their tasks" ON public.tasks
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Cria políticas de segurança para saved_queries
CREATE POLICY "Users can view their saved queries" ON public.saved_queries
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their saved queries" ON public.saved_queries
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their saved queries" ON public.saved_queries
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their saved queries" ON public.saved_queries
FOR DELETE TO authenticated USING (auth.uid() = user_id);