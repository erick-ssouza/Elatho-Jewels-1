import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-20">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white font-serif mb-4">
              Política de Privacidade
            </h1>
            <p className="text-white/90 text-lg">
              Como protegemos e utilizamos seus dados
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-bold font-serif text-foreground mb-3">
                1. Dados Coletados
              </h2>
              <p className="text-muted-foreground">
                Para processar seus pedidos e oferecer a melhor experiência de compra, coletamos as seguintes informações: nome completo, endereço de e-mail, número de WhatsApp e endereço de entrega.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-foreground mb-3">
                2. Uso dos Dados
              </h2>
              <p className="text-muted-foreground">
                Seus dados são utilizados exclusivamente para: processar pedidos, calcular frete e envio, entrar em contato sobre o status do pedido e enviar informações sobre promoções (apenas com seu consentimento).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-foreground mb-3">
                3. Compartilhamento de Dados
              </h2>
              <p className="text-muted-foreground">
                A Elatho Semijoias não compartilha, vende ou aluga suas informações pessoais com terceiros. Seus dados são mantidos em sigilo absoluto.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-foreground mb-3">
                4. Segurança
              </h2>
              <p className="text-muted-foreground">
                Utilizamos certificado SSL para garantir que todas as informações transmitidas sejam criptografadas. Nosso site é protegido com as mais recentes tecnologias de segurança digital.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-foreground mb-3">
                5. Dados de Pagamento
              </h2>
              <p className="text-muted-foreground">
                Não armazenamos dados de cartão de crédito ou débito em nossos servidores. Todas as transações são processadas diretamente por intermediadores de pagamento seguros e certificados.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-foreground mb-3">
                6. Seus Direitos (LGPD)
              </h2>
              <p className="text-muted-foreground">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a: acessar seus dados pessoais, solicitar correção de informações, pedir a exclusão dos seus dados e revogar o consentimento para uso de dados.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-foreground mb-3">
                7. Cookies
              </h2>
              <p className="text-muted-foreground">
                Utilizamos cookies para melhorar sua experiência de navegação, lembrar suas preferências e analisar o tráfego do site. Você pode desativar os cookies nas configurações do seu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold font-serif text-foreground mb-3">
                8. Contato
              </h2>
              <p className="text-muted-foreground">
                Para questões sobre privacidade ou para exercer seus direitos, entre em contato pelo e-mail: <a href="mailto:elathosemijoias@gmail.com" className="text-pink-600 hover:underline">elathosemijoias@gmail.com</a>
              </p>
            </section>

            <div className="text-sm text-muted-foreground border-t pt-6 mt-8">
              <p>Última atualização: Dezembro de 2025</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
