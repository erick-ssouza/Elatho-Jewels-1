import { pgTable, serial, varchar, text, numeric, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Product Table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  variations: text("variations").array().notNull().default([]),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type ProductRow = typeof products.$inferSelect;

// Product with parsed price for frontend use
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  variations: string[];
}

// Cart Item Schema (client-side only, not stored in DB)
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

// Customer Info
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

// Address Info
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

// Shipping Info
export interface ShippingInfo {
  method: "PAC" | "SEDEX";
  cost: number;
}

export const shippingInfoSchema = z.object({
  method: z.enum(["PAC", "SEDEX"]),
  cost: z.number(),
});

// Payment Info
export interface PaymentInfo {
  method: "PIX" | "Crédito" | "Débito";
  discount: number;
}

export const paymentInfoSchema = z.object({
  method: z.enum(["PIX", "Crédito", "Débito"]),
  discount: z.number(),
});

// Orders Table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customer: jsonb("customer").$type<CustomerInfo>().notNull(),
  address: jsonb("address").$type<AddressInfo>().notNull(),
  shipping: jsonb("shipping").$type<ShippingInfo>().notNull(),
  payment: jsonb("payment").$type<PaymentInfo>().notNull(),
  items: jsonb("items").$type<CartItem[]>().notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 10, scale: 2 }).notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const createOrderSchema = z.object({
  customer: customerInfoSchema,
  address: addressInfoSchema,
  shipping: shippingInfoSchema,
  payment: paymentInfoSchema,
  items: z.array(cartItemSchema).min(1),
});

export type CreateOrder = z.infer<typeof createOrderSchema>;
export type OrderRow = typeof orders.$inferSelect;

// Order with parsed numbers for frontend use
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
  status: string;
  createdAt: Date;
}

// Admin Stats (computed, not stored)
export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
}

// Users Table (for future customer accounts)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 20 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
