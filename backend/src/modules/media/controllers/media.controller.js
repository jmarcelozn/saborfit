import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.js';
import cloudinaryService from '../services/cloudinary.service.js';

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new Error('Nenhum arquivo fornecido');
  }

  const result = await cloudinaryService.uploadImage(req.file);

  return successResponse(res, result, 'Imagem enviada com sucesso', 201);
});

export const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new Error('Nenhum arquivo fornecido');
  }

  const results = await cloudinaryService.uploadMultipleImages(req.files);

  return successResponse(res, results, 'Imagens enviadas com sucesso', 201);
});

export const deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.body;

  if (!publicId) {
    throw new Error('Public ID não fornecido');
  }

  await cloudinaryService.deleteImage(publicId);

  return successResponse(res, null, 'Imagem deletada com sucesso');
});
