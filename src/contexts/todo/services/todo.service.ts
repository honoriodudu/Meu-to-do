import { supabase } from "@/integrations/supabase/client";
import type { TodoChangeInput, TodoInput, TodoTask } from "../todo.types";
import { toDatabaseDueDate, toDatabaseStartDate } from "../todo.utils";

export const todoQueryKeys = {
  all: ["todos"] as const,
  userTasks: (userId: string) => [...todoQueryKeys.all, userId] as const,
  deleted: (userId: string) => [...todoQueryKeys.all, "deleted", userId] as const,
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

/** Fetch active tasks */
export async function fetchUserTodos(userId: string): Promise<TodoTask[]> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null) // <-- CORREÇÃO APLICADA AQUI
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Fetch tasks that are in the trash (soft‑deleted) */
export async function fetchDeletedTodos(userId: string): Promise<TodoTask[]> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
    .not("deleted_at", "is", null) // only rows with a deleted_at timestamp
    .order("deleted_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Create a new task */
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

/** Update an existing task */
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

/** Soft‑delete a task (moves it to the trash) */
export async function deleteTodo(id: string): Promise<void> {
  const { error } = await supabase.rpc("soft_delete_todo", { p_id: id });
  if (error) throw new Error(error.message);
}

/** Restore a task from the trash */
export async function restoreTodo(id: string): Promise<void> {
  const { error } = await supabase.rpc("restore_todo", { p_id: id });
  if (error) throw new Error(error.message);
}

/** Permanently delete a task (hard delete) */
export async function hardDeleteTodo(id: string): Promise<void> {
  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Toggle completion status */
export async function toggleTodoCompletion(
  userId: string,
  id: string,
  completed: boolean,
): Promise<TodoTask> {
  // Verify ownership first
  const { data: existingTask, error: fetchError } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);
  if (!existingTask) throw new Error("Tarefa não encontrada.");

  const { data, error } = await supabase
    .from("todos")
    .update({ completed })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Não foi possível atualizar a tarefa.");

  return data;
}