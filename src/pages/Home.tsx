import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MadeWithDyad } from '@/components/made-with-dyad'
import { ListTodo, Plus, Trash2, CircleDashed, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/integrations/supabase/client'
import { cn } from '@/lib/utils'

type Task = {
  id: string
  title: string
  description?: string | null
  is_completed: boolean
  created_at: string
}

/**
 * Página principal da aplicação.
 *
 * - Cria, lista, atualiza e remove tarefas.
 * - Permite mudar o status da tarefa entre "Pendente" e "Realizada".
 * - Inclui botão de logout que encerra a sessão via Supabase.
 */
const Home = () => {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const completedCount = useMemo(
    () => tasks.filter((task) => task.is_completed).length,
    [tasks]
  )

  /** Carrega as tarefas do usuário autenticado */
  const loadTasks = async () => {
    if (!user?.id) return

    setLoading(true)

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Não foi possível carregar suas tarefas.')
      setLoading(false)
      return
    }

    setTasks(data ?? [])
    setLoading(false)
  }

  React.useEffect(() => {
    loadTasks()
  }, [user?.id])

  /** Cria nova tarefa */
  const handleCreateTask = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!user?.id || !title.trim()) return

    const { error } = await supabase.from('todos').insert([
      {
        title: title.trim(),
        description: description.trim() || null,
        user_id: user.id
      }
    ])

    if (error) {
      toast.error('Não foi possível criar a tarefa.')
      return
    }

    setTitle('')
    setDescription('')
    toast.success('Tarefa criada com sucesso!')
    await loadTasks()
  }

  /** Alterna o status concluído da tarefa */
  const handleToggleTask = async (task: Task) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed: !task.is_completed })
      .eq('id', task.id)

    if (error) {
      toast.error('Não foi possível atualizar a tarefa.')
      return
    }

    setTasks((current) =>
      current.map((t) =>
        t.id === task.id ? { ...t, is_completed: !t.is_completed } : t
      )
    )
  }

  /** Atualiza o status via seletor (Pendente / Realizada) */
  const handleStatusChange = async (task: Task, status: 'pendente' | 'realizada') => {
    const completed = status === 'realizada'
    const { error } = await supabase
      .from('todos')
      .update({ completed })
      .eq('id', task.id)

    if (error) {
      toast.error('Erro ao atualizar o status da tarefa.')
      return
    }

    setTasks((current) =>
      current.map((t) => (t.id === task.id ? { ...t, is_completed: completed } : t))
    )
  }

  /** Remove tarefa */
  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', taskId)

    if (error) {
      toast.error('Não foi possível excluir a tarefa.')
      return
    }

    setTasks((current) => current.filter((t) => t.id !== taskId))
    toast.success('Tarefa removida.')
  }

  /** Faz logout e redireciona para a página de login */
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate('/login', { replace: true })
      toast.success('Você foi deslogado com sucesso!')
    } catch (error) {
      toast.error('Erro ao sair: ' + (error.message || 'Tente novamente'))
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <CardTitle>Carregando...</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Aguarde enquanto suas tarefas são carregadas.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header com botão de logout */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Meu To Do</h1>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          {/* Formulário de criação de tarefa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nova tarefa
              </CardTitle>
              <CardDescription>Cadastre uma nova tarefa para aparecer na sua lista.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Comprar café"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detalhes opcionais"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Adicionar tarefa
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista de tarefas */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ListTodo className="h-5 w-5" />
                    Minhas tarefas
                  </CardTitle>
                  <CardDescription>
                    {completedCount} de {tasks.length} tarefas concluídas
                  </CardDescription>
                </div>

                <Badge variant={tasks.length > 0 ? 'secondary' : 'outline'}>
                  {tasks.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <CircleDashed className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">Nenhuma tarefa cadastrada ainda.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 rounded-lg border p-4"
                    >
                      {/* Checkbox para marcar como concluída */}
                      <Checkbox
                        checked={task.is_completed}
                        onCheckedChange={() => handleToggleTask(task)}
                        className="mt-1"
                      />

                      {/* Conteúdo da tarefa */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            'font-medium',
                            task.is_completed && 'line-through text-muted-foreground'
                          )}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Seletor de status */}
                      <Select
                        value={task.is_completed ? 'realizada' : 'pendente'}
                        onValueChange={(value) => handleStatusChange(task, value as 'pendente' | 'realizada')}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="realizada">Realizada</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Botão de exclusão */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  )
}

export default Home