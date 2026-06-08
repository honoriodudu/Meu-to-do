import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code, Database, Smartphone, Palette } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const features = [
    {
      icon: Code,
      title: "Tecnologia Moderna",
      description: "Utilizamos as melhores práticas e tecnologias do mercado.",
      color: "text-blue-600"
    },
    {
      icon: Smartphone,
      title: "Design Responsivo",
      description: "Adapta-se perfeitamente a todos os dispositivos.",
      color: "text-green-600"
    },
    {
      icon: Database,
      title: "Performance",
      description: "Aplicações rápidas e otimizadas para melhor experiência.",
      color: "text-purple-600"
    },
    {
      icon: Palette,
      title: "Design Intuitivo",
      description: "Interfaces amigáveis e fáceis de usar.",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-muted/20 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Bem-vindo ao <span className="text-primary">Meu App Web</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Uma aplicação moderna desenvolvida com React, TypeScript e shadcn/ui, seguindo as melhores práticas de desenvolvimento.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="px-8">
              Começar Agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Por que escolher nosso app?</h2>
            <p className="text-muted-foreground">Descubra as principais características que nos destacam</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <Icon className={`h-12 w-12 mx-auto mb-4 ${feature.color}`} />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <p className="text-muted-foreground">Projetos Concluídos</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <p className="text-muted-foreground">Clientes Satisfeitos</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">Suporte Disponível</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Pronto para transformar sua ideia?</CardTitle>
              <CardDescription>
                Entre em contato e vamos conversar sobre seu próximo projeto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 justify-center">
                <Button>Ver Serviços</Button>
                <Button variant="outline">Contato</Button>
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