import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createOrderSchema, insertProductSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";
import { setupAuth, requireAdmin } from "./auth";
import multer from "multer";
import path from "path";
import fs from "fs";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ========================================
  // 📤 CONFIGURAÇÃO DO UPLOAD DE IMAGENS
  // ========================================

  // Criar pasta de uploads se não existir
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Configurar Multer para upload
  const storage_multer = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      // Nome único: timestamp + nome original
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${name}-${uniqueSuffix}${ext}`);
    },
  });

  // Filtro de tipos de arquivo permitidos
  const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de arquivo não suportado. Use JPG, PNG ou WEBP."));
    }
  };

  const upload = multer({
    storage: storage_multer,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB máximo
    },
  });

  // ========================================
  // 📤 ROTAS DE UPLOAD
  // ========================================

  // Upload de imagem (admin)
  app.post("/api/upload", requireAdmin, upload.single("image"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }

      // URL da imagem
      const imageUrl = `/uploads/${req.file.filename}`;

      res.json({
        success: true,
        url: imageUrl,
        filename: req.file.filename,
        size: req.file.size,
      });
    } catch (error: any) {
      console.error("Erro no upload:", error);
      res.status(500).json({ error: error.message || "Erro ao fazer upload" });
    }
  });

  // Deletar imagem (admin)
  app.delete("/api/upload/:filename", requireAdmin, (req, res) => {
    try {
      const filename = req.params.filename;
      const filepath = path.join(uploadsDir, filename);

      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        res.json({ success: true, message: "Imagem deletada" });
      } else {
        res.status(404).json({ error: "Imagem não encontrada" });
      }
    } catch (error: any) {
      console.error("Erro ao deletar:", error);
      res.status(500).json({ error: error.message || "Erro ao deletar imagem" });
    }
  });

  // ========================================
  // 🔽 SUAS ROTAS ORIGINAIS
  // ========================================

  // Setup authentication
  setupAuth(app);

  // Seed products and testimonials on startup
  await storage.seedProducts();
  await storage.seedTestimonials();

  // Get all products
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Get products by category
  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Create product (admin)
  app.post("/api/products", requireAdmin, async (req, res) => {
    try {
      const result = insertProductSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ error: validationError.message });
      }

      const productData = {
        ...result.data,
        variations: result.data.variations ?? [],
      };
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  // Update product (admin)
  app.patch("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const result = insertProductSchema.partial().safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ error: validationError.message });
      }

      const updateData: Record<string, unknown> = { ...result.data };
      if (result.data.variations !== undefined) {
        updateData.variations = result.data.variations;
      }
      const product = await storage.updateProduct(id, updateData as Parameters<typeof storage.updateProduct>[1]);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  // Delete product (admin)
  app.delete("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Get all orders (admin)
  app.get("/api/orders", requireAdmin, async (_req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const result = createOrderSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ error: validationError.message });
      }

      const order = await storage.createOrder(result.data);
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Update order status (admin)
  app.patch("/api/orders/:id/status", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid order ID" });
      }

      const statusSchema = z.object({
        status: z.enum(["pending", "processing", "shipped", "delivered"]),
      });

      const result = statusSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ error: validationError.message });
      }

      const order = await storage.updateOrderStatus(id, result.data.status);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // Delete order (admin)
  app.delete("/api/orders/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid order ID" });
      }

      const deleted = await storage.deleteOrder(id);
      if (!deleted) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ error: "Failed to delete order" });
    }
  });

  // Get admin stats
  app.get("/api/admin/stats", requireAdmin, async (_req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Get user's orders
  app.get("/api/my-orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const orders = await storage.getOrdersByUserId(req.user!.id);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Get all users (admin)
  app.get("/api/admin/users", requireAdmin, async (_req, res) => {
    try {
      const users = await storage.getAllUsers();
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Delete user (admin)
  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const deleted = await storage.deleteUser(id);
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Contact form - saves to database
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, whatsapp, subject, message } = req.body;

      if (!name || !email || !whatsapp || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const savedMessage = await storage.createMessage({ name, email, whatsapp, subject, message });
      console.log("Contact form saved:", savedMessage.id);

      res.json({ success: true, message: "Contact form received", id: savedMessage.id });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.status(500).json({ error: "Failed to process contact form" });
    }
  });

  // Admin messages routes
  app.get("/api/admin/messages", requireAdmin, async (_req, res) => {
    try {
      const messagesList = await storage.getAllMessages();
      res.json(messagesList);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.patch("/api/admin/messages/:id/read", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid message ID" });
      }
      const updated = await storage.markMessageAsRead(id);
      if (!updated) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ error: "Failed to update message" });
    }
  });

  app.delete("/api/admin/messages/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid message ID" });
      }
      const deleted = await storage.deleteMessage(id);
      if (!deleted) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ error: "Failed to delete message" });
    }
  });

  // Testimonials routes
  app.get("/api/testimonials", async (_req, res) => {
    try {
      const testimonialsList = await storage.getAllTestimonials();
      res.json(testimonialsList);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      const { name, rating, text } = req.body;
      if (!name || !rating || !text) {
        return res.status(400).json({ error: "Name, rating, and text are required" });
      }
      const testimonial = await storage.createTestimonial({ name, rating: rating.toString(), text });
      res.status(201).json(testimonial);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(500).json({ error: "Failed to create testimonial" });
    }
  });

  app.patch("/api/testimonials/:id/response", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { response } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid testimonial ID" });
      }

      if (!response) {
        return res.status(400).json({ error: "Response is required" });
      }

      const updated = await storage.updateTestimonialResponse(id, response);
      if (!updated) {
        return res.status(404).json({ error: "Testimonial not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error updating testimonial response:", error);
      res.status(500).json({ error: "Failed to update testimonial response" });
    }
  });

  app.delete("/api/testimonials/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid testimonial ID" });
      }

      const deleted = await storage.deleteTestimonial(id);
      if (!deleted) {
        return res.status(404).json({ error: "Testimonial not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ error: "Failed to delete testimonial" });
    }
  });

  return httpServer;
}