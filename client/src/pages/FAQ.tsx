import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "Quanto tempo demora a entrega?",
      answer: "O prazo de entrega varia de acordo com a modalidade escolhida. PAC: 8 a 12 dias úteis. SEDEX: 3 a 5 dias úteis. O prazo começa a contar após a confirmação do pagamento."
    },
    {
      question: "As semijoias são banhadas a ouro?",
      answer: "Sim! Todas as nossas peças possuem banho de ouro 18k de alta qualidade, garantindo durabilidade e brilho intenso."
    },
    {
      question: "Posso molhar as semijoias?",
      answer: "Não recomendamos contato com água, seja do mar, piscina ou até mesmo do chuveiro. A água pode oxidar e danificar o banho de ouro com o tempo."
    },
    {
      question: "Como faço para trocar um produto?",
      answer: "Entre em contato conosco via WhatsApp em até 7 dias corridos após o recebimento. O produto deve estar sem uso, com etiqueta e embalagem original."
    },
    {
      question: "Qual a garantia das semijoias?",
      answer: "Oferecemos garantia de 90 dias contra defeitos de fabricação. Desgaste natural pelo uso não está coberto pela garantia."
    },
    {
      question: "Vocês entregam em todo o Brasil?",
      answer: "Sim! Entregamos para todo o território nacional através dos Correios (PAC e SEDEX)."
    },
    {
      question: "Posso pagar no PIX?",
      answer: "Sim! Aceitamos PIX e você ainda ganha 5% de desconto no valor total do pedido ao escolher essa forma de pagamento."
    },
    {
      question: "Como rastreio meu pedido?",
      answer: "Após a postagem, enviamos o código de rastreamento pelo WhatsApp. Você pode acompanhar a entrega no site dos Correios."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-20">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white font-serif mb-4">
              Dúvidas Frequentes
            </h1>
            <p className="text-white/90 text-lg">
              Encontre respostas para as perguntas mais comuns
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="text-left hover:no-underline" data-testid={`faq-question-${index}`}>
                  <span className="font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 bg-muted/50 rounded-lg p-6 text-center">
            <h3 className="font-bold text-lg mb-2">Não encontrou sua dúvida?</h3>
            <p className="text-muted-foreground mb-4">
              Entre em contato conosco pelo WhatsApp e teremos prazer em ajudar!
            </p>
            <a
              href="https://wa.me/5519998229202"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
