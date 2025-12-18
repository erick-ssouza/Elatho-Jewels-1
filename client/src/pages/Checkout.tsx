import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Check, Truck, CreditCard, Smartphone, MessageCircle, Loader2 } from "lucide-react";
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

const defaultShippingOptions = [
  { method: "PAC" as const, name: "PAC", price: 15, days: "8-12 dias úteis" },
  { method: "SEDEX" as const, name: "SEDEX", price: 25, days: "3-5 dias úteis" },
];

type ShippingOption = typeof defaultShippingOptions[number];

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
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>(defaultShippingOptions);
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
  const baseShippingCost = shippingOptions.find((s) => s.method === shippingMethod)?.price || 0;
  // Frete grátis para compras acima de R$ 299
  const shippingCost = subtotal >= 299 ? 0 : baseShippingCost;
  const isFreeShipping = subtotal >= 299;
  const paymentDiscount = paymentOptions.find((p) => p.method === paymentMethod)?.discount || 0;
  const discountAmount = subtotal * paymentDiscount;
  const total = subtotal + shippingCost - discountAmount;

  const fetchShipping = async (cep: string) => {
    if (cep.length !== 8) return;

    setIsLoadingShipping(true);
    try {
      const response = await fetch('/api/calcular-frete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cepDestino: cep })
      });

      if (!response.ok) {
        throw new Error('Erro ao calcular frete');
      }

      const data = await response.json();
      
      // API retorna: FIXO (econômico/PAC) e EXPRESSO (rápido/SEDEX)
      const updatedOptions: ShippingOption[] = [];
      
      for (const servico of data) {
        const valor = parseFloat(servico.Valor?.replace(',', '.')) || 0;
        // PrazoEntrega pode ser "7 a 12" ou número
        const prazoStr = servico.PrazoEntrega || "";
        
        if (servico.Codigo === 'FIXO' || servico.Codigo === '04510') {
          // PAC / Econômico
          updatedOptions.push({
            method: "PAC" as const,
            name: "PAC",
            price: valor,
            days: prazoStr.includes('a') ? `${prazoStr} dias úteis` : `${prazoStr}-${parseInt(prazoStr) + 4} dias úteis`
          });
        } else if (servico.Codigo === 'EXPRESSO' || servico.Codigo === '04014') {
          // SEDEX / Expresso
          updatedOptions.push({
            method: "SEDEX" as const,
            name: "SEDEX",
            price: valor,
            days: prazoStr.includes('a') ? `${prazoStr} dias úteis` : `${prazoStr}-${parseInt(prazoStr) + 2} dias úteis`
          });
        }
      }

      if (updatedOptions.length > 0) {
        // Ordenar: PAC primeiro, depois SEDEX
        updatedOptions.sort((a, b) => a.method === 'PAC' ? -1 : 1);
        setShippingOptions(updatedOptions);
      }
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      // Mantém os valores padrão em caso de erro
      setShippingOptions(defaultShippingOptions);
    } finally {
      setIsLoadingShipping(false);
    }
  };

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

      // Também calcular frete quando encontrar o CEP
      fetchShipping(cep);
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

  const processPaymentWithMercadoPago = async () => {
    // Chamar a rota do Mercado Pago no backend
    const response = await fetch('/api/criar-pagamento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itens: items.map(item => ({
          id: item.productId.toString(),
          nome: item.name,
          quantidade: item.quantity,
          preco: item.price
        })),
        frete: shippingCost
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao criar pagamento');
    }

    const data = await response.json();
    return data.link; // URL do Mercado Pago
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
        status: "pending_payment",
      };

      // Salvar pedido e obter ID
      const orderResponse = await apiRequest("POST", "/api/orders", orderData);
      const orderResult = await orderResponse.json();
      const newOrderId = orderResult.id || `PED-${Date.now()}`;
      setOrderId(newOrderId);

      // Redirecionar para Mercado Pago (cartão/PIX)
      const mercadoPagoLink = await processPaymentWithMercadoPago();

      if (mercadoPagoLink) {
        // Redirecionar para página de pagamento do Mercado Pago
        window.location.href = mercadoPagoLink;
      } else {
        throw new Error("Link de pagamento não gerado");
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

  // Função para finalizar pedido via WhatsApp
  const handleWhatsAppCheckout = async () => {
    if (!customerInfo || !addressInfo) return;

    const whatsappNumber = "5519998229202";
    const newOrderId = `PED-${Date.now()}`;

    const selectedPayment = paymentOptions.find((p) => p.method === paymentMethod);
    const actualDiscount = subtotal * (selectedPayment?.discount || 0);
    const finalTotal = subtotal + shippingCost - actualDiscount;

    // Salvar pedido no backend
    try {
      const orderData = {
        customer: customerInfo,
        address: addressInfo,
        shipping: {
          method: shippingMethod,
          cost: shippingCost,
        },
        payment: {
          method: paymentMethod,
          discount: actualDiscount,
          total: finalTotal,
        },
        items,
        status: "pending_payment",
      };

      await apiRequest("POST", "/api/orders", orderData);
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
    }

    const itemsList = items.map((item) => `${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`).join("\n");

    const orderText = `Olá! Gostaria de finalizar o Pedido #${newOrderId}.

*Cliente:* ${customerInfo.name}
*WhatsApp:* ${customerInfo.whatsapp}
*Email:* ${customerInfo.email}

*Endereço:*
${addressInfo.street}, ${addressInfo.number}
${addressInfo.complement ? addressInfo.complement + ", " : ""}${addressInfo.neighborhood}
${addressInfo.city} - ${addressInfo.state}
CEP: ${addressInfo.cep}

*Itens:*
${itemsList}

*Subtotal:* ${formatPrice(subtotal)}
*Frete:* ${isFreeShipping ? "Grátis" : formatPrice(shippingCost)} (${shippingMethod})
${actualDiscount > 0 ? `*Desconto PIX:* -${formatPrice(actualDiscount)}\n` : ""}*Valor Total:* ${formatPrice(finalTotal)}

*Forma de Pagamento:* ${paymentMethod}`;

    const encodedMessage = encodeURIComponent(orderText);
    
    clearCart();
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
    setLocation(`/sucesso?pedido=${newOrderId}`);
  };

  // Função para enviar resumo via WhatsApp (após pedido criado)
  const sendWhatsAppNotification = () => {
    if (!customerInfo || !addressInfo || !orderId) return;

    const whatsappNumber = "5519998229202";

    const selectedPayment = paymentOptions.find((p) => p.method === paymentMethod);
    const actualDiscount = subtotal * (selectedPayment?.discount || 0);
    const finalTotal = subtotal + shippingCost - actualDiscount;

    const orderText = `Olá! Gostaria de finalizar o Pedido #${orderId}.

*Cliente:* ${customerInfo.name}

*Itens:*
${items.map((item) => `- ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`).join("\n")}

*Valor Total:* ${formatPrice(finalTotal)}`;

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
                      {isLoadingShipping ? (
                        <div className="flex items-center justify-center py-8 text-muted-foreground">
                          <Loader2 className="h-6 w-6 animate-spin mr-2" />
                          <span>Calculando frete...</span>
                        </div>
                      ) : (
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
                                {subtotal >= 299 ? (
                                  <span className="text-green-600">Grátis</span>
                                ) : (
                                  formatPrice(option.price)
                                )}
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                      {subtotal >= 299 && (
                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-700 font-medium">
                            Parabéns! Você ganhou frete grátis em compras acima de R$ 299
                          </p>
                        </div>
                      )}
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
                      {isSubmitting ? "Processando pagamento..." : "Pagar com Mercado Pago"}
                      <CreditCard className="h-4 w-4 ml-2" />
                    </Button>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">ou</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-green-50 border-green-500 text-green-700 hover:bg-green-100"
                      size="lg"
                      onClick={handleWhatsAppCheckout}
                      data-testid="button-whatsapp-checkout"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Finalizar via WhatsApp
                    </Button>

                    <div className="text-center text-xs text-muted-foreground mt-4">
                      Pagamento seguro via Mercado Pago ou combine pelo WhatsApp
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
                    {isFreeShipping ? (
                      <span className="text-green-600 font-medium" data-testid="text-checkout-shipping">Grátis</span>
                    ) : (
                      <span className="text-foreground" data-testid="text-checkout-shipping">{formatPrice(shippingCost)}</span>
                    )}
                  </div>
                  {isFreeShipping && (
                    <div className="text-xs text-green-600">Frete grátis em compras acima de R$ 299</div>
                  )}
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