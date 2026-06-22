import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteTodo, deleteTodoByReference, addTodo } from "../services/todo.service";
import type { TodoTask, TodoInput } from "../todo.types";

export function useSoftDeleteTodo(userId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = userId ? ["todos", userId] : ["todos", "anonymous"];

  const deleteMutation = useMutation({
    // Accept either an id or a dyad_reference inside the task object
    mutationFn: async ({ id, task }: { id?: string; task: TodoTask }) => {
      if (!userId) throw new Error("Usuário não autenticado.");

      if (id) {
        // Normal deletion by primary key
        return deleteTodo(id);
      } else if ((task as any).dyad_reference) {
        // Alternative deletion by custom reference column
        return deleteTodoByReference((task as any).dyad_reference);
      } else {
        throw new Error("ID da tarefa e referência não informados.");
      }
    },
    onSuccess: (_, variables) => {
      // Invalida a lista para recarregar
      queryClient.invalidateQueries({ queryKey });

      // Exibe toast com opção de desfazer
      toast.success("Tarefa excluída.", {
        description: "Você pode desfazer a ação.",
        action: {
          label: "Desfazer",
          onClick: () => {
            // Recupera os dados da tarefa a partir das variáveis enviadas
            const { title, description, completed, start_date, due_date } = variables.task;

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
          },
        },
        duration: 8000,
      });
    },
    onError: (error) => {
      toast.error(`Erro ao excluir tarefa: ${error.message}`);
    },
  });

  const softDelete = async (task: TodoTask) => {
    // Passa o objeto completo; o mutationFn decide como excluir
    await deleteMutation.mutateAsync({ task });
  };

  return { softDelete, isDeleting: deleteMutation.isPending };
}