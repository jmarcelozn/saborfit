import { Router } from 'express';
import multer from 'multer';
import { authenticate, authorize } from '../../auth/middlewares/auth.middleware.js';
import {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
} from '../controllers/media.controller.js';
import { deleteImageValidator } from '../validators/media.validators.js';

const router = Router();
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
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Apenas imagens são aceitas.'), false);
    }
  },
});

/**
 * @swagger
 * tags:
 *   - name: Media
 *     description: Endpoints de upload e gerenciamento de mídias
 */

/**
 * @swagger
 * /api/media/upload:
 *   post:
 *     tags: [Media]
 *     summary: Fazer upload de uma imagem
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Imagem enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     publicId:
 *                       type: string
 *                     url:
 *                       type: string
 *                     width:
 *                       type: integer
 *                     height:
 *                       type: integer
 *                     format:
 *                       type: string
 *                     bytes:
 *                       type: integer
 *       400:
 *         description: Requisição inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/media/upload-multiple:
 *   post:
 *     tags: [Media]
 *     summary: Fazer upload de múltiplas imagens
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Imagens enviadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       publicId:
 *                         type: string
 *                       url:
 *                         type: string
 *                       width:
 *                         type: integer
 *                       height:
 *                         type: integer
 *                       format:
 *                         type: string
 *                       bytes:
 *                         type: integer
 *       400:
 *         description: Requisição inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/media/delete:
 *   post:
 *     tags: [Media]
 *     summary: Deletar uma imagem
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               publicId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Imagem deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Requisição inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.use(authenticate, authorize('admin'));

router.post('/upload', upload.single('file'), uploadImage);
router.post('/upload-multiple', upload.array('files', 10), uploadMultipleImages);
router.post('/delete', deleteImageValidator, deleteImage);

export default router;
