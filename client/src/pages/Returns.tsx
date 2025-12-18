// 📦 PÁGINA TROCAS E DEVOLUÇÕES - HERO ROXO PADRONIZADO
// Arquivo: client/src/pages/Returns.tsx

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Package, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function Returns() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16 md:pt-20">
        {/* Hero Section - TOM ROXO SUAVE PADRONIZADO */}
        <div 
          className="relative py-16 md:py-20 overflow-hidden"
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

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                textShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              Trocas e Devoluções
            </h1>
            <p 
              className="text-lg text-white/90"
              style={{
                fontFamily: "'Inter', 'Arial', sans-serif",
                textShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              Sua satisfação é nossa prioridade
            </p>
          </div>

          {/* Decoração */}
          <div className="absolute top-8 left-8 w-24 h-24 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-8 right-8 w-32 h-32 bg-amber-300/5 rounded-full blur-3xl" />
        </div>

        {/* Conteúdo */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Base Legal */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p className="text-gray-800">
              Nossa Política de Troca e Devolução está baseada no{' '}
              <a 
                href="https://www.planalto.gov.br/ccivil_03/Leis/L8078compilado.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline font-semibold"
              >
                Código de Defesa do Consumidor
              </a>
              , disponível no site do Governo Federal.
            </p>
          </div>

          {/* Prazo */}
          <section className="mb-8">
            <div className="flex items-start gap-3 mb-4">
              <Clock className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Prazo para Troca ou Devolução
                </h2>
                <p className="text-gray-700 mb-4">
                  Você tem <strong>7 dias corridos</strong> a partir do recebimento do produto 
                  para solicitar troca ou devolução, conforme o Artigo 49 do Código de Defesa 
                  do Consumidor.
                </p>
              </div>
            </div>
          </section>

          {/* Condições */}
          <section className="mb-8">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Condições para Troca/Devolução
                </h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Produto sem sinais de uso
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Embalagem original intacta
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Etiquetas preservadas
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Certificado de garantia (se aplicável)
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    Nota fiscal ou comprovante de compra
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Como Solicitar */}
          <section className="mb-8">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Como Solicitar
                </h2>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="font-bold text-pink-600 mr-3">1.</span>
                    <span>
                      Entre em contato via WhatsApp:{' '}
                      <a 
                        href="https://wa.me/5519998229202"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 font-semibold underline"
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

          {/* Frete */}
          <section className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              💰 Quem paga o frete de devolução?
            </h3>
            <p className="text-gray-700">
              <strong>Arrependimento (Artigo 49):</strong> O frete de devolução é por conta do cliente.
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Defeito ou produto errado:</strong> Nós arcamos com todos os custos de troca/devolução.
            </p>
          </section>

          {/* Reembolso */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Reembolso
            </h2>
            <p className="text-gray-700 mb-3">
              Após recebermos e analisarmos o produto, o reembolso será processado em até{' '}
              <strong>7 dias úteis</strong>, conforme a forma de pagamento original:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>PIX:</strong> Reembolso imediato após aprovação</li>
              <li>• <strong>Cartão de Crédito:</strong> Estorno na próxima fatura</li>
              <li>• <strong>Cartão de Débito:</strong> Até 7 dias úteis</li>
            </ul>
          </section>

          {/* Produtos Não Trocáveis */}
          <section className="mb-8">
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Produtos Não Trocáveis
                </h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    Produtos com desconto acima de 50% (promoções especiais)
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    Produtos personalizados ou sob encomenda
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    Produtos danificados por mau uso
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Garantia */}
          <section className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              🛡️ Garantia Legal
            </h3>
            <p className="text-gray-700">
              Todos os produtos possuem <strong>90 dias de garantia legal</strong> contra 
              defeitos de fabricação, conforme o Código de Defesa do Consumidor (Art. 26).
            </p>
          </section>

          {/* Contato */}
          <section className="bg-pink-50 border border-pink-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Precisa de ajuda?
            </h3>
            <p className="text-gray-700 mb-4">
              Nossa equipe está pronta para atender você!
            </p>
            <div className="space-y-2">
              <p>
                <a 
                  href="https://wa.me/5519998229202"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  WhatsApp: (19) 99822-9202
                </a>
              </p>
              <p>
                <a 
                  href="mailto:elathosemijoias@gmail.com"
                  className="text-pink-600 hover:text-pink-700 font-semibold"
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