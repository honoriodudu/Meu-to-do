import { supabase } from "@/integrations/supabase/client";
import type { TodoChangeInput, TodoInput, TodoTask } from "../todo.types";
import { toDatabaseDueDate, toDatabaseStartDate } from "../todo.utils";

export const todoQueryKeys = {
  all: ["todos"] as const,
  userTasks: (userId: string) => [...todoQueryKeys.all, userId] as const,
};

type TodoInsertPayload = {
  title: string;
  description: string | null;
  completed: boolean;
  start_date: string | null;
  due_date: string | null;
  user_id: string;
};

type TodoUpdatePayload = {
  title: string;
  description: string | null;
  completed: boolean;
  start_date: string | null;
  due_date: string | null;
};

/** Busca todas as tarefas do usuário autenticado. */
export async function fetchUserTodos(userId: string): Promise<TodoTask[]> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null) // Only show non-deleted tasks
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data ?? [];
}

/** Cria uma nova tarefa com data de início e prazo final. */
export async function addTodo(userId: string, input: TodoInput): Promise<TodoTask> {
  const payload: TodoInsertPayload = {
    title: input.title,
    description: input.description || null,
    completed: input.completed,
    start_date: toDatabaseStartDate(input.start_datetime),
    due_date: toDatabaseDueDate(input.due_datetime),
    user_id: userId,
  };

  const { data, error } = await supabase
    .from("todos")
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Não foi possível criar a tarefa.");

  return data;
}

/** Atualiza uma tarefa existente preservando data de início e prazo final. */
export async function updateTodo(id: string, input: TodoInput): Promise<TodoTask> {
  const payload: TodoUpdatePayload = {
    title: input.title,
    description: input.description || null,
    completed: input.completed,
    start_date: toDatabaseStartDate(input.start_datetime),
    due_date: toDatabaseDueDate(input.due_datetime),
  };

  const { data, error } = await supabase
    .from("todos")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Não foi possível editar a tarefa.");

  return data;
}

/** Move uma tarefa para a lixeira (soft delete). */
export async function deleteTodo(id: string): Promise<void> {
  const { error } = await supabase.rpc("soft_delete_todo", { p_id: id });
  if (error) throw new Error(error.message);
}

/** Restaura uma tarefa da lixeira. */
export async function restoreTodo(id: string): Promise<TodoTask> {
  const { error } = await supabase.rpc("restore_todo", { p_id: id });
  if (error) throw new Error(error.message);
  
  // Buscar a tarefa restaurada
  const { data, error: fetchError } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);
  return data;
}

/** Exclui permanentemente uma tarefa. */
export async function forceDeleteTodo(id: string): Promise<void> {
  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) throw new Error(error.message);
}