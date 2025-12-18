import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Heart, Shield } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-20">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white font-serif mb-4">
              Sobre a Elatho Semijoias
            </h1>
            <p className="text-white/90 text-lg">
              Elegância que brilha em cada detalhe
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold font-serif text-foreground mb-4">
              Nossa História
            </h2>
            <p className="text-muted-foreground mb-6">
              A Elatho Semijoias nasceu do sonho de oferecer peças únicas e acessíveis para mulheres que valorizam a elegância no dia a dia. Cada semijoia é cuidadosamente selecionada para garantir qualidade, durabilidade e um brilho incomparável.
            </p>
            <p className="text-muted-foreground mb-8">
              Trabalhamos com as melhores matérias-primas do mercado, incluindo banho de ouro 18k de alta qualidade, para que você possa brilhar em todas as ocasiões sem preocupações.
            </p>
          </div>

          <div className="my-12">
            <h2 className="text-2xl font-bold font-serif text-foreground mb-6 text-center">
              Nossos Valores
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Qualidade</h3>
                  <p className="text-muted-foreground text-sm">
                    Selecionamos apenas as melhores peças com acabamento impecável e banho de ouro 18k.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Elegância</h3>
                  <p className="text-muted-foreground text-sm">
                    Designs exclusivos que realçam a beleza natural de cada mulher em qualquer ocasião.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Confiança</h3>
                  <p className="text-muted-foreground text-sm">
                    Compra segura, atendimento humanizado e garantia de 90 dias em todas as peças.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center bg-muted/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold font-serif text-foreground mb-4">
              Nossa Missão
            </h2>
            <p className="text-muted-foreground text-lg italic">
              "Realçar a beleza de cada mulher com semijoias de alta qualidade, oferecendo peças que combinam elegância, durabilidade e preços acessíveis."
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
