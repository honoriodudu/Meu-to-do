"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ListTodo, Database } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import GlassCard from "@/components/ui/GlassCard";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-tertiary/20 to-background">
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
            {/* Hide the "Começar Agora" button when the user is logged in */}
            {!user && (
              <Button size="lg" className="px-8" asChild>
                <a href="/login">
                  Começar Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
            <Button variant="outline" size="lg" asChild>
              <a href="/about">
                Sobre Nós
                <Database className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Por que usar Meu To Do?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubra as principais características que nos destacam
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { color: "blue", label: "Simples", text: "Interface intuitiva e fácil de usar" },
              { color: "green", label: "Rápido", text: "Adicione tarefas em segundos" },
              { color: "purple", label: "Organizado", text: "Defina data de início, prazo final e status" },
              { color: "orange", label: "Seguro", text: "Autenticação com Supabase" },
            ].map((item, i) => (
              <Card key={i} className="text-center">
                <CardHeader>
                  <div className={`h-12 w-12 bg-${item.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <ListTodo className={`h-6 w-6 text-${item.color}-600`} />
                  </div>
                  <CardTitle className="text-lg">{item.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Visual showcase */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-2xl">Novo Estilo Visual</CardTitle>
              <CardDescription>
                Experimente nosso efeito vidro (glassmorphism) com o componente GlassCard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <GlassCard>
                <p className="text-muted-foreground">
                  Este cartão usa backdrop-filter e blur para criar um visual moderno e leve.
                </p>
              </GlassCard>
              <GlassCard className="p-6">
                <p className="text-sm text-muted-foreground">
                  O efeito vidro traz profundidade e elegância, perfeito para interfaces contemporâneas.
                </p>
              </GlassCard>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to action */}
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

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

export default Index;