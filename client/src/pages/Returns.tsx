import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Clock, MessageCircle, Truck, CreditCard, AlertTriangle } from "lucide-react";

export default function Returns() {
  const policies = [
    {
      icon: Clock,
      title: "Prazo para Troca",
      description: "Você tem até 7 dias corridos após o recebimento do produto para solicitar a troca ou devolução."
    },
    {
      icon: Package,
      title: "Condições do Produto",
      description: "O produto deve estar sem uso, com etiqueta original e na embalagem intacta para ser aceito na troca."
    },
    {
      icon: MessageCircle,
      title: "Como Solicitar",
      description: "Entre em contato conosco via WhatsApp (19) 99822-9202 informando o número do pedido e o motivo da troca."
    },
    {
      icon: Truck,
      title: "Frete de Devolução",
      description: "O custo do frete de devolução é de responsabilidade do cliente, exceto em casos de defeito de fabricação."
    },
    {
      icon: CreditCard,
      title: "Reembolso",
      description: "O reembolso será efetuado em até 7 dias úteis após recebermos e conferirmos o produto devolvido."
    },
    {
      icon: AlertTriangle,
      title: "Produtos com Desconto",
      description: "Produtos adquiridos em promoção ou com cupom de desconto não são elegíveis para troca, apenas para devolução."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-20">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white font-serif mb-4">
              Trocas e Devoluções
            </h1>
            <p className="text-white/90 text-lg">
              Saiba como funciona nossa política de trocas e devoluções
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-6">
            {policies.map((policy, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <policy.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{policy.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{policy.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-muted/50 rounded-lg p-6 text-center">
            <h3 className="font-bold text-lg mb-2">Precisa de ajuda?</h3>
            <p className="text-muted-foreground mb-4">
              Entre em contato conosco pelo WhatsApp para esclarecer qualquer dúvida sobre trocas e devoluções.
            </p>
            <a
              href="https://wa.me/5519998229202"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
