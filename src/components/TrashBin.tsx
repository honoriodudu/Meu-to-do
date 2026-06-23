import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock3, Trash2 } from "lucide-react";
import type { TodoTask } from "@/contexts/todo/todo.types";

interface TrashBinProps {
  /** Lista de tarefas excluídas. */
  deletedTasks: TodoTask[];
  /** Indica se as tarefas excluídas estão carregando. */
  isLoading: boolean;
  /** Callback chamado ao restaurar uma tarefa. */
  onRestore: (id: string) => Promise<void>;
  /** Callback chamado ao excluir permanentemente uma tarefa. */
  onForceDelete: (id: string) => Promise<void>;
  /** Controla a abertura do diálogo. */
  open: boolean;
  /** Callback chamado quando a abertura do diálogo muda. */
  onOpenChange: (open: boolean) => void;
}

/**
 * Diálogo para gerenciar tarefas excluídas (lixeira).
 *
 * Permite restaurar ou excluir permanentemente tarefas da lixeira.
 */
export function TrashBin({
  deletedTasks,
  isLoading,
  onRestore,
  onForceDelete,
  open,
  onOpenChange,
}: TrashBinProps) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<string | null>(null);

  const handleRestore = async (id: string) => {
    try {
      await onRestore(id);
    } catch (error) {
      console.error("Error restoring task:", error);
    }
  };

  const handleForceDelete = async (id: string) => {
    try {
      await onForceDelete(id);
    } catch (error) {
      console.error("Error force deleting task:", error);
    }
  };

  const confirmForceDelete = (id: string) => {
    setConfirmDeleteOpen(id);
  };

  const cancelForceDelete = () => {
    setConfirmDeleteOpen(null);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        aria-hidden={!open}
        hidden={!open}
      >
        <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Lixeira</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              aria-label="Fechar lixeira"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando lixeira...</p>
            </div>
          ) : deletedTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">A lixeira está vazia.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deletedTasks.map((task) => (
                <div key={task.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={false}
                      disabled
                      className="mt-1 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <p className="font-medium line-through text-muted-foreground">
                          {task.title}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          Movido para lixeira em {new Date(
                            task.deleted_at || ""
                          ).toLocaleDateString()}
                        </span>
                      </div>

                      {task.description && (
                        <p className="mt-1 text-sm text-muted-foreground line-through">
                          {task.description}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">
                        {task.start_date && (
                          <span className="text-xs text-muted-foreground">
                            Início: {new Date(task.start_date).toLocaleString()}
                          </span>
                        )}
                        {task.due_date && (
                          <span className="text-xs text-muted-foreground">
                            Prazo: {new Date(task.due_date).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(task.id)}
                    >
                      Restaurar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => confirmForceDelete(task.id)}
                    >
                      Excluir para sempre
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Fechar
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation dialog for permanent deletion */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-destructive mb-4">
              Confirmar Exclusão Permanente
            </h3>
            <p className="mb-4 text-muted-foreground">
              Tem certeza que deseja excluir permanentemente a tarefa "{deletedTasks.find(
                (t) => t.id === confirmDeleteOpen
              )?.title}"? Esta ação não pode ser desfeita.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={cancelForceDelete}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleForceDelete(confirmDeleteOpen ?? "");
                  setConfirmDeleteOpen(null);
                }}
                className="flex-1"
              >
                Excluir Permanentemente
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}