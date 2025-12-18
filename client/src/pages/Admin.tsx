import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Package, DollarSign, ShoppingCart, TrendingUp, Plus, Edit2, Trash2, Eye, EyeOff, LogOut, Search, Calendar, X, Save } from 'lucide-react';
import type { Product, Order, AdminStats } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
};

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  processing: 'Processando',
  shipped: 'Enviado',
  delivered: 'Entregue',
};

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'produtos' | 'pedidos'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: 'Anéis',
    description: '',
    image: '',
    variations: ['Dourado', 'Prateado', 'Rosé'],
  });

  const { toast } = useToast();

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    enabled: authenticated,
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
    enabled: authenticated,
  });

  const { data: stats } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    enabled: authenticated,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest('PATCH', `/api/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({ title: 'Status atualizado com sucesso' });
    },
    onError: () => {
      toast({ title: 'Erro ao atualizar status', variant: 'destructive' });
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: typeof productForm) => {
      await apiRequest('POST', '/api/products', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      setShowProductModal(false);
      resetProductForm();
      toast({ title: 'Produto criado com sucesso' });
    },
    onError: () => {
      toast({ title: 'Erro ao criar produto', variant: 'destructive' });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof productForm }) => {
      await apiRequest('PATCH', `/api/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setShowProductModal(false);
      resetProductForm();
      toast({ title: 'Produto atualizado com sucesso' });
    },
    onError: () => {
      toast({ title: 'Erro ao atualizar produto', variant: 'destructive' });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({ title: 'Produto excluído com sucesso' });
    },
    onError: () => {
      toast({ title: 'Erro ao excluir produto', variant: 'destructive' });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/orders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({ title: 'Pedido excluído com sucesso' });
    },
    onError: () => {
      toast({ title: 'Erro ao excluir pedido', variant: 'destructive' });
    },
  });

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: '',
      category: 'Anéis',
      description: '',
      image: '',
      variations: ['Dourado', 'Prateado', 'Rosé'],
    });
    setEditingProduct(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Elatho@2025!Admin') {
      setAuthenticated(true);
      setPassword('');
    } else {
      toast({ title: 'Senha incorreta', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    window.location.href = '/';
  };

  const openNewProductModal = () => {
    resetProductForm();
    setShowProductModal(true);
  };

  const openEditProductModal = (product: Product) => {
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      image: product.image,
      variations: product.variations,
    });
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: productForm });
    } else {
      createProductMutation.mutate(productForm);
    }
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleDeleteOrder = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
      deleteOrderMutation.mutate(id);
    }
  };

  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customer.whatsapp.includes(searchTerm);
    const matchesStatus = statusFilter === 'todos' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 to-purple-900 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="bg-pink-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-pink-600" />
            </div>
            <CardTitle className="text-2xl">Painel Admin</CardTitle>
            <p className="text-muted-foreground">Elatho Jewels</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha de Acesso</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha"
                    required
                    data-testid="input-admin-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" data-testid="button-admin-login">
                Entrar no Painel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLoading = productsLoading || ordersLoading;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-pink-600" />
            <div>
              <h1 className="text-xl font-bold">Painel Admin</h1>
              <p className="text-sm text-muted-foreground">Elatho Jewels</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} data-testid="button-admin-logout">
            <LogOut className="w-5 h-5 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-8 flex-wrap">
            {(['dashboard', 'produtos', 'pedidos'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-medium border-b-2 transition capitalize ${
                  activeTab === tab
                    ? 'border-pink-600 text-pink-600'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                data-testid={`tab-${tab}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="text-muted-foreground text-sm">Total de Vendas</span>
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold">{formatPrice(stats?.totalRevenue ?? 0)}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="text-muted-foreground text-sm">Pedidos Pendentes</span>
                        <ShoppingCart className="w-5 h-5 text-orange-600" />
                      </div>
                      <p className="text-2xl font-bold">{stats?.pendingOrders ?? 0}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="text-muted-foreground text-sm">Produtos</span>
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold">{stats?.totalProducts ?? 0}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="text-muted-foreground text-sm">Ticket Médio</span>
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold">
                        {formatPrice(
                          stats && stats.totalOrders > 0
                            ? stats.totalRevenue / stats.totalOrders
                            : 0
                        )}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <Calendar className="w-5 h-5 text-pink-600" />
                    <CardTitle>Pedidos Recentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">Nenhum pedido ainda</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Cliente</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Data</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Valor</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.slice(0, 5).map((order) => (
                              <tr key={order.id} className="border-b hover:bg-muted/50">
                                <td className="px-4 py-3 text-sm">{order.customer.name}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                  {formatDate(order.createdAt)}
                                </td>
                                <td className="px-4 py-3 text-sm font-semibold">
                                  {formatPrice(order.total)}
                                </td>
                                <td className="px-4 py-3">
                                  <Badge className={statusColors[order.status] || 'bg-gray-100 text-gray-800'}>
                                    {statusLabels[order.status] || order.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'produtos' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
                  <Button onClick={openNewProductModal} data-testid="button-new-product">
                    <Plus className="w-5 h-5 mr-2" />
                    Novo Produto
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden" data-testid={`card-product-${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                        <p className="text-lg font-bold text-pink-600 mb-3">
                          {formatPrice(product.price)}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => openEditProductModal(product)}
                            className="flex-1"
                            data-testid={`button-edit-product-${product.id}`}
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex-1"
                            data-testid={`button-delete-product-${product.id}`}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'pedidos' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Gerenciar Pedidos</h2>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4 flex-wrap">
                      <div className="flex-1 min-w-[200px] relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Buscar por cliente ou WhatsApp..."
                          className="pl-10"
                          data-testid="input-search-orders"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
                          <SelectValue placeholder="Filtrar por status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos Status</SelectItem>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="processing">Processando</SelectItem>
                          <SelectItem value="shipped">Enviado</SelectItem>
                          <SelectItem value="delivered">Entregue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {filteredOrders.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      Nenhum pedido encontrado
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <Card key={order.id} data-testid={`card-order-${order.id}`}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                            <div>
                              <h3 className="font-semibold">{order.customer.name}</h3>
                              <p className="text-sm text-muted-foreground">WhatsApp: {order.customer.whatsapp}</p>
                              <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-pink-600">
                                {formatPrice(order.total)}
                              </p>
                              <Select
                                value={order.status}
                                onValueChange={(value) => handleStatusChange(order.id, value)}
                              >
                                <SelectTrigger className="mt-2 w-[150px]" data-testid={`select-status-${order.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pendente</SelectItem>
                                  <SelectItem value="processing">Processando</SelectItem>
                                  <SelectItem value="shipped">Enviado</SelectItem>
                                  <SelectItem value="delivered">Entregue</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <p className="text-sm text-muted-foreground mb-2">
                              <strong>Endereço:</strong> {order.address.street}, {order.address.number}
                              {order.address.complement && ` - ${order.address.complement}`}, {order.address.neighborhood}, {order.address.city} - {order.address.state}, CEP: {order.address.cep}
                            </p>
                            <p className="text-sm text-muted-foreground mb-2">
                              <strong>Frete:</strong> {order.shipping.method} - {formatPrice(order.shipping.cost)}
                            </p>
                            <p className="text-sm text-muted-foreground mb-2">
                              <strong>Pagamento:</strong> {order.payment.method}
                              {order.discount > 0 && ` (Desconto: ${formatPrice(order.discount)})`}
                            </p>
                            <h4 className="text-sm font-semibold mt-3 mb-2">Produtos:</h4>
                            <ul className="space-y-1">
                              {order.items.map((item, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex justify-between">
                                  <span>{item.name} ({item.variation}) x{item.quantity}</span>
                                  <span className="font-semibold">
                                    {formatPrice(item.price * item.quantity)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button
                              onClick={() => window.open(`https://wa.me/55${order.customer.whatsapp.replace(/\D/g, '')}`, '_blank')}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              data-testid={`button-contact-${order.id}`}
                            >
                              Contatar no WhatsApp
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteOrder(order.id)}
                              data-testid={`button-delete-order-${order.id}`}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Excluir
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowProductModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Ex: Colar Lua Crescente"
                  data-testid="input-product-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="text"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="Ex: 289.90"
                    data-testid="input-product-price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={productForm.category}
                    onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                  >
                    <SelectTrigger data-testid="select-product-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Colares">Colares</SelectItem>
                      <SelectItem value="Brincos">Brincos</SelectItem>
                      <SelectItem value="Anéis">Anéis</SelectItem>
                      <SelectItem value="Pulseiras">Pulseiras</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Descrição detalhada do produto..."
                  rows={4}
                  data-testid="input-product-description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL da Imagem</Label>
                <Input
                  id="image"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://..."
                  data-testid="input-product-image"
                />
                {productForm.image && (
                  <img
                    src={productForm.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md mt-2"
                  />
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowProductModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleSaveProduct} className="flex-1" data-testid="button-save-product">
                  <Save className="w-4 h-4 mr-2" />
                  {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
