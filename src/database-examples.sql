-- Exemplos de consultas SQL para o Meu To Do

-- Exemplo 1: Listar todas as tarefas do usuário
SELECT 
  t.id,
  t.title,
  t.description,
  t.is_completed,
  t.priority,
  t.due_date,
  c.name as category_name,
  c.color as category_color,
  t.created_at,
  t.updated_at
FROM tasks t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.user_id = auth.uid()
ORDER BY t.created_at DESC;

-- Exemplo 2: Listar categorias do usuário
SELECT 
  c.id,
  c.name,
  c.color,
  COUNT(t.id) as task_count,
  c.created_at,
  c.updated_at
FROM categories c
LEFT JOIN tasks t ON c.id = t.category_id AND t.user_id = auth.uid()
WHERE c.user_id = auth.uid()
GROUP BY c.id, c.name, c.color, c.created_at, c.updated_at
ORDER BY c.name;

-- Exemplo 3: Criar nova tarefa
INSERT INTO tasks (
  title,
  description,
  category_id,
  priority,
  user_id,
  due_date
) VALUES (
  'Nova Tarefa',
  'Descrição da nova tarefa',
  'uuid-da-categoria',
  'medium',
  auth.uid(),
  NOW()
);

-- Exemplo 4: Marcar tarefa como concluída
UPDATE tasks
SET is_completed = true
WHERE id = 'uuid-da-tarefa' AND user_id = auth.uid();

-- Exemplo 5: Criar nova categoria
INSERT INTO categories (
  name,
  color,
  user_id
) VALUES (
  'Saúde',
  '#EF4444',
  auth.uid()
);

-- Exemplo 6: Estatísticas do usuário
SELECT 
  COUNT(*) as total_tasks,
  COUNT(CASE WHEN is_completed = true THEN 1 END) as completed_tasks,
  COUNT(CASE WHEN is_completed = false THEN 1 END) as pending_tasks,
  COUNT(DISTINCT category_id) as total_categories
FROM tasks 
WHERE user_id = auth.uid();

-- Exemplo 7: Tarefas com vencer nos próximos 7 dias
SELECT 
  t.id,
  t.title,
  t.description,
  t.due_date,
  c.name as category_name,
  c.color as category_color
FROM tasks t
LEFT JOIN categories c ON t.category_id = c.id
WHERE 
  t.user_id = auth.uid()
  AND t.due_date IS NOT NULL
  AND t.due_date <= NOW() + INTERVAL '7 days'
  AND t.is_completed = false
ORDER BY t.due_date ASC;

-- Exemplo 8: Tarefas por prioridade
SELECT 
  priority,
  COUNT(*) as count,
  COUNT(CASE WHEN is_completed = true THEN 1 END) as completed,
  COUNT(CASE WHEN is_completed = false THEN 1 END) as pending
FROM tasks
WHERE user_id = auth.uid()
GROUP BY priority
ORDER BY 
  CASE priority
    WHEN 'high' THEN 1
    WHEN 'medium' THEN 2
    WHEN 'low' THEN 3
  END;

-- Exemplo 9: Atualizar tarefa
UPDATE tasks 
SET 
  title = 'Título Atualizado',
  description = 'Descrição atualizada',
  category_id = 'nova-categoria-id',
  priority = 'high'
WHERE id = 'uuid-da-tarefa' AND user_id = auth.uid();

-- Exemplo 10: Deletar tarefa
DELETE FROM tasks
WHERE id = 'uuid-da-tarefa' AND user_id = auth.uid();