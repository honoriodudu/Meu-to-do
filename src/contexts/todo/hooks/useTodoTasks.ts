import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addTodo,
  deleteTodo,
  fetchUserTodos,
  toggleTodoCompletion,
  todoQueryKeys,
  updateTodo,
} from "../services/todo.service";
import type { TodoChangeInput, TodoInput, TodoTask } from "../todo.types";

/** Resultado retornado pelo hook de tarefas. */
interface UseTodoTasksResult {
  /** Lista de tarefas do usuário. */
  tasks: TodoTask[];
  /** Indica se as tarefas estão carregando. */
  isLoading: boolean;
  /** Indica se alguma mutação está em andamento. */
  isSaving: boolean;
  /** Cria uma tarefa. */
  addTodo: (input: TodoInput) => Promise<TodoTask>;
  /** Edita uma tarefa existente. */
  changeTodo: (params: TodoChangeInput) => Promise<TodoTask>;
  /** Remove uma tarefa. */
  removeTodo: (id: string) => Promise<void>;
  /** Alterna o status de conclusão. */
  toggleTodoCompletion: (id: string, completed: boolean) => Promise<TodoTask>;
}

/**
 * Gerencia consultas e mutações das tarefas do usuário.
 *
 * Usa TanStack Query para manter a lista sincronizada após alterações.
 */
export function useTodoTasks(userId: string | undefined): UseTodoTasksResult {
  const queryClient = useQueryClient();
  const queryKey = todoQueryKeys.userTasks(userId ?? "anonymous");

  const { data = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchUserTodos(userId ?? ""),
    enabled: Boolean(userId),
  });

  const createMutation = useMutation({
    mutationFn: async (input: TodoInput) => {
      if (!userId) throw new Error("Usuário não autenticado.");
      return addTodo(userId, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Tarefa criada com sucesso.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível criar a tarefa.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, input }: TodoChangeInput) => {
      if (!userId) throw new Error("Usuário não autenticado.");
      return updateTodo(id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Tarefa editada com sucesso.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível editar a tarefa.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error("Usuário não autenticado.");
      return deleteTodo(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Tarefa removida com sucesso.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível remover a tarefa.");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      if (!userId) throw new Error("Usuário não autenticado.");
      return toggleTodoCompletion(userId, id, completed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível atualizar a tarefa.");
    },
  });

  return {
    tasks: data,
    isLoading,
    isSaving:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      toggleMutation.isPending,
    addTodo: createMutation.mutateAsync,
    changeTodo: updateMutation.mutateAsync,
    removeTodo: deleteMutation.mutateAsync,
    toggleTodoCompletion: toggleMutation.mutateAsync,
  };
}