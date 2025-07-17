import axios from 'axios';
import FormData from 'form-data';
import { IMGUR_CLIENT_ID } from '../config.js';

// Interfaces para tipado
interface UploadOptions {
  title?: string;
  description?: string;
  albumId?: string;
}

interface ImgurImageData {
  id: string;
  title: string | null;
  description: string | null;
  datetime: number;
  type: string;
  animated: boolean;
  width: number;
  height: number;
  size: number;
  views: number;
  bandwidth: number;
  vote: string | null;
  favorite: boolean;
  nsfw: boolean | null;
  section: string | null;
  account_url: string | null;
  account_id: number | null;
  is_ad: boolean;
  in_most_viral: boolean;
  has_sound: boolean;
  tags: string[];
  ad_type: number;
  ad_url: string;
  edited: string;
  in_gallery: boolean;
  deletehash: string;
  name: string;
  link: string;
}

interface UploadResult {
  index: number;
  success: boolean;
  error?: string;
  data: ImgurImageData | null;
}

interface FinalResult {
  success: boolean;
  total: number;
  uploaded: number;
  failed: number;
  results: {
    successful: ImgurImageData[];
    failed: Array<{ index: number; error: string }>;
  };
}

type ImageInput = Express.Multer.File;

/**
 * Sube múltiples imágenes a la API de Imgur
 * @param images - Array de imágenes (pueden ser File objects, base64 strings, o URLs)
 * @param options - Opciones adicionales
 * @returns Promesa que resuelve con los datos de todas las imágenes subidas
 */
export async function uploadImages(
  images: ImageInput[],
  options: UploadOptions = {},
): Promise<FinalResult> {
  // Validar parámetros
  if (!Array.isArray(images) || images.length === 0) {
    throw new Error('Se requiere un array de imágenes no vacío');
  }

  if (!IMGUR_CLIENT_ID) {
    throw new Error('Se requiere IMGUR_CLIENT_ID en el archivo config.ts');
  }

  /**
   * Función auxiliar para subir una sola imagen
   * @param image - Imagen a subir
   * @param index - Índice de la imagen para logging
   * @returns Datos de la imagen subida
   */
  async function uploadSingleImage(
    image: ImageInput,
    index: number,
  ): Promise<UploadResult> {
    try {
      console.log(image);

      const form = new FormData();
      form.append('image', image.buffer, {
        filename: image.originalname,
        contentType: image.mimetype,
      });

      if (options.title) {
        form.append('title', `${options.title} ${index + 1}`);
      }

      if (options.description) {
        form.append('description', options.description);
      }

      if (options.albumId) {
        form.append('album', options.albumId);
      }

      const response = await axios.post('https://api.imgur.com/3/image', form, {
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = response.data;

      if (!result.success) {
        throw new Error(
          `Error en la respuesta de Imgur para imagen ${index + 1}: ${result.data?.error || 'Error desconocido'}`,
        );
      }

      return {
        index,
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error(`Error al subir imagen ${index + 1}:`, error);

      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.data?.error || error.message
        : (error as Error).message;

      return {
        index,
        success: false,
        error: errorMessage,
        data: null,
      };
    }
  }

  /**
   * Convierte un archivo a base64
   * @param file - Archivo a convertir
   * @returns Base64 string
   */
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  try {
    console.log(`Iniciando subida de ${images.length} imágenes a Imgur...`);

    // Crear las promesas para todas las imágenes
    const uploadPromises = images.map((image, index) =>
      uploadSingleImage(image, index),
    );

    // Esperar a que todas las subidas se completen
    const results = await Promise.all(uploadPromises);

    // Separar resultados exitosos de los fallidos
    const successful = results.filter(
      (result): result is UploadResult & { success: true } => result.success,
    );
    const failed = results.filter(
      (result): result is UploadResult & { success: false } => !result.success,
    );

    console.log(
      `Subida completada: ${successful.length} exitosas, ${failed.length} fallidas`,
    );

    // Retornar los resultados
    return {
      success: failed.length === 0,
      total: images.length,
      uploaded: successful.length,
      failed: failed.length,
      results: {
        successful: successful.map((r) => r.data!),
        failed: failed.map((r) => ({ index: r.index, error: r.error! })),
      },
    };
  } catch (error) {
    console.error('Error general en la subida de imágenes:', error);
    throw new Error(`Error al subir imágenes: ${(error as Error).message}`);
  }
}

async function deleteImage(deleteHash: string) {
  let res = await axios.delete(`https://api.imgur.com/3/image/${deleteHash}`, {
    headers: {
      Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
    },
  });

  return res.data;
}

export { type UploadOptions, type ImgurImageData, type FinalResult };
