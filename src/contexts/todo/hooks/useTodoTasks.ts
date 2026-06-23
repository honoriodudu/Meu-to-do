import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteTodo, deleteTodoByReference, addTodo } from "../services/todo.service";
import type { TodoTask, TodoInput } from "../todo.types";

export function useSoftDeleteTodo(userId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = userId ? ["todos", userId] : ["todos", "anonymous"];

  const deleteMutation = useMutation({
    mutationFn: async ({ id, task }: { id: string; task: TodoTask }) => {
      if (!userId) throw new Error("Usuário não autenticado.");

      // Se temos o ID, usamos ele
      if (id && id !== "undefined" && id !== "null") {
        return deleteTodo(id);
      } 
      // Se não tem ID, tenta usar a referência do Dyad se existir
      else if ((task as any).dyad_reference) {
        return deleteTodoByReference((task as any).dyad_reference);
      } else {
        throw new Error("Tarefa sem ID ou referência válida.");
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Tarefa excluída.");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir: ${error.message}`);
    },
  });

  const softDelete = async (task: TodoTask) => {
    // Tenta encontrar o ID de várias formas possíveis
    const rawId = task.id || (task as any).id || "";
    const safeId = String(rawId).trim();

    // Se não tem ID e não tem referência, aí sim bloqueamos
    if ((!safeId || safeId === "undefined" || safeId === "null") && !(task as any).dyad_reference) {
      toast.error("Tarefa inválida", {
        description: "Esta tarefa não possui um identificador (ID ou Referência) válido.",
      });
      return;
    }

    return deleteMutation.mutateAsync({ id: safeId, task });
  };

  return { softDelete, isDeleting: deleteMutation.isPending };
}