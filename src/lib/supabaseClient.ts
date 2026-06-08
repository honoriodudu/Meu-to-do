import { createClient } from '@supabase/supabase-js'

// Tenta usar variáveis de ambiente, se disponíveis
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseInstance: any = null

if (supabaseUrl && supabaseAnonKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = supabaseInstance

export type User = {
  id: string
  email: string
  created_at: string
}