"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, Trash2, Undo } from "lucide-react";
import { useDeletedTodoTasks } from "@/contexts/todo/hooks/useDeletedTodoTasks";
import { useNavigate } from "react-router-dom";

const Trash = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { deletedTasks, isLoading, restore, hardDelete } = useDeletedTodoTasks(user?.id);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-destructive">É necessário estar autenticado para acessar a lixeira.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Lixeira</h1>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Atualizar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <p className="text-muted-foreground">Carregando tarefas excluídas...</p>
        ) : deletedTasks.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle className="text-xl">Lixeira vazia</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Não há tarefas na lixeira. Quando excluir uma tarefa uma tarefa, ela aparecerá aqui.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {deletedTasks.map((task) => (
              <Card key={task.id}>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className={task.completed ? "line-through text-muted-foreground" : ""}>
                      {task.title}
                    </CardTitle>
                    <CardDescription>{task.description}</CardDescription>
                  </div>
                  <Badge variant="destructive" className="mt-2 sm:mt-0">
                    Excluída em {new Date(task.deleted_at!).toLocaleDateString()}
                  </Badge>
                </CardHeader>
                <CardContent className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => restore(task.id)}
                    disabled={task.deleted_at === null}
                  >
                    <Undo className="h-4 w-4 mr-1" />
                    Restaurar
                  </Button>
                  <Button variant="destructive" onClick={() => hardDelete(task.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir permanentemente
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Trash;