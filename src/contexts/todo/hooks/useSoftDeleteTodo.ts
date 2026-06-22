import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteTodo, addTodo } from "../services/todo.service";
import type { TodoTask, TodoInput } from "../todo.types";

/**
 * Hook que realiza a exclusão “soft” de uma tarefa.
 *
 * - Exibe um toast de confirmação com botão “Desfazer”.
 * - Se o usuário clicar em desfazer, a tarefa é recriada com os mesmos dados.
 */
export function useSoftDeleteTodo(userId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = userId ? ["todos", userId] : ["todos", "anonymous"];

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error("Usuário não autenticado.");
      return deleteTodo(id);
    },
    onSuccess: (_, deletedId, context) => {
      // Invalida a lista para recarregar
      queryClient.invalidateQueries({ queryKey });

      // Exibe toast com opção de desfazer
      toast.success("Tarefa excluída.", {
        description: "Você pode desfazer a ação.",
        action: {
          label: "Desfazer",
          onClick: () => {
            // Recria a tarefa usando os dados armazenados no contexto
            if (context?.task) {
              const { title, description, completed, start_date, due_date } = context.task;
              const input: TodoInput = {
                title,
                description: description ?? "",
                completed,
                start_datetime: start_date ?? undefined,
                due_datetime: due_date ?? undefined,
              };
              // Usa a mutação de criação para restaurar a tarefa
              addTodo(userId, input)
                .then(() => {
                  toast.success("Tarefa restaurada.");
                  queryClient.invalidateQueries({ queryKey });
                })
                .catch((e) => {
                  toast.error(`Falha ao restaurar: ${e.message}`);
                });
            }
          },
        },
        // Mantém o toast por tempo suficiente para o usuário decidir
        duration: 8000,
      });
    },
    onError: (error) => {
      toast.error(`Erro ao excluir tarefa: ${error.message}`);
    },
  });

  /**
   * Executa a exclusão armazenando temporariamente os dados da tarefa
   * para possibilitar o desfazer.
   */
  const softDelete = async (task: TodoTask) => {
    // Passa a tarefa completa como “context” para a mutação
    await deleteMutation.mutateAsync(task.id, {
      // @ts-ignore – o TanStack Query aceita `context` opcional
      context: { task },
    });
  };

  return { softDelete, isDeleting: deleteMutation.isPending };
}