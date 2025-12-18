import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Droplets, AlertTriangle, Sparkles, Waves, Sun, Dumbbell } from "lucide-react";

export default function Care() {
  const tips = [
    {
      icon: Droplets,
      title: "Limpeza",
      description: "Limpe suas semijoias com água e detergente neutro. Use uma escova de dentes macia para alcançar os detalhes."
    },
    {
      icon: AlertTriangle,
      title: "Evite Atritos",
      description: "Evite atritos com outras superfícies e contato com produtos de limpeza, que podem danificar o banho."
    },
    {
      icon: Sparkles,
      title: "Perfume e Hidratantes",
      description: "Ao passar perfume e hidratantes, espere secar completamente antes de colocar a semijoia."
    },
    {
      icon: Waves,
      title: "Água",
      description: "Nunca entre no mar, piscinas e até mesmo em duchas ou banhos diários com as peças. A água pode oxidar."
    },
    {
      icon: Sun,
      title: "Proteção",
      description: "Guarde suas semijoias longe do sol, calor, umidade e exposição direta à luz para preservar o brilho."
    },
    {
      icon: Dumbbell,
      title: "Exercícios",
      description: "Não utilize as semijoias para fazer exercícios físicos. O suor pode danificar o banho de ouro."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-20">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white font-serif mb-4">
              Cuidados com Semijoias
            </h1>
            <p className="text-white/90 text-lg">
              Dicas para manter suas peças sempre brilhando
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <p className="text-muted-foreground text-center mb-10">
            Seguindo essas dicas simples, você garante que suas semijoias durem muito mais tempo e mantenham o brilho como novas.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <tip.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{tip.title}</h3>
                  <p className="text-muted-foreground text-sm">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg p-6 text-center">
            <h3 className="font-bold text-lg mb-2">Dica Extra</h3>
            <p className="text-muted-foreground">
              Guarde suas semijoias separadamente em saquinhos de veludo ou caixinhas individuais para evitar arranhões e contato com outros metais.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
