// ARQUIVO: src/contexts/todo/hooks/useTodoTasks.ts
import { useQuery } from "@tanstack/react-query";
import { fetchUserTodos, todoQueryKeys } from "../services/todo.service";

export function useTodoTasks(userId: string | undefined) {
  return useQuery({
    queryKey: userId ? todoQueryKeys.userTasks(userId) : todoQueryKeys.all,
    queryFn: () => (userId ? fetchUserTodos(userId) : Promise.resolve([])),
    enabled: !!userId,
  });
}
