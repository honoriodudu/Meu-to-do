import type { User } from '@supabase/supabase-js'

// Simulação de autenticação com localStorage
export const mockAuth = {
  // Simular usuário
  currentUser: null as User | null,
  
  // Simular login
  async signIn(email: string, password: string): Promise<User> {
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (email === 'test@example.com' && password === 'password') {
      const user: User = {
        id: '1',
        email,
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
      } as User
      this.currentUser = user
      localStorage.setItem('user', JSON.stringify(user))
      return user
    }
    
    throw new Error('Credenciais inválidas')
  },
  
  // Simular signup
  async signUp(email: string, password: string): Promise<User> {
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      created_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
    } as User
    this.currentUser = user
    localStorage.setItem('user', JSON.stringify(user))
    return user
  },
  
  // Simular logout
  async signOut(): Promise<void> {
    this.currentUser = null
    localStorage.removeItem('user')
  },
  
  // Verificar usuário atual
  getCurrentUser(): User | null {
    const stored = localStorage.getItem('user')
    if (stored) {
      return JSON.parse(stored)
    }
    return null
  }
}