import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Code, Smartphone, Palette, Database } from "lucide-react";

const services = [
  {
    icon: Code,
    title: "Desenvolvimento Web",
    description: "Criação de websites modernos e responsivos com as últimas tecnologias.",
    features: ["React", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    color: "bg-blue-100 text-blue-800"
  },
  {
    icon: Smartphone,
    title: "Apps Mobile",
    description: "Desenvolvimento de aplicativos nativos e híbridos para iOS e Android.",
    features: ["React Native", "Flutter", "iOS", "Android"],
    color: "bg-green-100 text-green-800"
  },
  {
    icon: Palette,
    title: "Design UI/UX",
    description: "Design de interfaces intuitivas e experiências de usuário memoráveis.",
    features: ["Figma", "Adobe XD", "Prototipagem", "Usabilidade"],
    color: "bg-purple-100 text-purple-800"
  },
  {
    icon: Database,
    title: "Backend",
    description: "Desenvolvimento de APIs e sistemas backend escaláveis e seguros.",
    features: ["Node.js", "Express", "PostgreSQL", "MongoDB"],
    color: "bg-orange-100 text-orange-800"
  }
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-foreground">Nossos Serviços</h1>
          <p className="text-muted-foreground">Conheça nossos serviços especializados</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Serviços que Transformam Ideias em Realidade</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Oferecemos soluções completas de desenvolvimento web e mobile para levar seu projeto ao próximo nível.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${service.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium">Tecnologias:</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Pronto para começar?</CardTitle>
              <CardDescription>
                Entre em contato e vamos discutir como podemos ajudar seu projeto.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Temos uma equipe especialista pronta para transformar suas ideias em realidade digital.
                </p>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Resultados Garantidos
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

export default Services;