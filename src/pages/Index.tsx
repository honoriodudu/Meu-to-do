import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-foreground">Meu App Web</h1>
          <p className="text-muted-foreground">Projeto mínimo seguindo as regras do AI_RULES.md</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Componente 1</CardTitle>
              <CardDescription>
                Primeiro componente usando shadcn/ui
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Este é um exemplo de card com estilização usando Tailwind CSS e shadcn/ui.
              </p>
              <Button className="w-full">Ação Principal</Button>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Componente 2</CardTitle>
              <CardDescription>
                Segundo componente funcional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Badge 1</Badge>
                <Badge variant="outline">Badge 2</Badge>
                <Badge>Badge 3</Badge>
              </div>
              <Button variant="outline" className="w-full">
                Ação Secundária
              </Button>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Componente 3</CardTitle>
              <CardDescription>
                Terceiro componente interativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <Button variant="destructive" className="w-full">
                  Ação Destrutiva
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seção adicional */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Sobre este Projeto</CardTitle>
              <CardDescription>
                Informações sobre a implementação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Este projeto foi criado seguindo todas as regras definidas no arquivo AI_RULES.md.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✅ React com TypeScript</li>
                  <li>✅ React Router configurado</li>
                  <li>✅ shadcn/ui components utilizados</li>
                  <li>✅ Tailwind CSS para estilização</li>
                  <li>✅ Estrutura organizada em src/pages/ e src/components/</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

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