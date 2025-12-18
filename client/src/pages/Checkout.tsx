import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Check, Truck, CreditCard, Smartphone, MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { apiRequest } from "@/lib/queryClient";
import {
  customerInfoSchema,
  addressInfoSchema,
  type CustomerInfo,
  type AddressInfo,
} from "@shared/schema";

const step1Schema = customerInfoSchema;
const step2Schema = addressInfoSchema.extend({
  shippingMethod: z.enum(["PAC", "SEDEX"]),
});
const step3Schema = z.object({
  paymentMethod: z.enum(["PIX", "Crédito", "Débito"]),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

const shippingOptions = [
  { method: "PAC" as const, name: "PAC", price: 15, days: "8-12 dias úteis" },
  { method: "SEDEX" as const, name: "SEDEX", price: 25, days: "3-5 dias úteis" },
];

const paymentOptions = [
  { method: "PIX" as const, name: "PIX", icon: Smartphone, discount: 0.05, description: "5% de desconto" },
  { method: "Crédito" as const, name: "Cartão de Crédito", icon: CreditCard, discount: 0, description: "Até 12x sem juros" },
  { method: "Débito" as const, name: "Cartão de Débito", icon: CreditCard, discount: 0, description: "À vista" },
];

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null);
  const [shippingMethod, setShippingMethod] = useState<"PAC" | "SEDEX">("PAC");
  const [paymentMethod, setPaymentMethod] = useState<"PIX" | "Crédito" | "Débito">("PIX");
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const { items, getTotal, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { name: "", whatsapp: "", email: "" },
  });

  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      shippingMethod: "PAC",
    },
  });

  const form3 = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: { paymentMethod: "PIX" },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const subtotal = getTotal();
  const shippingCost = shippingOptions.find((s) => s.method === shippingMethod)?.price || 0;
  const paymentDiscount = paymentOptions.find((p) => p.method === paymentMethod)?.discount || 0;
  const discountAmount = subtotal * paymentDiscount;
  const total = subtotal + shippingCost - discountAmount;

  const fetchAddress = async (cep: string) => {
    if (cep.length !== 8) return;

    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique o CEP e tente novamente.",
          variant: "destructive",
        });
        return;
      }

      form2.setValue("street", data.logradouro || "");
      form2.setValue("neighborhood", data.bairro || "");
      form2.setValue("city", data.localidade || "");
      form2.setValue("state", data.uf || "");
    } catch {
      toast({
        title: "Erro ao buscar CEP",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleStep1Submit = (data: Step1Data) => {
    setCustomerInfo(data);
    setStep(2);
  };

  const handleStep2Submit = (data: Step2Data) => {
    const { shippingMethod: method, ...address } = data;
    setAddressInfo(address);
    setShippingMethod(method);
    setStep(3);
  };

  const processPayment = async (paymentData: any) => {
    // ============================================
    // 🔧 AQUI VOCÊ INTEGRA SEU GATEWAY DE PAGAMENTO
    // ============================================

    // EXEMPLO COM MERCADO PAGO:
    /*
    const mp = new MercadoPago('YOUR_PUBLIC_KEY');
    const cardForm = mp.cardForm({
      amount: total.toString(),
      autoMount: true,
      form: {
        id: "payment-form",
        cardholderName: { id: "cardholderName" },
        cardNumber: { id: "cardNumber" },
        expirationDate: { id: "expirationDate" },
        securityCode: { id: "securityCode" },
      },
    });
    */

    // EXEMPLO COM PAGSEGURO:
    /*
    const response = await fetch('https://api.pagseguro.com/charges', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });
    */

    // POR ENQUANTO, SIMULAR PAGAMENTO BEM-SUCEDIDO:
    if (paymentMethod === "PIX") {
      // Gerar QR Code PIX (integrar com seu gateway)
      return {
        success: true,
        paymentId: `PIX-${Date.now()}`,
        qrCode: "00020126580014br.gov.bcb.pix...", // QR Code real virá do gateway
        pixCopiaECola: "00020126580014br.gov.bcb.pix..." // Código copia e cola
      };
    } else {
      // Cartão de crédito/débito (processar com gateway)
      return {
        success: true,
        paymentId: `CARD-${Date.now()}`,
        status: "approved"
      };
    }
  };

  const handleStep3Submit = async (data: Step3Data) => {
    if (!customerInfo || !addressInfo) return;

    setPaymentMethod(data.paymentMethod);
    setIsSubmitting(true);

    try {
      const selectedPayment = paymentOptions.find((p) => p.method === data.paymentMethod);
      const actualDiscount = subtotal * (selectedPayment?.discount || 0);
      const finalTotal = subtotal + shippingCost - actualDiscount;

      // Criar pedido no backend
      const orderData = {
        customer: customerInfo,
        address: addressInfo,
        shipping: {
          method: shippingMethod,
          cost: shippingCost,
        },
        payment: {
          method: data.paymentMethod,
          discount: actualDiscount,
          total: finalTotal,
        },
        items,
        status: "pending_payment", // Status inicial
      };

      // Salvar pedido e obter ID
      const orderResponse = await apiRequest("POST", "/api/orders", orderData);
      const newOrderId = orderResponse.id || `PED-${Date.now()}`;
      setOrderId(newOrderId);

      // Processar pagamento
      const paymentResult = await processPayment({
        amount: finalTotal,
        paymentMethod: data.paymentMethod,
        orderId: newOrderId,
        customer: customerInfo,
      });

      if (paymentResult.success) {
        // Atualizar status do pedido
        await apiRequest("PATCH", `/api/orders/${newOrderId}`, {
          status: "payment_approved",
          paymentId: paymentResult.paymentId,
          trackingCode: null, // Será preenchido quando enviar
        });

        toast({
          title: "Pagamento aprovado!",
          description: "Seu pedido foi confirmado com sucesso.",
        });

        clearCart();

        // Redirecionar para página de sucesso com ID do pedido
        setLocation(`/sucesso?pedido=${newOrderId}`);
      } else {
        throw new Error("Pagamento não aprovado");
      }

    } catch (error) {
      console.error("Erro ao processar pedido:", error);
      toast({
        title: "Erro ao processar pedido",
        description: "Tente novamente mais tarde ou entre em contato conosco.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para enviar resumo via WhatsApp (OPCIONAL)
  const sendWhatsAppNotification = () => {
    if (!customerInfo || !addressInfo || !orderId) return;

    const whatsappNumber = "5519998229202"; // ← TROCAR PELO SEU NÚMERO

    const selectedPayment = paymentOptions.find((p) => p.method === paymentMethod);
    const actualDiscount = subtotal * (selectedPayment?.discount || 0);
    const finalTotal = subtotal + shippingCost - actualDiscount;

    const orderText = `
*🎉 PEDIDO CONFIRMADO - ELATHO SEMIJOIAS*

*Número do Pedido:* ${orderId}

*Cliente:*
Nome: ${customerInfo.name}
WhatsApp: ${customerInfo.whatsapp}
Email: ${customerInfo.email}

*Endereço de Entrega:*
${addressInfo.street}, ${addressInfo.number}
${addressInfo.complement ? addressInfo.complement + "\n" : ""}${addressInfo.neighborhood}
${addressInfo.city} - ${addressInfo.state}
CEP: ${addressInfo.cep}

*Produtos:*
${items.map((item) => `- ${item.name} (${item.variation}) x${item.quantity} = ${formatPrice(item.price * item.quantity)}`).join("\n")}

*Frete:* ${shippingMethod} - ${formatPrice(shippingCost)}
*Pagamento:* ${paymentMethod}${actualDiscount > 0 ? ` (Desconto PIX: ${formatPrice(actualDiscount)})` : ""}

*TOTAL PAGO: ${formatPrice(finalTotal)}*

*Status:* Pagamento confirmado ✅
*Código de Rastreio:* Será enviado em até 24h

_Para acompanhar seu pedido, acesse: https://rastreamento.correios.com.br_
    `.trim();

    const encodedMessage = encodeURIComponent(orderText);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 md:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-foreground mb-4">Carrinho vazio</h1>
            <p className="text-muted-foreground mb-8">
              Adicione produtos ao carrinho antes de finalizar a compra.
            </p>
            <Button onClick={() => setLocation("/")} data-testid="button-back-shopping">
              Voltar às Compras
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 md:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Button
          variant="ghost"
          className="mb-8 -ml-2"
          onClick={() => (step > 1 ? setStep(step - 1) : setLocation("/carrinho"))}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {step > 1 ? "Voltar" : "Voltar ao Carrinho"}
        </Button>

        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step >= s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
                data-testid={`step-indicator-${s}`}
              >
                {step > s ? <Check className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 md:w-24 h-1 mx-2 rounded transition-colors ${
                    step > s ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Seus Dados</h2>
                  <form onSubmit={form1.handleSubmit(handleStep1Submit)} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        {...form1.register("name")}
                        placeholder="Seu nome completo"
                        className="mt-1"
                        data-testid="input-name"
                      />
                      {form1.formState.errors.name && (
                        <p className="text-sm text-destructive mt-1">{form1.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        {...form1.register("whatsapp")}
                        placeholder="11999999999"
                        className="mt-1"
                        data-testid="input-whatsapp"
                      />
                      {form1.formState.errors.whatsapp && (
                        <p className="text-sm text-destructive mt-1">{form1.formState.errors.whatsapp.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        {...form1.register("email")}
                        placeholder="seu@email.com"
                        className="mt-1"
                        data-testid="input-email"
                      />
                      {form1.formState.errors.email && (
                        <p className="text-sm text-destructive mt-1">{form1.formState.errors.email.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" size="lg" data-testid="button-next-step1">
                      Continuar
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Endereço e Frete</h2>
                  <form onSubmit={form2.handleSubmit(handleStep2Submit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="cep">CEP</Label>
                        <Input
                          id="cep"
                          {...form2.register("cep")}
                          placeholder="00000000"
                          maxLength={8}
                          className="mt-1"
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            form2.setValue("cep", value);
                            if (value.length === 8) fetchAddress(value);
                          }}
                          data-testid="input-cep"
                        />
                        {form2.formState.errors.cep && (
                          <p className="text-sm text-destructive mt-1">{form2.formState.errors.cep.message}</p>
                        )}
                      </div>
                    </div>

                    {isLoadingCep && (
                      <p className="text-sm text-muted-foreground">Buscando endereço...</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="street">Rua</Label>
                        <Input
                          id="street"
                          {...form2.register("street")}
                          placeholder="Nome da rua"
                          className="mt-1"
                          data-testid="input-street"
                        />
                        {form2.formState.errors.street && (
                          <p className="text-sm text-destructive mt-1">{form2.formState.errors.street.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="number">Número</Label>
                        <Input
                          id="number"
                          {...form2.register("number")}
                          placeholder="123"
                          className="mt-1"
                          data-testid="input-number"
                        />
                        {form2.formState.errors.number && (
                          <p className="text-sm text-destructive mt-1">{form2.formState.errors.number.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="complement">Complemento (opcional)</Label>
                      <Input
                        id="complement"
                        {...form2.register("complement")}
                        placeholder="Apartamento, bloco, etc."
                        className="mt-1"
                        data-testid="input-complement"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="neighborhood">Bairro</Label>
                        <Input
                          id="neighborhood"
                          {...form2.register("neighborhood")}
                          placeholder="Bairro"
                          className="mt-1"
                          data-testid="input-neighborhood"
                        />
                        {form2.formState.errors.neighborhood && (
                          <p className="text-sm text-destructive mt-1">{form2.formState.errors.neighborhood.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          {...form2.register("city")}
                          placeholder="Cidade"
                          className="mt-1"
                          data-testid="input-city"
                        />
                        {form2.formState.errors.city && (
                          <p className="text-sm text-destructive mt-1">{form2.formState.errors.city.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          {...form2.register("state")}
                          placeholder="UF"
                          maxLength={2}
                          className="mt-1"
                          data-testid="input-state"
                        />
                        {form2.formState.errors.state && (
                          <p className="text-sm text-destructive mt-1">{form2.formState.errors.state.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-3 block">Método de Envio</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {shippingOptions.map((option) => (
                          <button
                            key={option.method}
                            type="button"
                            onClick={() => form2.setValue("shippingMethod", option.method)}
                            className={`p-4 rounded-md border-2 text-left transition-all ${
                              form2.watch("shippingMethod") === option.method
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-muted-foreground"
                            }`}
                            data-testid={`button-shipping-${option.method.toLowerCase()}`}
                          >
                            <div className="flex items-center gap-3">
                              <Truck className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-foreground">{option.name}</p>
                                <p className="text-sm text-muted-foreground">{option.days}</p>
                              </div>
                            </div>
                            <p className="text-lg font-semibold text-primary mt-2">
                              {formatPrice(option.price)}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg" data-testid="button-next-step2">
                      Continuar
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Pagamento</h2>
                  <form onSubmit={form3.handleSubmit(handleStep3Submit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {paymentOptions.map((option) => (
                        <button
                          key={option.method}
                          type="button"
                          onClick={() => {
                            form3.setValue("paymentMethod", option.method);
                            setPaymentMethod(option.method);
                          }}
                          className={`p-4 rounded-md border-2 text-left transition-all ${
                            form3.watch("paymentMethod") === option.method
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-muted-foreground"
                          }`}
                          data-testid={`button-payment-${option.method.toLowerCase()}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <option.icon className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-foreground">{option.name}</p>
                                <p className="text-sm text-muted-foreground">{option.description}</p>
                              </div>
                            </div>
                            {option.discount > 0 && (
                              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                                5% OFF
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* 🔧 AQUI ADICIONAR FORMULÁRIO DE CARTÃO SE NECESSÁRIO */}
                    {(paymentMethod === "Crédito" || paymentMethod === "Débito") && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          ℹ️ Você será redirecionado para a página de pagamento seguro.
                        </p>
                      </div>
                    )}

                    {paymentMethod === "PIX" && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          ℹ️ Após confirmar, você receberá o QR Code PIX para pagamento.
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                      data-testid="button-finish-order"
                    >
                      {isSubmitting ? "Processando pagamento..." : "Confirmar e Pagar"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>

                    <div className="text-center text-xs text-muted-foreground mt-4">
                      🔒 Pagamento 100% seguro e criptografado
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Resumo do Pedido</h2>

                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variation}`} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.variation} x {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground" data-testid="text-checkout-subtotal">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Frete ({shippingMethod})</span>
                    <span className="text-foreground" data-testid="text-checkout-shipping">{formatPrice(shippingCost)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600">Desconto PIX</span>
                      <span className="text-green-600" data-testid="text-checkout-discount">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary" data-testid="text-checkout-total">{formatPrice(total)}</span>
                </div>

                {/* Botão WhatsApp Opcional */}
                {orderId && (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={sendWhatsAppNotification}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Enviar por WhatsApp
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}