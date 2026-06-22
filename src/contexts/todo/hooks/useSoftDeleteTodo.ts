import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteTodo, addTodo } from "../services/todo.service";
import type { TodoTask, TodoInput } from "../todo.types";

/**
 * Hook que realiza a exclusão “soft” de uma tarefa.
 *
 * - Exibe um toast de confirmação com botão “Desfazer”.
 * - Se o usuário clicar em desfazer, a tarefa é recriada com os mesmos dados.
 * - Garante que o `id` passado ao serviço não seja `undefined`.
 */
export function useSoftDeleteTodo(userId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = userId ? ["todos", userId] : ["todos", "anonymous"];

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!id) throw new Error("ID da tarefa não informado.");
      return deleteTodo(id);
    },
    onSuccess: (_, deletedId, context) => {
      // Invalida a lista para recarregar
      queryClient.invalidateQueries({ queryKey });

      // O objeto `context` foi passado como segundo argumento em `mutateAsync`
      // e contém a tarefa que foi excluída.
      const taskToRestore = context?.task as TodoTask | undefined;

      // Exibe toast com opção de desfazer
      toast.success("Tarefa excluída.", {
        description: "Você pode desfazer a ação.",
        action: {
          label: "Desfazer",
          onClick: () => {
            if (taskToRestore && taskToRestore.id) {
              const { title, description, completed, start_date, due_date } = taskToRestore;
              const input: TodoInput = {
                title,
                description: description ?? "",
                completed,
                start_datetime: start_date ?? undefined,
                due_datetime: due_date ?? undefined,
              };
              // Recria a tarefa usando a mutação de criação
              addTodo(userId!, input)
                .then(() => {
                  toast.success("Tarefa restaurada.");
                  queryClient.invalidateQueries({ queryKey });
                })
                .catch((e) => {
                  toast.error(`Falha ao restaurar: ${e.message}`);
                });
            } else {
              toast.error("Não foi possível restaurar a tarefa.");
            }
          },
        },
        // Mantém o toast aberto o suficiente para o usuário decidir
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
    // Garante que a tarefa tenha um ID válido antes de prosseguir
    if (!task.id) {
      toast.error("ID da tarefa não informado.");
      return;
    }

    // Passa a tarefa completa como “context” para a mutação
    await deleteMutation.mutateAsync(task.id, {
      // @ts-ignore – o TanStack Query aceita `context` opcional
      context: { task },
    });
  };

  return { softDelete, isDeleting: deleteMutation.isPending };
}