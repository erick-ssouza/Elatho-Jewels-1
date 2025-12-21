import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { createOrderSchema, insertProductSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";
import { setupAuth, requireAdmin } from "./auth";
import multer from "multer";
import { uploadToCloudinary, deleteFromCloudinary } from "./cloudinary";

// ✅ CORRIGIDO: app primeiro, httpServer depois
export async function registerRoutes(
  app: Express,
  httpServer: Server
): Promise<Server> {

  // ========================================
  // 📤 CONFIGURAÇÃO DO UPLOAD (MEMORY STORAGE)
  // ========================================

  const storage_multer = multer.memoryStorage();

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
      fileSize: 4.5 * 1024 * 1024,
    },
  });

  // ========================================
  // 📤 ROTA DE UPLOAD COM DEBUG COMPLETO
  // ========================================

  app.post("/api/upload", requireAdmin, upload.single("image"), async (req, res) => {
    try {
      console.log("========================================");
      console.log("🔍 DEBUG - Início do upload");
      console.log("========================================");

      // ✅ 1. Verificar se arquivo foi enviado
      if (!req.file) {
        console.error("❌ Nenhum arquivo recebido");
        return res.status(400).json({ 
          error: "Nenhum arquivo enviado",
          debug: "req.file está undefined"
        });
      }

      console.log("✅ Arquivo recebido:");
      console.log("  - Nome:", req.file.originalname);
      console.log("  - Tamanho:", (req.file.size / 1024).toFixed(2), "KB");
      console.log("  - Tipo:", req.file.mimetype);

      // ✅ 2. Verificar configuração do Cloudinary
      console.log("\n🔍 Verificando Cloudinary:");
      console.log("  - Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME || "dddtjacew");
      console.log("  - API Key:", process.env.CLOUDINARY_API_KEY ? "✅ Configurada" : "❌ NÃO CONFIGURADA");
      console.log("  - API Secret:", process.env.CLOUDINARY_API_SECRET ? "✅ Configurada" : "❌ NÃO CONFIGURADA");

      // ✅ 3. Tentar fazer upload
      console.log("\n📤 Iniciando upload para Cloudinary...");

      const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);

      console.log("✅ Upload bem-sucedido!");
      console.log("  - URL:", result.secure_url);
      console.log("  - Public ID:", result.public_id);
      console.log("========================================");

      res.json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        filename: req.file.originalname,
        size: result.bytes,
        format: result.format,
        width: result.width,
        height: result.height,
      });

    } catch (error: any) {
      console.error("========================================");
      console.error("❌ ERRO DETALHADO:");
      console.error("========================================");
      console.error("Mensagem:", error.message);
      console.error("Stack:", error.stack);
      console.error("Objeto completo:", JSON.stringify(error, null, 2));
      console.error("========================================");

      res.status(500).json({ 
        error: error.message || "Erro ao fazer upload",
        errorType: error.name,
        errorDetails: error.toString(),
        cloudinaryConfig: {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME ? "✅" : "❌",
          apiKey: process.env.CLOUDINARY_API_KEY ? "✅" : "❌",
          apiSecret: process.env.CLOUDINARY_API_SECRET ? "✅" : "❌",
        },
        debug: true
      });
    }
  });

  // ✅ Deletar imagem
  app.delete("/api/upload/:publicId(*)", requireAdmin, async (req, res) => {
    try {
      const publicId = req.params.publicId;

      if (!publicId) {
        return res.status(400).json({ error: "Public ID não informado" });
      }

      console.log(`🗑️ Deletando imagem: ${publicId}`);

      const result = await deleteFromCloudinary(publicId);

      if (result.result === "ok" || result.result === "not found") {
        res.json({ 
          success: true, 
          message: "Imagem deletada do Cloudinary",
          result: result.result
        });
      } else {
        res.status(500).json({ error: "Erro ao deletar imagem" });
      }

    } catch (error: any) {
      console.error("❌ Erro ao deletar:", error);
      res.status(500).json({ 
        error: error.message || "Erro ao deletar imagem" 
      });
    }
  });

  // ========================================
  // 🔽 ROTAS ORIGINAIS
  // ========================================

  setupAuth(app);

  await storage.seedProducts();
  await storage.seedTestimonials();

  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

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

  app.get("/api/orders", requireAdmin, async (_req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

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

  app.get("/api/admin/stats", requireAdmin, async (_req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

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