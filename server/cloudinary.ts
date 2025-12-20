import { v2 as cloudinary } from "cloudinary";

// Configuração do Cloudinary
// As chaves devem vir das variáveis de ambiente da Vercel
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dddtjacew",
  api_key: process.env.CLOUDINARY_API_KEY || "498636834512271",
  api_secret: process.env.CLOUDINARY_API_SECRET, // Configure isso na Vercel!
});

/**
 * Faz upload de um Buffer (arquivo na memória) para o Cloudinary
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
): Promise<any> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        public_id: filename.replace(/\.[^/.]+$/, ""), // Remove extensão para usar como ID
        folder: "elatho_produtos", // Organiza em uma pasta
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    uploadStream.end(buffer);
  });
}

/**
 * Deleta uma imagem do Cloudinary pelo Public ID
 */
export async function deleteFromCloudinary(publicId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // Se o ID vier com pasta (ex: elatho_produtos/imagem), o Cloudinary precisa disso
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
}

export { cloudinary };
