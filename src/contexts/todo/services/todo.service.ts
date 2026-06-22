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
  // Garantia de que o id não seja undefined ou vazio
  if (!id) {
    throw new Error("ID da tarefa não informado.");
  }
  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

/** Alterna o status de conclusão de uma tarefa pertencente ao usuário atual. */
export async function toggleTodoCompletion(
  userId: string,
  id: string,
  completed: boolean,
): Promise<TodoTask> {
  // Primeiro verifica se a tarefa existe e pertence ao usuário
  const { data: existingTask, error: fetchError } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (!existingTask) {
    throw new Error("Tarefa não encontrada.");
  }

  // Agora atualiza o status
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