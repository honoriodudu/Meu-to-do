import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MadeWithDyad } from '@/components/made-with-dyad'

const Home = () => {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Meu To Do</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Bem-vindo, {user?.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Bem-vindo ao seu To Do!</h2>
            <p className="text-muted-foreground">
              Organize suas tarefas diárias e aumente sua produtividade.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📝 Minhas Tarefas
                </CardTitle>
                <CardDescription>
                  Gerencie suas tarefas diárias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Adicione, edite e organize suas tarefas de forma simples e intuitiva.
                </p>
                <Button variant="outline" className="w-full">
                  Ver Tarefas
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📊 Estatísticas
                </CardTitle>
                <CardDescription>
                  Acompanhe seu progresso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Veja gráficos e estatísticas sobre suas tarefas concluídas.
                </p>
                <Button variant="outline" className="w-full">
                  Ver Estatísticas
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚙️ Configurações
                </CardTitle>
                <CardDescription>
                  Personalize sua experiência
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Configure preferências e temas para melhorar sua experiência.
                </p>
                <Button variant="outline" className="w-full">
                  Configurar
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Próximos Passos</CardTitle>
                <CardDescription>
                  Comece a organizar sua vida hoje mesmo!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Adicione sua primeira tarefa</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Organize suas tarefas por categorias</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Defina prazos e lembretes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  )
}

export default Home