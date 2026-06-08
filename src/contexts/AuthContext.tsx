import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { mockAuth } from '../lib/auth-utils'
import type { User } from '../lib/supabaseClient'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      // Tenta usar Supabase, se disponível
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser({
            id: user.id,
            email: user.email!,
            created_at: user.created_at
          })
        }
      } else {
        // Fallback para mock
        const currentUser = mockAuth.getCurrentUser()
        setUser(currentUser)
      }
      setLoading(false)
    }

    getUser()

    const setupAuthListener = async () => {
      if (supabase) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              created_at: session.user.created_at
            })
          } else if (event === 'SIGNED_OUT') {
            setUser(null)
          }
          setLoading(false)
        })
        return subscription.unsubscribe
      } else {
        // Mock não precisa de listener
        setLoading(false)
      }
    }

    const unsubscribe = setupAuthListener()

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    if (supabase) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
    } else {
      await mockAuth.signUp(email, password)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } else {
      await mockAuth.signIn(email, password)
    }
  }

  const signOut = async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } else {
      await mockAuth.signOut()
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}