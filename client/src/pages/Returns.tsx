import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Package, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function Returns() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 md:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full mb-4">
            <Package className="w-8 h-8 text-pink-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 font-serif" data-testid="text-page-title">
            Trocas e Devoluções
          </h1>
          <p className="text-lg text-muted-foreground">
            Sua satisfação é nossa prioridade
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <p className="text-foreground">
            Nossa Política de Troca e Devolução está baseada no{' '}
            <a 
              href="https://www.planalto.gov.br/ccivil_03/Leis/L8078compilado.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline font-semibold"
              data-testid="link-consumer-code"
            >
              Código de Defesa do Consumidor
            </a>
            , disponível no site do Governo Federal.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex items-start gap-3 mb-4">
              <Clock className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-3 font-serif">
                  Prazo para Troca ou Devolução
                </h2>
                <p className="text-muted-foreground mb-4">
                  Você tem <strong className="text-foreground">7 dias corridos</strong> a partir do recebimento do produto 
                  para solicitar troca ou devolução, conforme o Artigo 49 do Código de Defesa 
                  do Consumidor.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-3 font-serif">
                  Condições para Troca/Devolução
                </h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Produto sem sinais de uso
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Embalagem original intacta
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Etiquetas preservadas
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Certificado de garantia (se aplicável)
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Nota fiscal ou comprovante de compra
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-3 font-serif">
                  Como Solicitar
                </h2>
                <ol className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="font-bold text-pink-600 mr-3">1.</span>
                    <span>
                      Entre em contato via WhatsApp:{' '}
                      <a 
                        href="https://wa.me/5519998229202"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 font-semibold underline"
                        data-testid="link-whatsapp-returns"
                      >
                        (19) 99822-9202
                      </a>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-pink-600 mr-3">2.</span>
                    <span>Informe o número do pedido e o motivo da troca/devolução</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-pink-600 mr-3">3.</span>
                    <span>Aguarde as instruções da nossa equipe</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-pink-600 mr-3">4.</span>
                    <span>Envie o produto conforme orientado</span>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          <section className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-2 font-serif">
              Quem paga o frete de devolução?
            </h3>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Arrependimento (Artigo 49):</strong> O frete de devolução é por conta do cliente.
            </p>
            <p className="text-muted-foreground mt-2">
              <strong className="text-foreground">Defeito ou produto errado:</strong> Nós arcamos com todos os custos de troca/devolução.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 font-serif">
              Reembolso
            </h2>
            <p className="text-muted-foreground">
              Após recebermos e analisarmos o produto, o reembolso será processado em até{' '}
              <strong className="text-foreground">7 dias úteis</strong>, conforme a forma de pagamento original:
            </p>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">PIX:</strong> Reembolso imediato após aprovação</li>
              <li><strong className="text-foreground">Cartão de Crédito:</strong> Estorno na próxima fatura</li>
              <li><strong className="text-foreground">Cartão de Débito:</strong> Até 7 dias úteis</li>
            </ul>
          </section>

          <section>
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-3 font-serif">
                  Produtos Não Trocáveis
                </h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    Produtos com desconto acima de 50% (promoções especiais)
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    Produtos personalizados ou sob encomenda
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    Produtos danificados por mau uso
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-2 font-serif">
              Garantia Legal
            </h3>
            <p className="text-muted-foreground">
              Todos os produtos possuem <strong className="text-foreground">90 dias de garantia legal</strong> contra 
              defeitos de fabricação, conforme o Código de Defesa do Consumidor (Art. 26).
            </p>
          </section>

          <section className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg p-6 text-center">
            <h3 className="text-lg font-bold mb-3 font-serif">
              Precisa de ajuda?
            </h3>
            <p className="text-muted-foreground mb-4">
              Nossa equipe está pronta para atender você!
            </p>
            <div className="space-y-2">
              <p>
                <a 
                  href="https://wa.me/5519998229202"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 font-semibold"
                  data-testid="link-whatsapp-help"
                >
                  WhatsApp: (19) 99822-9202
                </a>
              </p>
              <p>
                <a 
                  href="mailto:elathosemijoias@gmail.com"
                  className="text-pink-600 font-semibold"
                  data-testid="link-email-help"
                >
                  Email: elathosemijoias@gmail.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
