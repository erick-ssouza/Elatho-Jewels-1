import { z } from "zod";

// Product Schema
export interface Product {
  id: number;
  name: string;
  price: number;
  category: "Colares" | "Brincos" | "Anéis" | "Pulseiras";
  description: string;
  image: string;
  variations: string[];
}

export const insertProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  category: z.enum(["Colares", "Brincos", "Anéis", "Pulseiras"]),
  description: z.string().min(1),
  image: z.string(),
  variations: z.array(z.string()),
});

export type InsertProduct = z.infer<typeof insertProductSchema>;

// Cart Item Schema
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  variation: string;
  quantity: number;
}

export const cartItemSchema = z.object({
  productId: z.number(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  variation: z.string(),
  quantity: z.number().min(1),
});

// Order Schema
export interface Order {
  id: number;
  customer: CustomerInfo;
  address: AddressInfo;
  shipping: ShippingInfo;
  payment: PaymentInfo;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: string;
}

export interface CustomerInfo {
  name: string;
  whatsapp: string;
  email: string;
}

export const customerInfoSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  whatsapp: z.string().min(10, "WhatsApp inválido").max(15),
  email: z.string().email("Email inválido"),
});

export interface AddressInfo {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export const addressInfoSchema = z.object({
  cep: z.string().length(8, "CEP deve ter 8 dígitos"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional().default(""),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 letras"),
});

export interface ShippingInfo {
  method: "PAC" | "SEDEX";
  cost: number;
}

export const shippingInfoSchema = z.object({
  method: z.enum(["PAC", "SEDEX"]),
  cost: z.number(),
});

export interface PaymentInfo {
  method: "PIX" | "Crédito" | "Débito";
  discount: number;
}

export const paymentInfoSchema = z.object({
  method: z.enum(["PIX", "Crédito", "Débito"]),
  discount: z.number(),
});

export const createOrderSchema = z.object({
  customer: customerInfoSchema,
  address: addressInfoSchema,
  shipping: shippingInfoSchema,
  payment: paymentInfoSchema,
  items: z.array(cartItemSchema).min(1),
});

export type CreateOrder = z.infer<typeof createOrderSchema>;

// Admin Stats
export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
}

// User type for compatibility
export interface User {
  id: string;
  username: string;
  password: string;
}

export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
