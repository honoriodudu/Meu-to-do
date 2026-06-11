"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ListTodo, Plus } from "lucide-react";
import { TodoFormDialog } from "@/contexts/todo/components/TodoFormDialog";
import { TodoList } from "@/contexts/todo/components/TodoList";
import { useTodoTasks } from "@/contexts/todo/hooks/useTodoTasks";
import type { TodoTask } from "@/contexts/todo/todo.types";

const Home = () => {
  const { user, loading: authLoading } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TodoTask | undefined>();

  const {
    tasks,
    isLoading,
    addTodo,
    changeTodo,
    removeTodo,
    toggleTodoCompletion,
  } = useTodoTasks(user?.id);

  const completedCount = tasks.filter((task) => task.completed).length;

  const openCreateDialog = () => {
    setEditingTask(undefined);
    setDialogOpen(true);
  };

  const openEditDialog = (task: TodoTask) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  if (authLoading || isLoading) {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <CardTitle>Acesso necessário</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Você precisa estar autenticado para acessar suas tarefas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Meu To Do</h1>
            <p className="text-sm text-muted-foreground">
              Organize suas tarefas com data e horário.
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova tarefa
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListTodo className="h-5 w-5" />
                Resumo
              </CardTitle>
              <CardDescription>
                {completedCount} de {tasks.length} tarefas concluídas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="secondary" className="text-sm">
                {tasks.length} tarefas no total
              </Badge>
              <p className="text-sm text-muted-foreground">
                Use o botão editar em cada tarefa para alterar título, descrição, status, data e horário.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Minhas tarefas</CardTitle>
                  <CardDescription>Edite ou conclua suas tarefas a qualquer momento.</CardDescription>
                </div>
                <Badge variant="outline">{tasks.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <TodoList
                tasks={tasks}
                isLoading={isLoading}
                onToggle={toggleTodoCompletion}
                onEdit={openEditDialog}
                onDelete={removeTodo}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <TodoFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingTask={editingTask}
        userId={user.id}
        onSuccess={() => setEditingTask(undefined)}
      />

      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

export default Home;