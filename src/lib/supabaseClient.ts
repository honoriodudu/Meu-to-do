import { User } from '@supabase/supabase-js'

export type SupabaseUser = User
export type Profile = {
  id: string
  username?: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export type Category = {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

export type Task = {
  id: string
  user_id: string
  category_id?: string
  title: string
  description?: string
  is_completed: boolean
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  created_at: string
  updated_at: string
  categories?: Category
}