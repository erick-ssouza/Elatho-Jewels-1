import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Package, Search, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function Tracking() {
  const [trackingCode, setTrackingCode] = useState('');

  const handleTrack = () => {
    if (trackingCode.trim() === '') {
      alert('Por favor, digite o código de rastreamento');
      return;
    }
    window.open('https://rastreamento.correios.com.br/app/index.php', '_blank');
  };

  const openCorreios = () => {
    window.open('https://rastreamento.correios.com.br/app/index.php', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 md:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <Package className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 font-serif" data-testid="text-page-title">
            Rastreamento de Pedido
          </h1>
          <p className="text-lg text-muted-foreground">
            Acompanhe seu pedido em tempo real
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6 text-center font-serif">
              Digite seu código de rastreamento
            </h2>

            <div className="flex gap-3 mb-6 flex-wrap">
              <Input
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                placeholder="Ex: BR123456789BR"
                className="flex-1 text-center text-lg font-mono min-w-[200px]"
                maxLength={13}
                data-testid="input-tracking-code"
              />
              <Button onClick={handleTrack} size="lg" data-testid="button-track">
                <Search className="w-5 h-5 mr-2" />
                Rastrear
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                O código de rastreamento foi enviado para você via WhatsApp após a postagem
              </p>
              <Button 
                variant="outline" 
                onClick={openCorreios}
                className="inline-flex items-center gap-2"
                data-testid="button-correios"
              >
                Rastrear direto no site dos Correios
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-3 font-serif">
              Como funciona o rastreamento?
            </h3>
            <ol className="space-y-2 text-muted-foreground">
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

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-3 font-serif">
              Link Oficial dos Correios
            </h3>
            <p className="text-muted-foreground mb-4">
              Para rastrear seu pedido, você também pode acessar diretamente o site oficial:
            </p>
            <a 
              href="https://rastreamento.correios.com.br/app/index.php"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold underline"
              data-testid="link-correios"
            >
              rastreamento.correios.com.br
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-bold mb-2">PAC</h4>
                <p className="text-muted-foreground">Prazo: 8-12 dias úteis</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-bold mb-2">SEDEX</h4>
                <p className="text-muted-foreground">Prazo: 3-5 dias úteis</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg p-6 text-center">
            <h3 className="text-lg font-bold mb-3 font-serif">
              Não recebeu o código de rastreamento?
            </h3>
            <p className="text-muted-foreground mb-4">
              Entre em contato conosco pelo WhatsApp!
            </p>
            <a 
              href="https://wa.me/5519998229202"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              data-testid="link-whatsapp-tracking"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
