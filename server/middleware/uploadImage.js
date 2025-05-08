import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function uploadImage(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath.path, {
      folder: 'products', // Opcional: organiza las imágenes en una carpeta específica
    });
    return result.secure_url; // URL segura de la imagen subida
  } catch (error) {
    console.error('Error al subir imagen a Cloudinary:', error);
    throw new Error('No se pudo subir la imagen');
  }
}