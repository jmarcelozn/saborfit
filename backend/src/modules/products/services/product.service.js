import crypto from 'node:crypto';
import { AppError } from '../../../../shared/errors/AppError.js';
import productRepository from '../repositories/product.repository.js';

export class ProductService {
  async listProducts() {
    return productRepository.findAll();
  }

  async getProduct(id) {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new AppError('Produto não encontrado', 404);
    }

    return product;
  }

  generateSku() {
    const key = crypto.randomUUID().split('-')[0].toUpperCase();
    return `SABORFIT-${key}`;
  }

  async createProduct(payload) {
    let sku = this.generateSku();
    let existingProduct = await productRepository.findBySku(sku);
    let attempts = 0;

    while (existingProduct && attempts < 10) {
      sku = this.generateSku();
      existingProduct = await productRepository.findBySku(sku);
      attempts += 1;
    }

    if (existingProduct) {
      throw new AppError('Não foi possível gerar um SKU único para o produto', 500);
    }

    return productRepository.create({ ...payload, sku });
  }

  async updateProduct(id, payload) {
    const currentProduct = await this.getProduct(id);

    if (payload.sku && payload.sku !== currentProduct.sku) {
      const existingProduct = await productRepository.findBySku(payload.sku);
      if (existingProduct && existingProduct.id !== currentProduct.id) {
        throw new AppError('SKU já está em uso', 409);
      }
    }

    return productRepository.update(id, payload);
  }

  async deleteProduct(id) {
    await this.getProduct(id);
    return productRepository.deactivateById(id);
  }
}

export default new ProductService();
