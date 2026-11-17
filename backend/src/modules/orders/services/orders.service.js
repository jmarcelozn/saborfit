import pool from '../../../database/pool.js';
import { AppError } from '../../../shared/errors/AppError.js';
import ordersRepository from '../repositories/orders.repository.js';

const VALID_STATUSES = [
  'NOVO',
  'AGUARDANDO_PAGAMENTO',
  'PAGO',
  'EM_PREPARO',
  'PRONTO',
  'ENTREGUE',
  'CANCELADO',
];

function formatWhatsAppMessage(pedido, itens, cliente_nome) {
  const linhasItens = itens
    .map(item => {
      const subtotal = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(item.preco_unitario * item.quantidade);
      return `• ${item.nome_produto} (quantidade: ${item.quantidade}) — ${subtotal}`;
    })
    .join('\n');

  const total = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(pedido.total));

  return [
    `Olá! Gostaria de confirmar meu pedido no SaborFit.`,
    '',
    `*CÓDIGO DO PEDIDO: ${pedido.codigo}*`,
    '',
    `*Cliente:* ${cliente_nome}`,
    '*Itens do pedido:*',
    linhasItens,
    '',
    `*Total estimado:* ${total}`,
    '',
    `*Endereço de entrega:* ${pedido.endereco ?? 'Não informado'}`,
    '*Forma de pagamento:* será combinada diretamente com o atendimento.',
    ...(pedido.observacoes ? ['', `*Observações:* ${pedido.observacoes}`] : []),
    '',
    'Nossa equipe confirmará a disponibilidade e o valor final por aqui.',
    'Agradecemos por escolher o SaborFit. Até breve!',
  ].join('\n');
}

const ordersService = {
  async createOrder(usuario_id, { observacoes, whatsapp, endereco }) {
    const startTs = Date.now();
    console.log(`[ordersService] createOrder start user=${usuario_id} at=${new Date(startTs).toISOString()}`);

    const [[usuario]] = await pool.execute(
      `SELECT id, nome FROM usuarios WHERE id = ? `,
      [usuario_id]
    );

    if (!usuario) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    const [[carrinho]] = await pool.execute(
      `SELECT id, status FROM carrinhos WHERE usuario_id = ? AND status = 'ativo'`,
      [usuario_id]
    );

    if (!carrinho) {
      throw new AppError('Nenhum carrinho ativo encontrado.', 400);
    }

    const [itensCarrinho] = await pool.execute(
      `SELECT ci.produto_id, ci.quantidade, p.price AS preco_unitario, p.name AS nome_produto 
       FROM carrinho_itens ci 
       INNER JOIN produtos p ON p.id = ci.produto_id 
       WHERE ci.carrinho_id = ? AND p.is_active = TRUE`,
      [carrinho.id]
    );

    if (!itensCarrinho.length) {
      throw new AppError('O carrinho não possui itens.', 400);
    }

    const total = itensCarrinho.reduce(
      (acc, item) => acc + item.preco_unitario * item.quantidade,
      0
    );

    const pedido = await ordersRepository.createOrder({
      usuario_id,
      total: total.toFixed(2),
      observacoes,
      whatsapp,
      endereco,
    });

    await ordersRepository.createOrderItems(pedido.id, itensCarrinho);

    await pool.execute(
      `UPDATE carrinhos SET status = 'convertido' WHERE id = ?`,
      [carrinho.id]
    );

    const pedidoCompleto = await ordersRepository.findById(pedido.id);

    const whatsappMessage = formatWhatsAppMessage(
      pedidoCompleto,
      pedidoCompleto.itens,
      usuario.nome
    );

    console.log(`[ordersService] createOrder finished user=${usuario_id} order=${pedidoCompleto.id} duration=${Date.now() - startTs}ms`);

    return {
      pedido: pedidoCompleto,
      itens: pedidoCompleto.itens,
      whatsappMessage,
    };
  },

  async getMyOrders(usuario_id) {
    return ordersRepository.findByUserId(usuario_id);
  },

  async getOrderById(id, usuario_id) {
    const pedido = await ordersRepository.findById(id);

    if (!pedido) {
      throw new AppError('Pedido não encontrado.', 404);
    }

    if (pedido.usuario_id !== usuario_id) {
      throw new AppError('Acesso negado.', 403);
    }

    return pedido;
  },

  async adminGetAllOrders(filters) {
    return ordersRepository.findAll(filters);
  },

  async adminGetOrderById(id) {
    const pedido = await ordersRepository.findById(id);

    if (!pedido) {
      throw new AppError('Pedido não encontrado.', 404);
    }

    return pedido;
  },

  async adminUpdateStatus(id, status) {
    if (!VALID_STATUSES.includes(status)) {
      throw new AppError(`Status inválido. Use: ${VALID_STATUSES.join(', ')}.`, 400);
    }

    const pedido = await ordersRepository.findById(id);

    if (!pedido) {
      throw new AppError('Pedido não encontrado.', 404);
    }

    return ordersRepository.updateStatus(id, status);
  },
};

export default ordersService;
