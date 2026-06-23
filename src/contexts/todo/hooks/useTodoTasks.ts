import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addTodo,
  deleteTodo,
  fetchUserTodos,
  restoreTodo,
  forceDeleteTodo,
  toggleTodoCompletion,
  todoQueryKeys,
  updateTodo,
} from "../services/todo.service";
import type { TodoChangeInput, TodoInput, TodoTask } from "../todo.types";

/** Resultado retornado pelo hook de tarefas. */
interface UseTodoTasksResult {
  /** Lista de tarefas do usuário. */
  tasks: TodoTask[];
  /** Lista de tarefas excluídas (lixeira). */
  deletedTasks: TodoTask[];
  /** Indica se as tarefas estão carregando. */
  isLoading: boolean;
  /** Indica se as tarefas excluídas estão carregando. */
  isLoadingDeleted: boolean;
  /** Indica se alguma mutação está em andamento. */
  isSaving: boolean;
  /** Cria uma tarefa. */
  addTodo: (input: TodoInput) => Promise<TodoTask>;
  /** Edita uma tarefa existente. */
  changeTodo: (params: TodoChangeInput) => Promise<TodoTask>;
  /** Move uma tarefa para a lixeira. */
  removeTodo: (id: string) => Promise<void>;
  /** Restaura uma tarefa da lixeira. */
  restoreTodo: (id: string) => Promise<TodoTask>;
  /** Exclui permanentemente uma tarefa. */
  forceDeleteTodo: (id: string) => Promise<void>;
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
  const deletedQueryKey = [...queryKey, "deleted"];

  const { data = [], isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchUserTodos(userId ?? ""),
    enabled: Boolean(userId),
  });

  const { data: deletedData = [], isLoading: isLoadingDeleted } = useQuery({
    queryKey: deletedQueryKey,
    queryFn: () => 
      supabase
        .from("todos")
        .select("*")
        .eq("user_id", userId ?? "")
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false }),
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
      queryClient.invalidateQueries({ queryKey: deletedQueryKey });
      toast.success("Tarefa movida para a lixeira.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível mover a tarefa para a lixeira.");
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error("Usuário não autenticado.");
      return restoreTodo(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: deletedQueryKey });
      toast.success("Tarefa restaurada com sucesso.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível restaurar a tarefa.");
    },
  });

  const forceDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error("Usuário não autenticado.");
      return forceDeleteTodo(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deletedQueryKey });
      toast.success("Tarefa excluída permanentemente.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Não foi possível excluir a tarefa permanentemente.");
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
    deletedTasks: deletedData,
    isLoading,
    isLoadingDeleted,
    isSaving:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      restoreMutation.isPending ||
      forceDeleteMutation.isPending ||
      toggleMutation.isPending,
    addTodo: createMutation.mutateAsync,
    changeTodo: updateMutation.mutateAsync,
    removeTodo: deleteMutation.mutateAsync,
    restoreTodo: restoreMutation.mutateAsync,
    forceDeleteTodo: forceDeleteMutation.mutateAsync,
    toggleTodoCompletion: (id: string, completed: boolean) =>
      toggleMutation.mutateAsync({ id, completed }),
  };
}