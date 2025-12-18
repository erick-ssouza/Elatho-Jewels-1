// 🎨 HERO - TONS SUAVES
// Arquivo: client/src/components/Hero.tsx

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section 
      className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.85) 0%, rgba(192, 132, 252, 0.85) 100%)',
      }}
    >
      {/* Fundo com foto de joias */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Pattern decorativo sutil */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

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

        <div className="flex justify-center">
          <Button
            size="lg"
            className="bg-white text-pink-600 hover:bg-pink-50 font-semibold px-8"
            data-testid="button-hero-shop"
            onClick={() => {
              const element = document.getElementById('produtos');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Ver Coleção
          </Button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-white/70 text-sm">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">60+</span>
            <span>Produtos</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">650+</span>
            <span>Clientes</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">4.9</span>
            <span>Avaliação</span>
          </div>
        </div>
      </div>

      {/* Decoração de brilho suave */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-amber-300/5 rounded-full blur-3xl" />
    </section>
  );
}