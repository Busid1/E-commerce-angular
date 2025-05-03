import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: "dkyf2lrit",
  api_key: "973877289917381",
  api_secret: "qkv-UdVmw8FbKIbqWMXLvc_axyw"
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