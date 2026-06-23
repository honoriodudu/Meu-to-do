import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteTodo, deleteTodoByReference, addTodo } from "../services/todo.service";
import type { TodoTask, TodoInput } from "../todo.types";

export function useSoftDeleteTodo(userId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = userId ? ["todos", userId] : ["todos", "anonymous"];

  const deleteMutation = useMutation({
    mutationFn: async ({ id, task }: { id?: string; task: TodoTask }) => {
      if (!userId) throw new Error("Usuário não autenticado.");
      if (id) {
        return deleteTodo(id);
      } else if ((task as any).dyad_reference) {
        return deleteTodoByReference((task as any).dyad_reference);
      } else {
        throw new Error("ID da tarefa e referência não informados.");
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Tarefa excluída.", {
        description: "Você pode desfazer a ação.",
        action: {
          label: "Desfazer",
          onClick: () => {
            const { title, description, completed, start_date, due_date } = variables.task;
            const input: TodoInput = {
              title,
              description: description ?? "",
              completed,
              start_datetime: start_date ?? undefined,
              due_datetime: due_date ?? undefined,
            };
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
      }, 8000);
    },
    onError: (error) => {
      toast.error(`Erro ao excluir tarefa: ${error.message}`);
    },
  });

  const softDelete = (task: TodoTask) => {
    // 2. Barreira de proteção: se não tem ID válido, não tenta mutar (evita tela vermelha)
    if (!task.id || typeof task.id !== "string" || task.id.trim() === "") {
      toast.error("Tarefa inválida", {
        description: "Esta tarefa não possui um ID válido no sistema e não pode ser excluída. Verifique se a tarefa foi criada corretamente.",
      });
      return Promise.reject(new Error("ID da tarefa inválido"));
    }

    // 3. Usa mutateAsync para retornar uma promise que pode ser aguardada
    return deleteMutation.mutateAsync({ id: task.id, task });
  };

  return { softDelete, isDeleting: deleteMutation.isPending };
}