import type {
  Product,
  InsertProduct,
  Order,
  CreateOrder,
  AdminStats,
} from "@shared/schema";

export interface IStorage {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  getAllOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  createOrder(order: CreateOrder): Promise<Order>;
  
  getAdminStats(): Promise<AdminStats>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private productIdCounter: number;
  private orderIdCounter: number;

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.productIdCounter = 1;
    this.orderIdCounter = 1;
    this.initializeProducts();
  }

  private initializeProducts() {
    const initialProducts: Omit<Product, "id">[] = [
      {
        name: "Colar Lua Crescente",
        price: 289.90,
        category: "Colares",
        description: "Elegante colar com pingente de lua crescente, perfeito para ocasiões especiais. Banho de ouro 18k com acabamento premium e pedras de zircônia que brilham intensamente. Corrente ajustável de 40-45cm.",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Brincos Estrela",
        price: 149.90,
        category: "Brincos",
        description: "Brincos delicados em formato de estrela com design minimalista. Acabamento em ouro 18k com fechamento tarraxa. Ideais para uso diário e compõem looks sofisticados.",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Anel Solitário",
        price: 228.00,
        category: "Anéis",
        description: "Anel solitário clássico com zircônia central de 5mm. Design atemporal que combina com qualquer ocasião. Disponível em diversos tamanhos, do 12 ao 22.",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Pulseira Chain Gold",
        price: 179.90,
        category: "Pulseiras",
        description: "Pulseira de elos clássicos com banho de ouro 18k. Design versátil que pode ser usada sozinha ou combinada com outras peças. Fecho gaveta com trava de segurança.",
        image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Colar Double Layer",
        price: 289.90,
        category: "Colares",
        description: "Colar duplo com correntes de diferentes comprimentos, criando um efeito moderno e sofisticado. Pingentes delicados em cada camada. Ideal para decotes profundos.",
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Brincos Pearl Drop",
        price: 219.90,
        category: "Brincos",
        description: "Brincos elegantes com pérolas sintéticas de alta qualidade. Design clássico que nunca sai de moda. Perfeitos para casamentos, formaturas e eventos especiais.",
        image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Anel Duo Stone",
        price: 199.90,
        category: "Anéis",
        description: "Anel com duas pedras de zircônia em formato toi et moi, simbolizando a união. Design romântico e moderno. Aro ajustável para maior conforto.",
        image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Pulseira Infinity",
        price: 159.90,
        category: "Pulseiras",
        description: "Pulseira com símbolo do infinito cravejado com microzircônias. Representa amor eterno e conexão infinita. Corrente delicada com extensor.",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Colar Celestial",
        price: 319.90,
        category: "Colares",
        description: "Colar com pingentes celestiais: lua, estrela e sol. Peça statement que traz magia e misticismo ao look. Corrente longa de 60cm ajustável.",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Brincos Minimalist",
        price: 129.90,
        category: "Brincos",
        description: "Brincos minimalistas em formato geométrico. Design clean e moderno, perfeitos para o dia a dia no trabalho. Leves e confortáveis para uso prolongado.",
        image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Anel Crown",
        price: 249.90,
        category: "Anéis",
        description: "Anel em formato de coroa cravejado com zircônias. Para quem é rainha em qualquer ambiente. Design exclusivo e marcante.",
        image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Pulseira Delicate",
        price: 139.90,
        category: "Pulseiras",
        description: "Pulseira fina e delicada com pequenos cristais ao longo da corrente. Elegância sutil para complementar qualquer produção. Fecho ajustável.",
        image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
    ];

    for (const product of initialProducts) {
      const id = this.productIdCounter++;
      this.products.set(id, { ...product, id });
    }
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(createOrder: CreateOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const subtotal = createOrder.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const order: Order = {
      id,
      customer: createOrder.customer,
      address: createOrder.address,
      shipping: createOrder.shipping,
      payment: createOrder.payment,
      items: createOrder.items,
      subtotal,
      shippingCost: createOrder.shipping.cost,
      discount: createOrder.payment.discount,
      total: subtotal + createOrder.shipping.cost - createOrder.payment.discount,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getAdminStats(): Promise<AdminStats> {
    const orders = Array.from(this.orders.values());
    return {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      totalProducts: this.products.size,
      pendingOrders: orders.filter((order) => order.status === "pending").length,
    };
  }
}

export const storage = new MemStorage();
