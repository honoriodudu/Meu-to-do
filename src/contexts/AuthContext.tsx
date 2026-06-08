import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../integrations/supabase/client'
import type { User } from '../lib/supabaseClient'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  profile: any | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        // Verificar se há usuário logado
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        
        if (currentUser) {
          setUser({
            id: currentUser.id,
            email: currentUser.email!,
            created_at: currentUser.created_at
          })
          
          // Carregar perfil do usuário
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single()
          
          setProfile(profileData)
        }
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          created_at: session.user.created_at
        })
        
        // Carregar perfil
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        setProfile(profileData)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, profile }}>
      {children}
    </AuthContext.Provider>
  )
}