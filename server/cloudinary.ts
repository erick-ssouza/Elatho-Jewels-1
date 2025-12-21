import { v2 as cloudinary } from "cloudinary";

// ========================================
// 🔧 CONFIGURAÇÃO DO CLOUDINARY
// ========================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dddtjacew",
  api_key: process.env.CLOUDINARY_API_KEY || "498636834512271",
  api_secret: process.env.CLOUDINARY_API_SECRET || "vl0f0ZNSrQFTPZZs8-DBHCQLH6s",
});

// ========================================
// 📤 UPLOAD PARA CLOUDINARY
// ========================================

/**
 * Faz upload de um Buffer (arquivo na memória) para o Cloudinary
 * @param buffer - Buffer do arquivo (req.file.buffer)
 * @param filename - Nome original do arquivo
 * @returns Objeto com secure_url, public_id, format, etc.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
): Promise<any> {
  return new Promise((resolve, reject) => {
    // Remove extensão para usar como public_id
    const publicId = filename.replace(/\.[^/.]+$/, "");
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        public_id: publicId,
        folder: "elatho_produtos", // Pasta no Cloudinary
        transformation: [
          { 
            width: 1200, 
            height: 1200, 
            crop: "limit", // Mantém proporção, máx 1200x1200
            quality: "auto:good" // Otimização automática
          },
        ],
        format: "auto", // Converte para WebP quando possível
      },
      (error, result) => {
        if (error) {
          console.error("❌ Erro Cloudinary:", error);
          return reject(error);
        }
        console.log("✅ Upload Cloudinary OK:", result?.secure_url);
        resolve(result);
      },
    );
    
    // Envia o buffer para o stream
    uploadStream.end(buffer);
  });
}

// ========================================
// 🗑️ DELETAR DO CLOUDINARY
// ========================================

/**
 * Deleta uma imagem do Cloudinary pelo Public ID
 * @param publicId - Public ID completo (ex: "elatho_produtos/imagem")
 * @returns Resultado da operação
 */
export async function deleteFromCloudinary(publicId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error("❌ Erro ao deletar:", error);
        return reject(error);
      }
      
      console.log(`🗑️ Imagem deletada: ${publicId}`, result);
      resolve(result);
    });
  });
}

export { cloudinary };