import { Router } from 'express';
import { authenticate, authorize } from '../../auth/middlewares/auth.middleware.js';
import { sanitizeBody, preventMassAssignment } from '../../../shared/middleware/sanitizeBody.js';
import {
  createProduct,
  deleteProduct,
  getCatalogProduct,
  getProduct,
  listCatalogProducts,
  listProducts,
  updateProduct,
} from '../controllers/product.controller.js';
import {
  createProductValidator,
  updateProductValidator,
  productIdValidator,
} from '../validators/product.validators.js';
import {
  getProductMedia,
  uploadProductMedia,
  setPrimaryMedia,
  deleteMedia,
} from '../controllers/productMedia.controller.js';

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Endpoints de gerenciamento de produtos
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Listar todos os produtos
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos
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
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Autenticação necessária
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Obter produto por ID
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags: [Products]
 *     summary: Criar novo produto
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Requisição inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Atualizar produto existente
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Requisição inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Excluir (desativar) produto
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto desativado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

const router = Router();

const PRODUCT_FIELDS = [
  'name',
  'description',
  'price',
  'cost_price',
  'category_id',
  'stock_quantity',
  'is_active',
];

router.get('/catalog', listCatalogProducts);
router.get('/catalog/:id', productIdValidator, getCatalogProduct);

router.use(authenticate, authorize('admin'));

router.get('/', listProducts);
router.get('/:id', productIdValidator, getProduct);
router.post('/', preventMassAssignment, sanitizeBody(PRODUCT_FIELDS), createProductValidator, createProduct);
router.put('/:id', productIdValidator, preventMassAssignment, sanitizeBody(PRODUCT_FIELDS), updateProductValidator, updateProduct);
router.delete('/:id', productIdValidator, deleteProduct);

// Product media routes
router.get('/:id/media', productIdValidator, getProductMedia);
router.post('/:id/media', productIdValidator, uploadProductMedia);
router.patch('/media/:mediaId/set-primary', setPrimaryMedia);
router.delete('/media/:mediaId', deleteMedia);

export default router;
