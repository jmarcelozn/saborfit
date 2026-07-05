import ordersService from '../../orders/services/orders.service.js';

const DEFAULT_WHATSAPP = '5599991176090';

function normalizePhone(raw) {
  if (raw === undefined || raw === null) return null;
  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return null;

  // Prefix Brazilian country code if not present
  return digits.startsWith('55') ? digits : `55${digits}`;
}

export async function checkout(req, res, next) {
  try {
    const startTs = Date.now();
    const userId = req.user.id;

    console.log(`[checkout] start user=${userId} at=${new Date(startTs).toISOString()}`);

    const {
      observacoes,
      endereco,
      forma_pagamento,
      whatsapp: clientWhatsapp,
    } = req.body;

    // Start createOrder but don't await indefinitely
    const createOrderPromise = ordersService.createOrder(userId, {
      observacoes,
      endereco,
      forma_pagamento,
      whatsapp: clientWhatsapp ?? null,
    });

    // Timeout fallback after 5s
    const TIMEOUT_MS = Number(process.env.CHECKOUT_TIMEOUT_MS) || 5000;
    const timeoutPromise = new Promise(resolve => setTimeout(() => resolve({ __timeout: true }), TIMEOUT_MS));

    const result = await Promise.race([createOrderPromise, timeoutPromise]);

    // If timed out, let createOrder continue in background and respond with fallback
    if (result && result.__timeout) {
      console.warn(`[checkout] createOrder timeout after ${TIMEOUT_MS}ms for user=${userId}`);

      // fire-and-forget logging of eventual completion
      createOrderPromise
        .then(r => console.log(`[checkout] background createOrder finished order=${r.pedido?.id} user=${userId}`))
        .catch(err => console.error('[checkout] background createOrder error', err));

      const storeWhatsappRaw = process.env.STORE_WHATSAPP || DEFAULT_WHATSAPP;
      const phone = normalizePhone(storeWhatsappRaw || clientWhatsapp || null);
      const whatsappMessage = 'Seu pedido está sendo processado. Em breve entraremos em contato pelo WhatsApp.';
      const whatsappUrl = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}` : null;

      console.log('[checkout] timeout response', { orderId: null, whatsappUrl, phone });

      return res.json({
        success: true,
        data: {
          orderId: null,
          whatsappMessage,
          whatsappUrl,
          warning: 'createOrder_timeout',
        },
      });
    }

    // Normal path: createOrder finished within timeout
    const { pedido, whatsappMessage } = result;

    const storeWhatsappRaw = process.env.STORE_WHATSAPP || DEFAULT_WHATSAPP;
    const chosenRaw = storeWhatsappRaw || clientWhatsapp || pedido?.whatsapp || null;
    const phone = normalizePhone(chosenRaw);

    const whatsappUrl = phone && whatsappMessage
      ? `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`
      : null;

    console.log(`[checkout] finished user=${userId} order=${pedido.id} duration=${Date.now() - startTs}ms`);
    console.log('[checkout] response', { orderId: pedido.id, whatsappUrl, phone });

    res.json({
      success: true,
      data: {
        orderId: pedido.id,
        whatsappMessage,
        whatsappUrl,
      },
    });
  } catch (error) {
    next(error);
  }
}