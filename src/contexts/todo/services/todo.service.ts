import { supabase } from "@/integrations/supabase/client";
import type { TodoInput, TodoTask } from "../todo.types";
import { toDatabaseDueDate } from "../todo.utils";

export const todoQueryKeys = {
  all: ["todos"] as const,
  userTasks: (userId: string) => [...todoQueryKeys.all, userId] as const,
};

type TodoInsertPayload = {
  title: string;
  description: string | null;
  completed: boolean;
  due_date: string | null;
  user_id: string;
};

type TodoUpdatePayload = {
  title: string;
  description: string | null;
  completed: boolean;
  due_date: string | null;
};

export async function fetchUserTodos(userId: string): Promise<TodoTask[]> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data ?? [];
}

export async function addTodo(userId: string, input: TodoInput): Promise<TodoTask> {
  const payload: TodoInsertPayload = {
    title: input.title,
    description: input.description || null,
    completed: input.completed,
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

export async function updateTodo(id: string, input: TodoInput): Promise<TodoTask> {
  const payload: TodoUpdatePayload = {
    title: input.title,
    description: input.description || null,
    completed: input.completed,
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

export async function deleteTodo(id: string): Promise<void> {
  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

export async function toggleTodoCompletion(id: string, completed: boolean): Promise<TodoTask> {
  const { data, error } = await supabase
    .from("todos")
    .update({ completed })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Tarefa não encontrada.");

  return data;
}