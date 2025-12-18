import { Link } from "wouter";
import { MessageCircle, CreditCard, Smartphone } from "lucide-react";
import { SiInstagram, SiPix } from "react-icons/si";

export function Footer() {
  const whatsappNumber = "5519998229202";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="bg-gradient-to-r from-pink-500 to-purple-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-white/80 hover:text-amber-400 transition-colors" data-testid="link-footer-home">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/?categoria=Colares" className="text-white/80 hover:text-amber-400 transition-colors" data-testid="link-footer-colares">
                  Colares
                </Link>
              </li>
              <li>
                <Link href="/?categoria=Brincos" className="text-white/80 hover:text-amber-400 transition-colors" data-testid="link-footer-brincos">
                  Brincos
                </Link>
              </li>
              <li>
                <Link href="/?categoria=Anéis" className="text-white/80 hover:text-amber-400 transition-colors" data-testid="link-footer-aneis">
                  Anéis
                </Link>
              </li>
              <li>
                <Link href="/?categoria=Pulseiras" className="text-white/80 hover:text-amber-400 transition-colors" data-testid="link-footer-pulseiras">
                  Pulseiras
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Institucional</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sobre" className="text-white/80 hover:text-amber-400 transition-colors" data-testid="link-footer-sobre">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/trocas" className="text-white/80 hover:text-amber-400 transition-colors" data-testid="link-footer-trocas">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-white/80 hover:text-amber-400 transition-colors" data-testid="link-footer-privacidade">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/cuidados" className="text-white/80 hover:text-amber-400 transition-colors" data-testid="link-footer-cuidados">
                  Cuidados com Semijoias
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/80 hover:text-amber-400 transition-colors" data-testid="link-footer-faq">
                  Dúvidas Frequentes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Atendimento</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/rastreamento" className="text-white/80 hover:text-amber-400 transition-colors" data-testid="link-footer-rastreamento">
                  Rastrear Pedido
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-white/80 hover:text-amber-400 transition-colors" data-testid="link-footer-contato">
                  Fale Conosco
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-white/80">
                <MessageCircle className="h-4 w-4 text-white" />
                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-amber-400 transition-colors"
                  data-testid="link-footer-whatsapp"
                >
                  (19) 99822-9202
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/80">
                <SiInstagram className="h-4 w-4 text-white" />
                <a 
                  href="https://instagram.com/elathosemijoias" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                  data-testid="link-footer-instagram"
                >
                  @elathosemijoias
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/80">
                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <a 
                  href="mailto:elathosemijoias@gmail.com"
                  className="hover:text-amber-400 transition-colors"
                  data-testid="link-footer-email"
                >
                  elathosemijoias@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Formas de Pagamento</h4>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-white/20 rounded-md px-3 py-2 border border-amber-400/30">
                <SiPix className="h-5 w-5 text-amber-400" />
                <span className="text-white text-sm">PIX</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-md px-3 py-2">
                <CreditCard className="h-5 w-5 text-white" />
                <span className="text-white text-sm">Crédito</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-md px-3 py-2">
                <Smartphone className="h-5 w-5 text-white" />
                <span className="text-white text-sm">Débito</span>
              </div>
            </div>
            <p className="text-white/60 text-xs mt-3">
              Parcele em até 12x sem juros
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 text-center">
          <p className="text-white/80 text-sm">
            © 2025 Elatho Semijoias - Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
