import type { VercelRequest, VercelResponse } from '@vercel/node'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'

export const config = {
  api: {
    bodyParser: false,
  },
}

const upload = multer({
  storage: multer.memoryStorage(),
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  upload.single('image')(req as any, res as any, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message })
    }

    try {
      const file = (req as any).file
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(file.buffer)
      })

      return res.status(200).json({
        url: result.secure_url,
        public_id: result.public_id,
      })
    } catch (error) {
      console.error('UPLOAD ERROR:', error)
      return res.status(500).json({ error: 'Upload failed' })
    }
  })
}
