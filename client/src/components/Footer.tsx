// 📄 FOOTER - TONS SUAVES (IGUAL HERO)
// Arquivo: client/src/components/Footer.tsx

import { useLocation } from 'wouter';
import { Instagram, Mail, Phone, CreditCard, Smartphone } from 'lucide-react';

export function Footer() {
  const [, setLocation] = useLocation();

  // Função para navegar E subir a página
  const handleNavigate = (path: string) => {
    setLocation(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para abrir link externo
  const handleExternalLink = (url: string) => {
    if (url.startsWith('mailto:')) {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <footer 
      className="relative text-white overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.85) 0%, rgba(192, 132, 252, 0.85) 100%)',
      }}
    >
      {/* Pattern decorativo sutil */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Navegação */}
          <div>
            <h3 className="font-bold text-lg mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigate('/')}
                  className="hover:text-pink-200 transition-colors text-left text-white/90"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('/?categoria=Colares')}
                  className="hover:text-pink-200 transition-colors text-left text-white/90"
                >
                  Colares
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('/?categoria=Brincos')}
                  className="hover:text-pink-200 transition-colors text-left text-white/90"
                >
                  Brincos
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('/?categoria=Anéis')}
                  className="hover:text-pink-200 transition-colors text-left text-white/90"
                >
                  Anéis
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('/?categoria=Pulseiras')}
                  className="hover:text-pink-200 transition-colors text-left text-white/90"
                >
                  Pulseiras
                </button>
              </li>
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h3 className="font-bold text-lg mb-4">Institucional</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigate('/sobre')}
                  className="hover:text-pink-200 transition-colors text-left text-white/90"
                >
                  Sobre Nós
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('/trocas')}
                  className="hover:text-pink-200 transition-colors text-left text-white/90"
                >
                  Trocas e Devoluções
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('/privacidade')}
                  className="hover:text-pink-200 transition-colors text-left text-white/90"
                >
                  Política de Privacidade
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('/cuidados')}
                  className="hover:text-pink-200 transition-colors text-left text-white/90"
                >
                  Cuidados com Semijoias
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('/faq')}
                  className="hover:text-pink-200 transition-colors text-left text-white/90"
                >
                  Dúvidas Frequentes
                </button>
              </li>
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h3 className="font-bold text-lg mb-4">Atendimento</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigate('/rastreamento')}
                  className="hover:text-pink-200 transition-colors text-left text-white/90"
                >
                  Rastrear Pedido
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('/contato')}
                  className="hover:text-pink-200 transition-colors text-left text-white/90"
                >
                  Fale Conosco
                </button>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contato</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handleExternalLink('https://wa.me/5519998229202')}
                  className="hover:text-pink-200 transition-colors flex items-center gap-2 text-white/90"
                >
                  <Phone className="w-4 h-4" />
                  Whatsapp
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleExternalLink('https://instagram.com/elathosemijoias')}
                  className="hover:text-pink-200 transition-colors flex items-center gap-2 text-white/90"
                >
                  <Instagram className="w-4 h-4" />
                  @elathosemijoias
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleExternalLink('mailto:elathosemijoias@gmail.com')}
                  className="hover:text-pink-200 transition-colors flex items-center gap-2 text-white/90"
                >
                  <Mail className="w-4 h-4" />
                  elathosemijoias@gmail.com
                </button>
              </li>
            </ul>

            {/* Redes Sociais */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleExternalLink('https://wa.me/5519998229202')}
                className="bg-white/15 hover:bg-white/25 p-2 rounded-full transition-colors backdrop-blur-sm"
                aria-label="WhatsApp"
              >
                <Phone className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleExternalLink('https://instagram.com/elathosemijoias')}
                className="bg-white/15 hover:bg-white/25 p-2 rounded-full transition-colors backdrop-blur-sm"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleExternalLink('mailto:elathosemijoias@gmail.com')}
                className="bg-white/15 hover:bg-white/25 p-2 rounded-full transition-colors backdrop-blur-sm"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Formas de Pagamento */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <h3 className="font-bold text-lg mb-4 text-center">Formas de Pagamento</h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Smartphone className="w-5 h-5" />
              <span className="font-medium text-sm">PIX</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-lg backdrop-blur-sm">
              <CreditCard className="w-5 h-5" />
              <span className="font-medium text-sm">Crédito</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-lg backdrop-blur-sm">
              <CreditCard className="w-5 h-5" />
              <span className="font-medium text-sm">Débito</span>
            </div>
          </div>
          <p className="text-center text-sm mt-4 text-white/80">
            Parcele em até 12x sem juros
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center">
          <p className="text-white/90">
            © 2025 Elatho Semijoias - Todos os direitos reservados
          </p>
          <p className="text-white/70 text-sm mt-2">
            Elatho Semijoias (Gerida por Erica C. M. Bortolin) | CPF: 337.645.358-65 Rio Claro, São Paulo
          </p>
        </div>
      </div>

      {/* Decoração de brilho suave */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-amber-300/5 rounded-full blur-3xl" />
    </footer>
  );
}