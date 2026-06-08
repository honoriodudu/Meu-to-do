import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Plus, Table, Save } from "lucide-react"

interface SQLTemplatesProps {
  onTemplateSelect: (template: string) => void
}

export function SQLTemplates({ onTemplateSelect }: SQLTemplatesProps) {
  const templates = [
    {
      id: 'createTask',
      name: 'Criar Nova Tarefa',
      description: 'Insere uma nova tarefa no banco de dados',
      icon: Plus,
      template: `INSERT INTO tasks (title, description, category_id, priority, user_id, due_date)
VALUES ('Nova Tarefa', 'Descrição da tarefa', 'uuid-da-categoria', 'medium', auth.uid(), NOW());`
    },
    {
      id: 'getTasks',
      name: 'Listar Tarefas',
      description: 'Recupera todas as tarefas do usuário atual',
      icon: Table,
      template: `SELECT t.*, c.name as category_name, c.color as category_color
FROM tasks t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.user_id = auth.uid()
ORDER BY t.created_at DESC;`
    },
    {
      id: 'updateTask',
      name: 'Atualizar Tarefa',
      description: 'Atualiza uma tarefa existente',
      icon: Save,
      template: `UPDATE tasks 
SET title = 'Tarefa Atualizada', is_completed = true
WHERE id = 'uuid-da-tarefa' AND user_id = auth.uid();`
    },
    {
      id: 'createCategory',
      name: 'Criar Categoria',
      description: 'Cria uma nova categoria de tarefas',
      icon: Plus,
      template: `INSERT INTO categories (name, color, user_id)
VALUES ('Trabalho', '#3B82F6', auth.uid());`
    },
    {
      id: 'getStats',
      name: 'Estatísticas',
      description: 'Obtém estatísticas das tarefas do usuário',
      icon: Database,
      template: `SELECT 
  COUNT(*) as total_tasks,
  COUNT(CASE WHEN is_completed = true THEN 1 END) as completed_tasks,
  COUNT(CASE WHEN is_completed = false THEN 1 END) as pending_tasks,
  COUNT(DISTINCT category_id) as total_categories
FROM tasks 
WHERE user_id = auth.uid();`
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Modelos SQL
        </CardTitle>
        <CardDescription>
          Modelos pré-definidos para operações comuns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {templates.map((template) => {
          const Icon = template.icon
          return (
            <Button
              key={template.id}
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => onTemplateSelect(template.template)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {template.name}
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}