import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MadeWithDyad } from "@/components/made-with-dyad";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-foreground">Sobre</h1>
          <p className="text-muted-foreground">Informações sobre o projeto</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sobre este Projeto</CardTitle>
              <CardDescription>
                Um projeto web mínimo seguindo as regras do AI_RULES.md
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Tecnologias Utilizadas</h2>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">React</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="outline">Tailwind CSS</Badge>
                  <Badge variant="default">shadcn/ui</Badge>
                  <Badge variant="secondary">React Router</Badge>
                  <Badge variant="outline">Lucide React</Badge>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Estrutura do Projeto</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• <code className="bg-muted px-2 py-1 rounded">src/pages/</code> - Páginas da aplicação</li>
                  <li>• <code className="bg-muted px-2 py-1 rounded">src/components/</code> - Componentes reutilizáveis</li>
                  <li>• <code className="bg-muted px-2 py-1 rounded">src/App.tsx</code> - Configuração do routing</li>
                  <li>• <code className="bg-muted px-2 py-1 rounded">src/globals.css</code> - Estilos globais</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Regras Seguidas</h2>
                <div className="grid gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">✅ React + TypeScript</h3>
                    <p className="text-muted-foreground text-sm">
                      Aplicação construída com React 19 e TypeScript para tipagem estática.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">✅ React Router</h3>
                    <p className="text-muted-foreground text-sm">
                      Navegação entre páginas configurada no App.tsx com BrowserRouter e Routes.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">✅ shadcn/ui</h3>
                    <p className="text-muted-foreground text-sm">
                      Componentes UI modernos e acessíveis utilizados em toda a aplicação.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">✅ Tailwind CSS</h3>
                    <p className="text-muted-foreground text-sm">
                      Estilização consistente usando classes Tailwind CSS com sistema de cores baseado em CSS variables.
                    </p>
                  </div>
                </div>
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

export default About;