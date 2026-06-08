import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeaturedCard } from "@/components/FeaturedCard";
import { MadeWithDyad } from "@/components/made-with-dyad";

const pricingPlans = [
  {
    title: "Básico",
    description: "Para projetos pequenos e individuais",
    price: "R$ 29/mês",
    features: [
      "Até 5 projetos",
      "Suporte básico",
      "1GB de armazenamento",
      "Analytics simples"
    ],
    popular: false
  },
  {
    title: "Profissional",
    description: "Para equipes e projetos médios",
    price: "R$ 79/mês",
    features: [
      "Projetos ilimitados",
      "Suporte prioritário",
      "10GB de armazenamento",
      "Analytics avançadas",
      "API completa",
      "Integrações customizadas"
    ],
    popular: true
  },
  {
    title: "Enterprise",
    description: "Para grandes empresas e soluções corporativas",
    price: "Personalizado",
    features: [
      "Tudo do Profissional",
      "Suporte 24/7 dedicado",
      "Armazenamento ilimitado",
      "Analytics customizadas",
      "SLA garantido",
      "Suporte técnico prioritário",
      "Treinamento da equipe"
    ],
    popular: false
  }
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-foreground">Planos e Preços</h1>
          <p className="text-muted-foreground">Escolha o plano perfeito para sua necessidade</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Preços Transparentes</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sem contratos de longo prazo. Cancele a qualquer momento.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <div key={index} className="flex">
              <FeaturedCard
                title={plan.title}
                description={plan.description}
                features={plan.features}
                popular={plan.popular}
                onLearnMore={() => console.log(`Learn more about ${plan.title}`)}
              />
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Perguntas Frequentes</CardTitle>
              <CardDescription>
                Encontre respostas para suas dúvidas mais comuns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-2">Posso mudar de plano a qualquer momento?</h4>
                  <p className="text-muted-foreground">
                    Sim, você pode atualizar ou cancelar seu plano a qualquer momento sem penalidades.
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-2">Há taxas de configuração?</h4>
                  <p className="text-muted-foreground">
                    Não, não há taxas de configuração. Você começa a usar imediatamente.
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-2">Oferecem suporte técnico?</h4>
                  <p className="text-muted-foreground">
                    Sim, todos os planos incluem suporte técnico por email. Planos profissionais e enterprise incluem suporte prioritário.
                  </p>
                </div>
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

export default Pricing;