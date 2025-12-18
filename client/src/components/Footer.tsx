import { Link } from "wouter";
import { MessageCircle, Instagram, Mail, MapPin } from "lucide-react";
import logoImage from "@assets/Imagem_do_WhatsApp_de_2025-12-16_à(s)_15.19.26_e3a9e2a9_1765980301733.jpg";

export function Footer() {
  const whatsappNumber = "5519998229202";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <img
              src={logoImage}
              alt="Elatho Semijoias"
              className="h-12 w-auto object-contain rounded-md mb-4"
            />
            <p className="text-muted-foreground text-sm">
              Elegância que brilha em cada detalhe. Semijoias com design exclusivo e acabamento premium.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/?categoria=Colares" className="text-muted-foreground hover:text-foreground transition-colors">
                  Colares
                </Link>
              </li>
              <li>
                <Link href="/?categoria=Brincos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Brincos
                </Link>
              </li>
              <li>
                <Link href="/?categoria=Anéis" className="text-muted-foreground hover:text-foreground transition-colors">
                  Anéis
                </Link>
              </li>
              <li>
                <Link href="/?categoria=Pulseiras" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pulseiras
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/carrinho" className="text-muted-foreground hover:text-foreground transition-colors">
                  Carrinho
                </Link>
              </li>
              <li>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  Fale Conosco
                </a>
              </li>
              <li>
                <span className="text-muted-foreground">Trocas e Devoluções</span>
              </li>
              <li>
                <span className="text-muted-foreground">Política de Privacidade</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Instagram className="h-4 w-4" />
                <span>@elathosemijoias</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>elathosemijoias@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Rio Claro, SP</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Elatho Semijoias. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 opacity-60" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-60" />
            <img src="https://logospng.org/download/pix/logo-pix-icone-256.png" alt="Pix" className="h-6 opacity-60" />
          </div>
        </div>
      </div>
    </footer>
  );
}
