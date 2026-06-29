import { AppError } from '../../../shared/errors/AppError.js';
import cartRepository from '../repositories/cart.repository.js';
import productRepository from '../../products/repositories/product.repository.js';

function mapCartItem(row) {
  const quantity = Number(row.quantidade);
  const unitPrice = Number(row.preco_unitario);

  return {
    id: row.id,
    product_id: row.produto_id,
    quantity,
    unit_price: unitPrice,
    subtotal: quantity * unitPrice,
    product: {
      id: row.produto_id,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      stock_quantity: Number(row.stock_quantity),
      is_active: Boolean(row.is_active),
      image_url: row.image_url || null,
    },
  };
}

function buildCartResponse(cart, itemRows) {
  const items = itemRows.map(mapCartItem);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.subtotal, 0);

  return {
    id: cart.id,
    status: cart.status,
    items,
    item_count: itemCount,
    subtotal,
  };
}

export class CartService {
  async getOrCreateActiveCart(userId) {
    const existingCart = await cartRepository.findActiveByUserId(userId);

    if (existingCart) {
      return existingCart;
    }

    return cartRepository.createActiveCart(userId);
  }

  async getCart(userId) {
    const cart = await this.getOrCreateActiveCart(userId);
    const itemRows = await cartRepository.findItemsByCartId(cart.id);

    return buildCartResponse(cart, itemRows);
  }

  async validateProductForCart(productId, desiredQuantity) {
    const product = await productRepository.findActiveById(productId);

    if (!product) {
      throw new AppError('Produto não encontrado ou indisponível', 404);
    }

    if (product.stock_quantity < desiredQuantity) {
      throw new AppError('Quantidade solicitada indisponível em estoque', 409);
    }

    return product;
  }

  async addItem(userId, productId, quantity = 1) {
    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      throw new AppError('Quantidade inválida', 400);
    }

    const product = await this.validateProductForCart(productId, parsedQuantity);
    const cart = await this.getOrCreateActiveCart(userId);
    const existingItem = await cartRepository.findItemByCartAndProduct(cart.id, productId);

    if (existingItem) {
      const newQuantity = existingItem.quantidade + parsedQuantity;
      await this.validateProductForCart(productId, newQuantity);
      await cartRepository.updateItemQuantity(existingItem.id, newQuantity);
    } else {
      await cartRepository.createItem({
        cartId: cart.id,
        productId,
        quantity: parsedQuantity,
        unitPrice: product.price,
      });
    }

    return this.getCart(userId);
  }

  async updateItemQuantity(userId, itemId, quantity) {
    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      throw new AppError('Quantidade inválida', 400);
    }

    const cart = await this.getOrCreateActiveCart(userId);
    const item = await cartRepository.findItemById(itemId);

    if (!item || item.carrinho_id !== cart.id) {
      throw new AppError('Item do carrinho não encontrado', 404);
    }

    await this.validateProductForCart(item.produto_id, parsedQuantity);
    await cartRepository.updateItemQuantity(itemId, parsedQuantity);

    return this.getCart(userId);
  }

  async removeItem(userId, itemId) {
    const cart = await this.getOrCreateActiveCart(userId);
    const item = await cartRepository.findItemById(itemId);

    if (!item || item.carrinho_id !== cart.id) {
      throw new AppError('Item do carrinho não encontrado', 404);
    }

    await cartRepository.removeItem(itemId);

    return this.getCart(userId);
  }

  async clearCart(userId) {
    const cart = await this.getOrCreateActiveCart(userId);
    await cartRepository.clearItems(cart.id);

    return this.getCart(userId);
  }
}

export default new CartService();
