import { supabase } from "@/integrations/supabase/client";
import type { TodoChangeInput, TodoInput, TodoTask } from "../todo.types";

/** Busca todas as tarefas do usuário autenticado. */
export async function fetchUserTodos(userId: string): Promise<TodoTask[]> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
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

/** Remove uma tarefa do banco. */
export async function deleteTodo(id: string): Promise<void> {
  // Garantir que o ID seja um valor válido antes de enviá‑lo ao Supabase
  if (!id) {
    throw new Error("ID da tarefa não pode ser undefined ou vazio.");
  }

  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) throw new Error(error.message);
}