// 🚨 VERSÃO COM DEBUG DETALHADO
// Adicione esta rota TEMPORARIAMENTE para ver o erro exato

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

    // Retornar erro detalhado para o frontend
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