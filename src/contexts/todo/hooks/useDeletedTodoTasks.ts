import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchDeletedTodos,
  hardDeleteTodo,
  restoreTodo,
  todoQueryKeys,
} from "../services/todo.service";
import type { TodoTask } from "../todo.types";

/** Result of the trash hook */
interface UseDeletedTodoResult {
  /** List of deleted tasks */
  deletedTasks: TodoTask[];
  /** Loading state */
  isLoading: boolean;
  /** Restores a task */
  restore: (id: string) => Promise<void>;
  /** Permanently removes a task */
  hardDelete: (id: string) => Promise<void>;
}

/**
 * Hook that fetches tasks that are in the trash and provides
 * restore / permanent‑delete actions.
 */
export function useDeletedTodoTasks(userId: string | undefined): UseDeletedTodoResult {
  const queryClient = useQueryClient();
  const queryKey = todoQueryKeys.deleted(userId ?? "anonymous");

  const { data = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchDeletedTodos(userId ?? ""),
    enabled: Boolean(userId),
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error("Usuário não autenticado.");
      await restoreTodo(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: todoQueryKeys.userTasks(userId ?? "") });
      toast.success("Tarefa restaurada com sucesso.");
    },
    onError: (err: Error) => toast.error(err.message || "Erro ao restaurar a tarefa."),
  });

  const hardDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error("Usuário não autenticado.");
      await hardDeleteTodo(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Tarefa excluída permanentemente.");
    },
    onError: (err: Error) => toast.error(err.message || "Erro ao excluir a tarefa."),
  });

  return {
    deletedTasks: data,
    isLoading,
    restore: (id: string) => restoreMutation.mutateAsync(id),
    hardDelete: (id: string) => hardDeleteMutation.mutateAsync(id),
  };
}