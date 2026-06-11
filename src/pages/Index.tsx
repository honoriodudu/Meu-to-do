import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ListTodo, Database } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

/**
 * Página inicial pública da aplicação.
 *
 * Apresenta o valor principal do app e direciona para login, cadastro ou sobre.
 */
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-20 bg-gradient-to-br from-muted/20 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary rounded-lg">
              <ListTodo className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6">Meu To Do</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Organize suas tarefas diárias com data de início, prazo final e status.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="px-8" asChild>
              <a href="/login">
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="px-8" asChild>
              <a href="/about">
                Sobre
                <Database className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Por que usar Meu To Do?</h2>
            <p className="text-muted-foreground">Descubra as principais características que nos destacam</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ListTodo className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Simples</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Interface intuitiva e fácil de usar</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ListTodo className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Rápido</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Adicione tarefas em segundos</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ListTodo className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Organizado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Defina data de início, prazo final e status</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ListTodo className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Seguro</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Autenticação com Supabase</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Pronto para organizar sua vida?</CardTitle>
              <CardDescription>
                Crie sua conta gratuita e comece a gerenciar suas tarefas hoje mesmo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="/signup">
                    Criar Conta Gratuita
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="/about">
                    Sobre Nós
                    <Database className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

export default Index;