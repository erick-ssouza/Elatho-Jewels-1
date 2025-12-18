import {
  products,
  orders,
  type Product,
  type Order,
  type CreateOrder,
  type AdminStats,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sum, sql } from "drizzle-orm";

export interface IStorage {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: {
    name: string;
    price: string;
    category: string;
    description: string;
    image: string;
    variations: string[];
  }): Promise<Product>;
  updateProduct(id: number, product: Partial<{
    name: string;
    price: string;
    category: string;
    description: string;
    image: string;
    variations: string[];
  }>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  getAllOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  createOrder(order: CreateOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;

  getAdminStats(): Promise<AdminStats>;
  seedProducts(): Promise<void>;
}

function parseProduct(row: typeof products.$inferSelect): Product {
  return {
    id: row.id,
    name: row.name,
    price: parseFloat(row.price ?? "0"),
    category: row.category,
    description: row.description,
    image: row.image,
    variations: row.variations ?? [],
  };
}

function parseOrder(row: typeof orders.$inferSelect): Order {
  return {
    id: row.id,
    customer: row.customer,
    address: row.address,
    shipping: row.shipping,
    payment: row.payment,
    items: row.items,
    subtotal: parseFloat(row.subtotal ?? "0"),
    shippingCost: parseFloat(row.shippingCost ?? "0"),
    discount: parseFloat(row.discount ?? "0"),
    total: parseFloat(row.total ?? "0"),
    status: row.status,
    createdAt: row.createdAt,
  };
}

export class DatabaseStorage implements IStorage {
  async getAllProducts(): Promise<Product[]> {
    const result = await db.select().from(products);
    return result.map(parseProduct);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    if (!product) return undefined;
    return parseProduct(product);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const result = await db.select().from(products).where(eq(products.category, category));
    return result.map(parseProduct);
  }

  async createProduct(insertProduct: {
    name: string;
    price: string;
    category: string;
    description: string;
    image: string;
    variations: string[];
  }): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return parseProduct(product);
  }

  async updateProduct(id: number, productData: Partial<{
    name: string;
    price: string;
    category: string;
    description: string;
    image: string;
    variations: string[];
  }>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    if (!product) return undefined;
    return parseProduct(product);
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  }

  async getAllOrders(): Promise<Order[]> {
    const result = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return result.map(parseOrder);
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;
    return parseOrder(order);
  }

  async createOrder(createOrder: CreateOrder): Promise<Order> {
    const subtotal = createOrder.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingCost = createOrder.shipping.cost;
    const discount = createOrder.payment.discount;
    const total = subtotal + shippingCost - discount;

    const [order] = await db
      .insert(orders)
      .values({
        customer: createOrder.customer,
        address: createOrder.address,
        shipping: createOrder.shipping,
        payment: createOrder.payment,
        items: createOrder.items,
        subtotal: subtotal.toFixed(2),
        shippingCost: shippingCost.toFixed(2),
        discount: discount.toFixed(2),
        total: total.toFixed(2),
        status: "pending",
      })
      .returning();

    return parseOrder(order);
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    if (!order) return undefined;
    return parseOrder(order);
  }

  async deleteOrder(id: number): Promise<boolean> {
    const result = await db.delete(orders).where(eq(orders.id, id)).returning();
    return result.length > 0;
  }

  async getAdminStats(): Promise<AdminStats> {
    const [orderStats] = await db
      .select({
        totalOrders: count(),
        totalRevenue: sum(orders.total),
        pendingOrders: sql<number>`count(*) filter (where ${orders.status} = 'pending')`,
      })
      .from(orders);

    const [productStats] = await db.select({ count: count() }).from(products);

    return {
      totalOrders: Number(orderStats?.totalOrders ?? 0),
      totalRevenue: parseFloat(orderStats?.totalRevenue ?? "0"),
      totalProducts: Number(productStats?.count ?? 0),
      pendingOrders: Number(orderStats?.pendingOrders ?? 0),
    };
  }

  async seedProducts(): Promise<void> {
    const existingProducts = await db.select().from(products);
    if (existingProducts.length > 0) return;

    const initialProducts = [
      {
        name: "Colar Lua Crescente",
        price: "289.90",
        category: "Colares",
        description: "Elegante colar com pingente de lua crescente, perfeito para ocasiões especiais. Banho de ouro 18k com acabamento premium e pedras de zircônia que brilham intensamente. Corrente ajustável de 40-45cm.",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Brincos Estrela",
        price: "149.90",
        category: "Brincos",
        description: "Brincos delicados em formato de estrela com design minimalista. Acabamento em ouro 18k com fechamento tarraxa. Ideais para uso diário e compõem looks sofisticados.",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Anel Solitário",
        price: "228.00",
        category: "Anéis",
        description: "Anel solitário clássico com zircônia central de 5mm. Design atemporal que combina com qualquer ocasião. Disponível em diversos tamanhos, do 12 ao 22.",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Pulseira Chain Gold",
        price: "179.90",
        category: "Pulseiras",
        description: "Pulseira de elos clássicos com banho de ouro 18k. Design versátil que pode ser usada sozinha ou combinada com outras peças. Fecho gaveta com trava de segurança.",
        image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Colar Double Layer",
        price: "289.90",
        category: "Colares",
        description: "Colar duplo com correntes de diferentes comprimentos, criando um efeito moderno e sofisticado. Pingentes delicados em cada camada. Ideal para decotes profundos.",
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Brincos Pearl Drop",
        price: "219.90",
        category: "Brincos",
        description: "Brincos elegantes com pérolas sintéticas de alta qualidade. Design clássico que nunca sai de moda. Perfeitos para casamentos, formaturas e eventos especiais.",
        image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Anel Duo Stone",
        price: "199.90",
        category: "Anéis",
        description: "Anel com duas pedras de zircônia em formato toi et moi, simbolizando a união. Design romântico e moderno. Aro ajustável para maior conforto.",
        image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Pulseira Infinity",
        price: "159.90",
        category: "Pulseiras",
        description: "Pulseira com símbolo do infinito cravejado com microzircônias. Representa amor eterno e conexão infinita. Corrente delicada com extensor.",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Colar Celestial",
        price: "319.90",
        category: "Colares",
        description: "Colar com pingentes celestiais: lua, estrela e sol. Peça statement que traz magia e misticismo ao look. Corrente longa de 60cm ajustável.",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Brincos Minimalist",
        price: "129.90",
        category: "Brincos",
        description: "Brincos minimalistas em formato geométrico. Design clean e moderno, perfeitos para o dia a dia no trabalho. Leves e confortáveis para uso prolongado.",
        image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Anel Crown",
        price: "249.90",
        category: "Anéis",
        description: "Anel em formato de coroa cravejado com zircônias. Para quem é rainha em qualquer ambiente. Design exclusivo e marcante.",
        image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
      {
        name: "Pulseira Delicate",
        price: "139.90",
        category: "Pulseiras",
        description: "Pulseira fina e delicada com pequenos cristais ao longo da corrente. Elegância sutil para complementar qualquer produção. Fecho ajustável.",
        image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=500&h=625&fit=crop",
        variations: ["Dourado", "Prateado", "Rosé"],
      },
    ];

    await db.insert(products).values(initialProducts);
  }
}

export const storage = new DatabaseStorage();
