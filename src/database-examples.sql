-- Exemplos de consultas para testar no SQL Editor

-- 1. Listar todas as categorias do usuário
SELECT id, name, color, created_at 
FROM categories 
WHERE user_id = auth.uid()
ORDER BY created_at;

-- 2. Listar todas as tarefas com categorias
SELECT 
  t.id,
  t.title,
  t.description,
  t.is_completed,
  t.priority,
  t.due_date,
  c.name as category_name,
  c.color as category_color
FROM tasks t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.user_id = auth.uid()
ORDER BY t.created_at DESC;

-- 3. Criar uma nova tarefa
INSERT INTO tasks (
  title, 
  description, 
  category_id, 
  priority, 
  user_id,
  due_date
) VALUES (
  'Estudar React', 
  'Completar o curso de React avançado', 
  (SELECT id FROM categories WHERE name = 'Estudos' AND user_id = auth.uid()), 
  'high', 
  auth.uid(),
  CURRENT_DATE + INTERVAL '7 days'
);

-- 4. Atualizar uma tarefa como concluída
UPDATE tasks 
SET is_completed = true, 
    updated_at = NOW()
WHERE id = 'uuid-da-tarefa' AND user_id = auth.uid();

-- 5. Estatísticas básicas
SELECT 
  COUNT(*) as total_tasks,
  COUNT(CASE WHEN is_completed = true THEN 1 END) as completed_tasks,
  COUNT(CASE WHEN is_completed = false THEN 1 END) as pending_tasks,
  COUNT(DISTINCT category_id) as total_categories
FROM tasks 
WHERE user_id = auth.uid();

-- 6. Tarefas com prioridade alta e não concluídas
SELECT 
  t.title,
  t.priority,
  t.due_date,
  c.name as category_name
FROM tasks t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.user_id = auth.uid()
  AND t.is_completed = false
  AND t.priority = 'high'
ORDER BY t.due_date ASC NULLS LAST;

-- 7. Criar uma nova categoria
INSERT INTO categories (name, color, user_id)
VALUES ('Projetos', '#8B5CF6', auth.uid());

-- 8. Tarefas agrupadas por categoria
SELECT 
  c.name as category_name,
  c.color as category_color,
  COUNT(t.id) as task_count,
  COUNT(CASE WHEN t.is_completed = true THEN 1 END) as completed_count
FROM categories c
LEFT JOIN tasks t ON c.id = t.category_id AND t.user_id = auth.uid()
WHERE c.user_id = auth.uid()
GROUP BY c.id, c.name, c.color
ORDER BY c.name;

-- 9. Buscar tarefas por data de vencimento
SELECT 
  t.title,
  t.due_date,
  c.name as category_name,
  CASE 
    WHEN t.due_date < CURRENT_DATE AND t.is_completed = false THEN 'Atrasada'
    WHEN t.due_date = CURRENT_DATE AND t.is_completed = false THEN 'Hoje'
    WHEN t.due_date = CURRENT_DATE + INTERVAL '1 day' AND t.is_completed = false THEN 'Amanhã'
    ELSE 'Futura'
  END as status
FROM tasks t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.user_id = auth.uid()
  AND t.due_date IS NOT NULL
  ORDER BY t.due_date ASC;

-- 10. Excluir uma tarefa
DELETE FROM tasks 
WHERE id = 'uuid-da-tarefa' AND user_id = auth.uid();

-- 11. Atualizar categoria de tarefas
UPDATE tasks 
SET category_id = (SELECT id FROM categories WHERE name = 'Trabalho' AND user_id = auth.uid())
WHERE category_id = (SELECT id FROM categories WHERE name = 'Pessoal' AND user_id = auth.uid())
AND user_id = auth.uid();