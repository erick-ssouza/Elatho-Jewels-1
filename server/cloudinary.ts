// 📁 server/cloudinary.ts
// Configuração do Cloudinary para upload de imagens

import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dddtjacew',
  api_key: process.env.CLOUDINARY_API_KEY || '498636834512271',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'vl0f0ZNSrQFTPZZs8-DBHCQLH6s',
});

export { cloudinary };