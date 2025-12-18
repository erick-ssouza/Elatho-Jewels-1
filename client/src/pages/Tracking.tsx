// 📦 PÁGINA RASTREAMENTO - HERO ROXO PADRONIZADO
// Arquivo: client/src/pages/Tracking.tsx

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Package, Search, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Tracking() {
  const [trackingCode, setTrackingCode] = useState('');

  const handleTrack = () => {
    if (trackingCode.trim() === '') {
      alert('Por favor, digite o código de rastreamento');
      return;
    }
    // Redirecionar para site dos Correios
    const correiosUrl = `https://rastreamento.correios.com.br/app/index.php`;
    window.open(correiosUrl, '_blank');
  };

  const openCorreios = () => {
    window.open('https://rastreamento.correios.com.br/app/index.php', '_blank');
  };

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
              Rastreamento de Pedido
            </h1>
            <p 
              className="text-lg text-white/90"
              style={{
                fontFamily: "'Inter', 'Arial', sans-serif",
                textShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              Acompanhe seu pedido em tempo real
            </p>
          </div>

          {/* Decoração */}
          <div className="absolute top-8 left-8 w-24 h-24 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-8 right-8 w-32 h-32 bg-amber-300/5 rounded-full blur-3xl" />
        </div>

        {/* Conteúdo */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Card Principal */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Digite seu código de rastreamento
            </h2>

            <div className="flex gap-3 mb-6">
              <Input
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                placeholder="Ex: BR123456789BR"
                className="flex-1 text-center text-lg font-mono"
                maxLength={13}
              />
              <Button onClick={handleTrack} size="lg">
                <Search className="w-5 h-5 mr-2" />
                Rastrear
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                O código de rastreamento foi enviado para você via WhatsApp após a postagem
              </p>
              <Button 
                variant="outline" 
                onClick={openCorreios}
                className="inline-flex items-center gap-2"
              >
                Rastrear direto no site dos Correios
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Informações */}
          <div className="space-y-6">
            {/* Como Funciona */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                📦 Como funciona o rastreamento?
              </h3>
              <ol className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="font-bold text-blue-600 mr-3">1.</span>
                  <span>Quando seu pedido é postado, você recebe o código de rastreamento via WhatsApp</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-blue-600 mr-3">2.</span>
                  <span>Digite o código aqui ou no site dos Correios</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-blue-600 mr-3">3.</span>
                  <span>Acompanhe todas as etapas de entrega em tempo real</span>
                </li>
              </ol>
            </div>

            {/* Link Oficial */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                🔗 Link Oficial dos Correios
              </h3>
              <p className="text-gray-700 mb-4">
                Para rastrear seu pedido, você também pode acessar diretamente o site oficial:
              </p>
              <a 
                href="https://rastreamento.correios.com.br/app/index.php"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold underline"
              >
                rastreamento.correios.com.br
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Prazos */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-bold text-gray-900 mb-2">📮 PAC</h4>
                <p className="text-gray-700">Prazo: 8-12 dias úteis</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-bold text-gray-900 mb-2">🚀 SEDEX</h4>
                <p className="text-gray-700">Prazo: 3-5 dias úteis</p>
              </div>
            </div>

            {/* Dúvidas */}
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Não recebeu o código de rastreamento?
              </h3>
              <p className="text-gray-700 mb-4">
                Entre em contato conosco pelo WhatsApp!
              </p>
              <a 
                href="https://wa.me/5519998229202"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}