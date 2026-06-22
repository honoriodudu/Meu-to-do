import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteTodo, addTodo } from "../services/todo.service";
import type { TodoTask, TodoInput } from "../todo.types";

export function useSoftDeleteTodo(userId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = userId ? ["todos", userId] : ["todos", "anonymous"];

  const deleteMutation = useMutation({
    // 1. A mutação agora recebe um objeto com o ID e a Tarefa completa
    mutationFn: async ({ id }: { id: string; task: TodoTask }) => {
      if (!userId) throw new Error("Usuário não autenticado.");
      return deleteTodo(id);
    },
    // 2. Acessamos a tarefa através do parâmetro `variables`
    onSuccess: (_, variables) => {
      // Invalida a lista para recarregar
      queryClient.invalidateQueries({ queryKey });

      // Exibe toast com opção de desfazer
      toast.success("Tarefa excluída.", {
        description: "Você pode desfazer a ação.",
        action: {
          label: "Desfazer",
          onClick: () => {
            // Recupera a tarefa diretamente das variáveis enviadas para a mutação
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
    // 3. Enviamos o objeto completo, sem necessidade de @ts-ignore
    await deleteMutation.mutateAsync({ id: task.id, task });
  };

  return { softDelete, isDeleting: deleteMutation.isPending };
}