import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Eye, Package, User, Calendar, DollarSign, ChevronDown, ChevronUp, X } from "lucide-react";

import { useAuth } from "@/app/contexts/useAuth";
import { showNotification } from "@/app/services/notificationService";
import AdminLayout from "@/shared/AdminLayout/AdminLayout";
import { formatCurrency } from "@/shared/utils/formatCurrency";

import { getOrders, getOrderById, updateOrderStatus, ORDER_STATUSES } from "../services/adminOrders.service";
import "./css/AdminOrders.css";

export default function AdminOrders() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      
      const filters = {
        page: pagination.page,
        limit: pagination.limit,
        ...(statusFilter && { status: statusFilter }),
      };
      
      const data = await getOrders(filters);
      setOrders(data.orders || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || 0,
      }));
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os pedidos.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const order = await getOrderById(orderId);
      setSelectedOrder(order);
      setShowOrderModal(true);
    } catch (err) {
      showNotification("Erro ao carregar detalhes do pedido", "error");
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      showNotification("Status atualizado com sucesso", "success");
      loadOrders();
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showNotification("Erro ao atualizar status", "error");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id?.toString().includes(searchLower) ||
      order.usuario_nome?.toLowerCase().includes(searchLower) ||
      order.usuario_email?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusInfo = (status) => {
    return ORDER_STATUSES.find(s => s.value === status) || ORDER_STATUSES[0];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    loadOrders();
  }, [pagination.page, statusFilter]);

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const stats = {
    total: orders.length,
    novo: orders.filter(o => o.status === 'NOVO').length,
    aguardando: orders.filter(o => o.status === 'AGUARDANDO_PAGAMENTO').length,
    pronto: orders.filter(o => o.status === 'PRONTO').length,
  };

  return (
    <AdminLayout>
      <div className="admin-orders-header">
        <div className="admin-orders-title">
          <h1>Gerenciamento de Pedidos</h1>
          <p>Visualize e gerencie os pedidos feitos pelos clientes.</p>
        </div>
      </div>

      <div className="admin-orders-stats">
        <div className="stat-card">
          <Package size={20} />
          <div>
            <span className="stat-label">Total</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>
        <div className="stat-card stat-card--blue">
          <Package size={20} />
          <div>
            <span className="stat-label">Novos</span>
            <span className="stat-value">{stats.novo}</span>
          </div>
        </div>
        <div className="stat-card stat-card--orange">
          <Package size={20} />
          <div>
            <span className="stat-label">Aguardando</span>
            <span className="stat-value">{stats.aguardando}</span>
          </div>
        </div>
        <div className="stat-card stat-card--green">
          <Package size={20} />
          <div>
            <span className="stat-label">Prontos</span>
            <span className="stat-value">{stats.pronto}</span>
          </div>
        </div>
      </div>

      <div className="admin-orders-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por ID, nome ou email..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-box">
          <Filter size={18} />
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
          >
            <option value="">Todos os status</option>
            {ORDER_STATUSES.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <p>Carregando pedidos...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Total</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-state">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  return (
                    <tr key={order.id}>
                      <td className="order-id">#{order.id}</td>
                      <td className="order-customer">
                        <div className="customer-info">
                          <User size={16} />
                          <div>
                            <span className="customer-name">{order.usuario_nome}</span>
                            <span className="customer-email">{order.usuario_email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="order-date">
                        <Calendar size={16} />
                        {formatDate(order.created_at)}
                      </td>
                      <td className="order-total">
                        <DollarSign size={16} />
                        {formatCurrency(order.total)}
                      </td>
                      <td className="order-status">
                        <span
                          className="status-badge"
                          style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="order-actions">
                        <button
                          className="action-btn action-btn--view"
                          onClick={() => handleViewOrder(order.id)}
                          title="Ver detalhes"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {showOrderModal && selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="order-modal-header">
              <h2>Pedido #{selectedOrder.id}</h2>
              <button
                className="close-btn"
                onClick={() => setShowOrderModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="order-modal-content">
              {(() => {
                const statusInfo = getStatusInfo(selectedOrder.status);
                return (
                  <div className="order-modal-grid">
                    <div className="order-section">
                      <h4>Informações do Cliente</h4>
                      <div className="info-row">
                        <span>Nome:</span>
                        <strong>{selectedOrder.usuario_nome}</strong>
                      </div>
                      <div className="info-row">
                        <span>Email:</span>
                        <strong>{selectedOrder.usuario_email}</strong>
                      </div>
                      {selectedOrder.whatsapp && (
                        <div className="info-row">
                          <span>WhatsApp:</span>
                          <strong>{selectedOrder.whatsapp}</strong>
                        </div>
                      )}
                    </div>

                    <div className="order-section">
                      <h4>Informações do Pedido</h4>
                      <div className="info-row">
                        <span>Status:</span>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: `${statusInfo.color}20`, color: statusInfo.color }}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="info-row">
                        <span>Total:</span>
                        <strong>{formatCurrency(selectedOrder.total)}</strong>
                      </div>
                      <div className="info-row">
                        <span>Data:</span>
                        <strong>{formatDate(selectedOrder.created_at)}</strong>
                      </div>
                    </div>

                    <div className="order-section order-section--full">
                      <h4>Alterar Status</h4>
                      <div className="status-actions">
                        {ORDER_STATUSES.map(status => (
                          <button
                            key={status.value}
                            className={`status-btn ${selectedOrder.status === status.value ? 'status-btn--active' : ''}`}
                            onClick={() => handleUpdateStatus(selectedOrder.id, status.value)}
                            disabled={updatingStatus === selectedOrder.id}
                            style={{
                              backgroundColor: selectedOrder.status === status.value ? status.color : `${status.color}20`,
                              color: selectedOrder.status === status.value ? '#fff' : status.color,
                            }}
                          >
                            {status.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedOrder.observacoes && (
                      <div className="order-section order-section--full">
                        <h4>Observações</h4>
                        <p className="order-observations">{selectedOrder.observacoes}</p>
                      </div>
                    )}

                    {selectedOrder.endereco && (
                      <div className="order-section order-section--full">
                        <h4>Endereço de Entrega</h4>
                        <p className="order-address">{selectedOrder.endereco}</p>
                      </div>
                    )}

                    {selectedOrder.itens && selectedOrder.itens.length > 0 && (
                      <div className="order-section order-section--full">
                        <h4>Itens do Pedido</h4>
                        <div className="order-items">
                          {selectedOrder.itens.map((item, index) => (
                            <div key={index} className="order-item">
                              <span className="item-name">{item.nome_produto}</span>
                              <span className="item-quantity">x{item.quantidade}</span>
                              <span className="item-price">{formatCurrency(item.preco_unitario)}</span>
                              <span className="item-subtotal">
                                {formatCurrency(item.preco_unitario * item.quantidade)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
