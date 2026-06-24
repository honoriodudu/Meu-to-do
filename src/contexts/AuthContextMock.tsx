import { mockAuth } from '../lib/auth-utils'
import type { User } from '@supabase/supabase-js'
import React, { createContext, useContext, useState, useEffect } from 'react'

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
    // Verificar se já tem usuário salvo
    const currentUser = mockAuth.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const signUp = async (email: string, password: string) => {
    const newUser = await mockAuth.signUp(email, password)
    setUser(newUser)
  }

  const signIn = async (email: string, password: string) => {
    const loggedInUser = await mockAuth.signIn(email, password)
    setUser(loggedInUser)
  }

  const signOut = async () => {
    await mockAuth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}