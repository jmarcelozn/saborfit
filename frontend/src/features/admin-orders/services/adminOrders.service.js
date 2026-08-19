const API_URL = "/api/orders/admin";

export async function getOrders(filters = {}) {
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.status) params.append('status', filters.status);
  
  const url = `${API_URL}${params.toString() ? `?${params.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erro ao carregar pedidos");
  }

  const data = await response.json();

  return data.data || { orders: [], total: 0, page: 1, limit: 20 };
}

export async function getOrderById(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erro ao carregar pedido");
  }

  const data = await response.json();

  return data.data;
}

export async function updateOrderStatus(id, status) {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar status");
  }

  const data = await response.json();

  return data.data;
}

export const ORDER_STATUSES = [
  { value: 'NOVO', label: 'Novo', color: '#3b82f6' },
  { value: 'AGUARDANDO_PAGAMENTO', label: 'Aguardando Pagamento', color: '#f59e0b' },
  { value: 'PAGO', label: 'Pago', color: '#10b981' },
  { value: 'EM_PREPARO', label: 'Em Preparo', color: '#8b5cf6' },
  { value: 'PRONTO', label: 'Pronto', color: '#06b6d4' },
  { value: 'ENTREGUE', label: 'Entregue', color: '#22c55e' },
  { value: 'CANCELADO', label: 'Cancelado', color: '#ef4444' },
];
