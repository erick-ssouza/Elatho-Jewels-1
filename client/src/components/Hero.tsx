import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import logoImage from "@assets/Imagem_do_WhatsApp_de_2025-12-16_à(s)_15.19.26_e3a9e2a9_1765980301733.jpg";

export function Hero() {
  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${logoImage})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />

      <div className="relative z-10 text-center px-4 py-16 max-w-3xl mx-auto">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-white/90 text-sm font-medium">Nova Coleção 2025</span>
          </div>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
          Elegância que Brilha
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto">
          Descubra nossa coleção exclusiva de semijoias com design sofisticado e acabamento premium
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/#produtos">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground font-semibold px-8"
              data-testid="button-hero-shop"
            >
              Ver Coleção
            </Button>
          </Link>
          <Link href="/?categoria=Colares">
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
              data-testid="button-hero-colares"
            >
              Explorar Colares
            </Button>
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-white/70 text-sm">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">100+</span>
            <span>Produtos</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">5k+</span>
            <span>Clientes</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">4.9</span>
            <span>Avaliação</span>
          </div>
        </div>
      </div>
    </section>
  );
}
