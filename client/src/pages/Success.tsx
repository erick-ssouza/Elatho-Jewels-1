import { Link } from "wouter";
import { CheckCircle2, Home, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Success() {
  const whatsappNumber = "5519998229202";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 md:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <Card className="text-center">
          <CardContent className="py-12 px-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="font-serif text-3xl font-bold text-foreground mb-4" data-testid="text-success-title">
              Pedido Realizado com Sucesso!
            </h1>

            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Seu pedido foi recebido e estamos preparando tudo com muito carinho.
              Em breve você receberá a confirmação pelo WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button variant="outline" size="lg" data-testid="button-back-home">
                  <Home className="h-4 w-4 mr-2" />
                  Voltar ao Início
                </Button>
              </Link>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-green-500 hover:bg-green-600" data-testid="button-whatsapp">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Falar no WhatsApp
                </Button>
              </a>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <h2 className="font-semibold text-foreground mb-4">Próximos passos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Confirmação</p>
                    <p className="text-xs text-muted-foreground">Receba a confirmação do pedido</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Preparação</p>
                    <p className="text-xs text-muted-foreground">Seu pedido está sendo preparado</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Envio</p>
                    <p className="text-xs text-muted-foreground">Código de rastreio pelo WhatsApp</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
