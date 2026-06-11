import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
... rest of file unchanged ...
＜/dyad-write>

But we need to show only the changed parts? The instruction says "Only edit files that are related to the user's request". So we need to provide the corrected file content. Since it's a large file, we can provide the entire file with modifications. But better to provide only the parts that need change, but must be a complete file. However the guidelines say to use ＜dyad-write> for creating or updating files. We need to supply the entire file content with modifications. That's a lot. Maybe we can provide just the import line and the two CardHeader usages, but that would not be a full file. The system expects a full file content. In previous examples, they gave full file content with modifications.

Thus we need to output the entire Home.tsx file with the corrected import and usage.

Let's reconstruct the file content with modifications.

Original Home.tsx content (from context) is:

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, CheckCircle2, CircleDashed } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
type Task = { id: string; title: string; description?: string | null; is_completed: boolean; created_at: string; };
const Home = () => {
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const completedCount = useMemo(() => tasks.filter(t => t.is_completed).length, [tasks]);
  const loadTasks = async () => {
    if (!user?.id) return setLoading(true);
    const { data, error } = await supabase .from('todos') .select('*') .eq('user_id', user.id) .order('created_at', { ascending: false });
    if (error) { toast.error('Não foi possível carregar suas tarefas.'); setLoading(false); return; }
    setTasks(data ?? []); setLoading(false);
  };
  React.useEffect(() => { loadTasks(); }, [user?.id]);
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !title.trim()) return;
    const { error } = await supabase.from('todos').insert([ { title: title.trim(), description: description.trim() || null, user_id: user.id, }, ]); if (error) { toast.error('Não foi possível criar a tarefa.'); return; } setTitle(''); setDescription(''); toast.success('Tarefa criada com sucesso!'); await loadTasks(); };
  const handleToggleTask = async (task: Task) => {
    const { error } = await supabase.from('todos').update({ is_completed: !task.is_completed }).eq('id', task.id); if (error) { toast.error('Não foi possível atualizar a tarefa.'); return; } setTasks(prev => prev.map(t => t.id === task.id ? { ...t, is_completed: !t.is_completed } : t)); };
  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', taskId); if (error) { toast.error('Não foi possível excluir a tarefa.'); return; } setTasks(prev => prev.filter(t => t.id !== taskId)); toast.success('Tarefa removida.'); };
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
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Meu To Do</h1>
          <Button variant="outline" onClick={() => {}}> Sair </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          {/* New Task Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"> <Plus className="h-5 w-5" /> Nova tarefa </CardTitle>
              <CardDescription>Cadastre uma nova tarefa para aparecer na sua lista.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Comprar café" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalhes opcionais" />
                </div>
                <Button type="submit" className="w-full"> Adicionar tarefa </Button>
              </form>
            </CardContent>
          </Card>
          {/* Tasks List Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2"> <ListTodo className="h-5 w-5" /> Minhas tarefas </CardTitle>
                  <CardDescription> {completedCount} de {tasks.length} tarefas concluídas </CardDescription>
                </div>
                <Badge variant={tasks.length > 0 ? 'secondary' : 'outline'}> {tasks.length} </Badge>
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
                    <div key={task.id} className="flex items-start gap-3 rounded-lg border p-4">
                      <Checkbox checked={task.is_completed} onCheckedChange={() => handleToggleTask(task)} className="mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className={cn('font-medium', task.is_completed && 'line-through text-muted-foreground')}> {task.title} </p>
                        {task.description && ( <p className="text-sm text-muted-foreground mt-1"> {task.description} </p> )}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}> <Trash2 className="h-4 w-4" /> </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};
export default Home;

Now we need to modify import line to include CardDescription, and also ensure CardHeader includes CardDescription in new task card (already present) and tasks list card (already present). Wait, in the new task card, they already have CardDescription. In tasks list card, they also have CardDescription. So maybe the error occurs because CardDescription is not imported. So we need to add import.

Thus we need to change import line:

From:
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

To:
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

Also ensure that CardHeader usage includes CardDescription where needed. In new task card, they already have CardDescription. In tasks list card, they also have CardDescription. So no further changes needed.

Thus we need to output the entire file with the corrected import line.

Let's rewrite the file with the corrected import line.

We'll copy the entire file content, but replace the import line.

Let's produce the corrected file.
</think><dyad-write path="src/pages/Home.tsx" description="Corrigindo import de CardDescription e garantindo uso nos CardHeader">
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, CheckCircle2, CircleDashed } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
type Task = { id: string; title: string; description?: string | null; is_completed: boolean; created_at: string; };
const Home = () => {
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const completedCount = useMemo(() => tasks.filter(t => t.is_completed).length, [tasks]);
  const loadTasks = async () => {
    if (!user?.id) return setLoading(true);
    const { data, error } = await supabase .from('todos') .select('*') .eq('user_id', user.id) .order('created_at', { ascending: false });
    if (error) { toast.error('Não foi possível carregar suas tarefas.'); setLoading(false); return; }
    setTasks(data ?? []); setLoading(false);
  };
  React.useEffect(() => { loadTasks(); }, [user?.id]);
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !title.trim()) return;
    const { error } = await supabase.from('todos').insert([ { title: title.trim(), description: description.trim() || null, user_id: user.id, }, ]); if (error) { toast.error('Não foi possível criar a tarefa.'); return; } setTitle(''); setDescription(''); toast.success('Tarefa criada com sucesso!'); await loadTasks(); };
  const handleToggleTask = async (task: Task) => {
    const { error } = await supabase.from('todos').update({ is_completed: !task.is_completed }).eq('id', task.id); if (error) { toast.error('Não foi possível atualizar a tarefa.'); return; } setTasks(prev => prev.map(t => t.id === task.id ? { ...t, is_completed: !t.is_completed } : t)); };
  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', taskId); if (error) { toast.error('Não foi possível excluir a tarefa.'); return; } setTasks(prev => prev.filter(t => t.id !== taskId)); toast.success('Tarefa removida.'); };
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
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Meu To Do</h1>
          <Button variant="outline" onClick={() => {}}> Sair </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          {/* New Task Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"> <Plus className="h-5 w-5" /> Nova tarefa </CardTitle>
              <CardDescription>Cadastre uma nova tarefa para aparecer na sua lista.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Comprar café" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalhes opcionais" />
                </div>
                <Button type="submit" className="w-full"> Adicionar tarefa </Button>
              </form>
            </CardContent>
          </Card>
          {/* Tasks List Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2"> <ListTodo className="h-5 w-5" /> Minhas tarefas </CardTitle>
                  <CardDescription> {completedCount} de {tasks.length} tarefas concluídas </CardDescription>
                </div>
                <Badge variant={tasks.length > 0 ? 'secondary' : 'outline'}> {tasks.length} </Badge>
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
                    <div key={task.id} className="flex items-start gap-3 rounded-lg border p-4">
                      <Checkbox checked={task.is_completed} onCheckedChange={() => handleToggleTask(task)} className="mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className={cn('font-medium', task.is_completed && 'line-through text-muted-foreground')}> {task.title} </p>
                        {task.description && ( <p className="text-sm text-muted-foreground mt-1"> {task.description} </p> )}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}> <Trash2 className="h-4 w-4" /> </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};
export default Home;