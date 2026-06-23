import { useQuery } from "@tanstack/react-query";
import { fetchUserTodos, todoQueryKeys } from "../services/todo.service";
import type { TodoTask } from "../todo.types";

export function useTodoTasks(userId: string | undefined) {
  return useQuery({
    queryKey: userId ? todoQueryKeys.userTasks(userId) : todoQueryKeys.all,
    queryFn: () => (userId ? fetchUserTodos(userId) : Promise.resolve([])),
    enabled: !!userId,
  });
}