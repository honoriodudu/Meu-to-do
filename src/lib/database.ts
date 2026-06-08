import { supabase } from '../integrations/supabase/client';

// Funções para categorias
export const getCategories = async (userId: string) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const createCategory = async (category: {
  name: string;
  color: string;
  userId: string;
}) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([{
      name: category.name,
      color: category.color,
      user_id: category.userId
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateCategory = async (id: string, updates: {
  name?: string;
  color?: string;
}) => {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteCategory = async (id: string) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Funções para tarefas
export const getTasks = async (userId: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      categories (id, name, color)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createTask = async (task: {
  title: string;
  description?: string;
  category_id?: string;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  userId: string;
}) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([{
      title: task.title,
      description: task.description,
      category_id: task.category_id,
      priority: task.priority || 'medium',
      due_date: task.due_date,
      user_id: task.userId
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateTask = async (id: string, updates: {
  title?: string;
  description?: string;
  category_id?: string;
  is_completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
}) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteTask = async (id: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const toggleTaskCompletion = async (id: string, isCompleted: boolean) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ is_completed: isCompleted })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};