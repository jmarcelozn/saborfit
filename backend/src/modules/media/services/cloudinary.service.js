import { v2 as cloudinary } from 'cloudinary';
import { env } from '../../../config/env.js';
import { AppError } from '../../../shared/errors/AppError.js';

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

export class CloudinaryService {
  async uploadImage(file, options = {}) {
    if (!file) {
      throw new AppError('Arquivo não fornecido', 400);
    }

    if (!env.cloudinary.cloudName) {
      throw new AppError('Cloudinary não configurado', 500);
    }

    const uploadOptions = {
      folder: env.cloudinary.folder,
      resource_type: 'image',
      ...options,
    };

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          reject(new AppError('Erro ao fazer upload da imagem', 500));
        } else {
          resolve({
            publicId: result.public_id,
            url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          });
        }
      }).end(file.buffer);
    });
  }

  async deleteImage(publicId) {
    if (!publicId) {
      throw new AppError('Public ID não fornecido', 400);
    }

    if (!env.cloudinary.cloudName) {
      throw new AppError('Cloudinary não configurado', 500);
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(new AppError('Erro ao deletar imagem', 500));
        } else {
          resolve(result);
        }
      });
    });
  }

  async uploadMultipleImages(files, options = {}) {
    if (!files || files.length === 0) {
      throw new AppError('Arquivos não fornecidos', 400);
    }

    const uploadPromises = files.map((file) =>
      this.uploadImage(file, options)
    );

    return Promise.all(uploadPromises);
  }
}

export default new CloudinaryService();
