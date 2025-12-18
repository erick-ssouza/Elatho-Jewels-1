import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ChevronLeft, ShoppingBag, LogOut } from "lucide-react";
import type { Order } from "@shared/schema";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  processing: "Processando",
  shipped: "Enviado",
  delivered: "Entregue",
};

export default function MeusPedidos() {
  const { user, logoutMutation } = useAuth();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/my-orders"],
    enabled: !!user,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-pink-600" />
              <h1 className="text-xl font-semibold">Meus Pedidos</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Nenhum pedido ainda</h2>
              <p className="text-muted-foreground mb-4">
                Você ainda não fez nenhum pedido. Que tal explorar nossas joias?
              </p>
              <Link href="/">
                <Button data-testid="button-explore-products">Ver Produtos</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} data-testid={`card-order-${order.id}`}>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-800"}>
                    {statusLabels[order.status] || order.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.variation} - Qtd: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t mt-4 pt-4 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Frete ({order.shipping.method})
                      </span>
                      <span>{formatPrice(order.shippingCost)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Desconto PIX</span>
                        <span>-{formatPrice(order.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg pt-2">
                      <span>Total</span>
                      <span className="text-pink-600">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  <div className="border-t mt-4 pt-4 text-sm text-muted-foreground">
                    <p>
                      <strong>Entrega:</strong> {order.address.street}, {order.address.number}
                      {order.address.complement && ` - ${order.address.complement}`}
                    </p>
                    <p>
                      {order.address.neighborhood}, {order.address.city} - {order.address.state}
                    </p>
                    <p>CEP: {order.address.cep}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
