import { AppError } from '../../../shared/errors/AppError.js';
import { createOrderFromCart, generateWhatsAppMessage } from '../../orders/services/order.service.js';

export async function checkout(req, res, next) {
  try {
    const userId = req.user.id;
    const { observacoes, data_entrega } = req.body;

    // Create order from cart
    const { order } = await createOrderFromCart(userId, {
      observacoes,
      data_entrega,
    });

    // Generate WhatsApp message
    const { whatsappUrl } = await generateWhatsAppMessage(order.id);

    res.json({
      success: true,
      data: {
        orderId: order.id,
        whatsappUrl,
      },
    });
  } catch (error) {
    next(error);
  }
}
