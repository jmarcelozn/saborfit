import pool from '../../../database/pool.js';
import { AppError } from '../../../shared/errors/AppError.js';
import {
  createOrder,
  createOrderItem,
  getOrderById,
  getOrderByUserId,
  getOrderItems,
  updateOrderStatus,
} from '../repositories/order.repository.js';
import cartRepository from '../../cart/repositories/cart.repository.js';
import productRepository from '../../products/repositories/product.repository.js';
import settingsService from '../../settings/services/settings.service.js';

export async function createOrderFromCart(userId, cartData) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Get cart
    const cart = await cartRepository.findActiveByUserId(userId);
    if (!cart) {
      throw new AppError('Carrinho não encontrado', 404);
    }

    // Get cart items with product details
    const cartItems = await cartRepository.findItemsByCartId(cart.id);
    if (cartItems.length === 0) {
      throw new AppError('Carrinho vazio', 400);
    }

    // Calculate total
    let total = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const product = await productRepository.findById(item.produto_id);
      if (!product) {
        throw new AppError(`Produto ${item.produto_id} não encontrado`, 404);
      }

      if (!product.is_active) {
        throw new AppError(`Produto ${product.name} não está disponível`, 400);
      }

      const itemTotal = product.price * item.quantidade;
      total += itemTotal;

      orderItems.push({
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        preco_unitario: product.price,
      });
    }

    // Create order
    const order = await createOrder({
      usuario_id: userId,
      total,
      status: 'PENDENTE',
      observacoes: cartData.observacoes || cart.observacoes,
      data_entrega: cartData.data_entrega || cart.data_entrega,
    });

    // Create order items
    for (const item of orderItems) {
      await createOrderItem({
        pedido_id: order.id,
        ...item,
      });
    }

    // Clear cart
    await cartRepository.clearItems(cart.id);

    await connection.commit();

    return {
      order,
      items: orderItems,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function generateWhatsAppMessage(orderId) {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new AppError('Pedido não encontrado', 404);
  }

  // Convert total to number (MySQL returns DECIMAL as string)
  order.total = Number(order.total);

  const items = await getOrderItems(orderId);

  // Get user info
  const connection = await pool.getConnection();
  try {
    const [userRows] = await connection.query(
      'SELECT id, nome, email FROM usuarios WHERE id = ?',
      [order.usuario_id]
    );
    const user = userRows[0];

    // Build items text
    let itemsText = '';
    items.forEach((item, index) => {
      const precoUnitario = Number(item.preco_unitario);
      itemsText += `• ${item.quantidade}x ${item.produto_nome} - R$ ${(precoUnitario * item.quantidade).toFixed(2)}\n`;
    });

    // Build message
    const message = `
🍰 *SaborFit - Novo Pedido*

━━━━━━━━━━━━━━━━━━━━━
📋 *Pedido #${order.id}*
━━━━━━━━━━━━━━━━━━━━━

👤 *Cliente:* ${user.nome}
📧 *Email:* ${user.email}

${order.data_entrega ? `📅 *Data desejada:* ${new Date(order.data_entrega).toLocaleDateString('pt-BR')}\n` : ''}

${order.observacoes ? `📝 *Observações:*\n${order.observacoes}\n` : ''}

━━━━━━━━━━━━━━━━━━━━━
🛒 *Itens do Pedido*
━━━━━━━━━━━━━━━━━━━━━

${itemsText}

━━━━━━━━━━━━━━━━━━━━━
💰 *Total: R$ ${order.total.toFixed(2)}*
━━━━━━━━━━━━━━━━━━━━━

✅ *Este pedido foi gerado automaticamente pelo sistema.*

Por favor, confirme a disponibilidade e o prazo de entrega.
Obrigado pela preferência! 🙏
`.trim();

    // Get WhatsApp number from store settings
    const settings = await settingsService.getStoreSettings();
    const whatsappNumber = settings.whatsapp || '5598999999999';

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    return {
      whatsappUrl,
      message,
    };
  } finally {
    connection.release();
  }
}
