import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../../../shared/errors/AppError.js';
import { getProductMediaById, getProductMediaByProductId, createProductMedia, updateProductMedia, deleteProductMedia, setPrimaryMedia as setPrimaryMediaRepo } from '../repositories/productMedia.repository.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Apenas imagens e vídeos são aceitos.'), false);
    }
  },
});

export async function getProductMedia(req, res, next) {
  try {
    const { id } = req.params;
    const media = await getProductMediaByProductId(id);
    res.json(media);
  } catch (error) {
    next(error);
  }
}

export async function uploadProductMedia(req, res, next) {
  try {
    const { id } = req.params;
    
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return next(new AppError(err.message, 400));
      }

      if (!req.file) {
        return next(new AppError('Nenhum arquivo enviado', 400));
      }

      try {
        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'saborfit',
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          ).end(req.file.buffer);
        });

        // Determine resource type
        const resourceType = result.resource_type === 'video' ? 'video' : 'image';

        // Get current max sort_order for this product
        const existingMedia = await getProductMediaByProductId(id);
        const maxSortOrder = existingMedia.length > 0 
          ? Math.max(...existingMedia.map(m => m.sort_order || 0))
          : 0;

        // Save to database
        const mediaData = {
          produto_id: id,
          public_id: result.public_id,
          secure_url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          resource_type: resourceType,
          sort_order: maxSortOrder + 1,
          is_primary: existingMedia.length === 0, // First media is primary
        };

        const savedMedia = await createProductMedia(mediaData);

        res.status(201).json(savedMedia);
      } catch (error) {
        next(error);
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function setPrimaryMedia(req, res, next) {
  try {
    const { mediaId } = req.params;
    
    const media = await getProductMediaById(mediaId);
    if (!media) {
      return next(new AppError('Mídia não encontrada', 404));
    }

    await setPrimaryMediaRepo(mediaId, media.produto_id);

    res.json({ message: 'Imagem principal definida com sucesso' });
  } catch (error) {
    next(error);
  }
}

export async function deleteMedia(req, res, next) {
  try {
    const { mediaId } = req.params;
    
    const media = await getProductMediaById(mediaId);
    if (!media) {
      return next(new AppError('Mídia não encontrada', 404));
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(media.public_id);

    // Delete from database
    await deleteProductMedia(mediaId);

    res.json({ message: 'Mídia excluída com sucesso' });
  } catch (error) {
    next(error);
  }
}
