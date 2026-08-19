import { useState } from 'react';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { adminApiFetch } from '@/app/services/api';
import { showNotification } from '@/app/services/notificationService';
import { getStoreSettings } from '@/app/services/settingsService';
import './css/CartSummary.css';

function formatDateDisplay(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

export default function CartSummary({ subtotal, itemCount, onClear, disabled }) {
  const [deliveryDate, setDeliveryDate] = useState('');
  const [observations, setObservations] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (itemCount === 0) {
      showNotification('Carrinho vazio', 'error');
      return;
    }

    const confirmed = window.confirm(
      'Você será redirecionado para o WhatsApp para finalizar seu pedido.\n\n' +
      'Deseja continuar?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsCheckingOut(true);
      showNotification('Processando pedido...', 'info');

      const response = await adminApiFetch('/cart/checkout', {
        method: 'POST',
        body: JSON.stringify({
          data_entrega: deliveryDate || null,
          observacoes: observations || null,
        }),
      });

      const whatsappUrl = response?.data?.whatsappUrl || response?.whatsappUrl;

      if (whatsappUrl) {
        showNotification('Redirecionando para o WhatsApp...', 'success');
        window.location.href = whatsappUrl;
        return;
      }

      showNotification('Não foi possível gerar o link do WhatsApp. Tente novamente.', 'error');
    } catch (error) {
      showNotification(error.message || 'Erro ao finalizar pedido', 'error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <aside className="cart-summary">
      <h2 className="cart-summary__title">Resumo</h2>

      <div className="cart-summary__row">
        <span>Itens</span>
        <span>{itemCount}</span>
      </div>

      <div className="cart-summary__row cart-summary__row--total">
        <span>Subtotal</span>
        <strong>{formatCurrency(subtotal)}</strong>
      </div>

      <div className="cart-summary__form">
        <div className="cart-summary__form-group">
          <label htmlFor="deliveryDate">Data de entrega (opcional)</label>
          <input
            type="date"
            id="deliveryDate"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            disabled={disabled || isCheckingOut}
          />
          {deliveryDate && (
            <span className="cart-summary__date-display">
              {formatDateDisplay(deliveryDate)}
            </span>
          )}
        </div>

        <div className="cart-summary__form-group">
          <label htmlFor="observations">Observações (opcional)</label>
          <textarea
            id="observations"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Ex: Sem açúcar, sem glúten..."
            rows={3}
            disabled={disabled || isCheckingOut}
          />
        </div>
      </div>

      <button
        type="button"
        className="cart-summary__checkout"
        onClick={handleCheckout}
        disabled={disabled || itemCount === 0 || isCheckingOut}
      >
        {isCheckingOut ? 'Processando...' : 'Finalizar pedido'}
      </button>

      <button
        type="button"
        className="cart-summary__clear"
        onClick={onClear}
        disabled={disabled || itemCount === 0 || isCheckingOut}
      >
        Esvaziar carrinho
      </button>
    </aside>
  );
}
