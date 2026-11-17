import { useState } from 'react';
import { CalendarDays, MapPin, MessageCircle, NotebookPen, ShieldCheck, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { adminApiFetch } from '@/app/services/api';
import { showNotification } from '@/app/services/notificationService';
import './css/CartSummary.css';

export default function CartSummary({ subtotal, itemCount, onClear, disabled }) {
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [observations, setObservations] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!itemCount) return showNotification('Carrinho vazio', 'error');
    if (!address.trim()) return showNotification('Informe o endereço de entrega para continuar.', 'error');
    if (!window.confirm('Você será redirecionado para o WhatsApp para finalizar seu pedido. Deseja continuar?')) return;

    try {
      setIsCheckingOut(true);
      showNotification('Processando pedido...', 'info');
      const response = await adminApiFetch('/cart/checkout', { method: 'POST', body: JSON.stringify({ endereco: address.trim(), data_entrega: deliveryDate || null, observacoes: observations || null }) });
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
    <aside className="cart-summary" aria-labelledby="cart-summary-title">
      <div className="cart-summary__header"><span>Resumo da encomenda</span><h2 id="cart-summary-title">Seu pedido</h2></div>
      <div className="cart-summary__totals">
        <div><span>{itemCount === 1 ? '1 item' : `${itemCount} itens`}</span><span>{formatCurrency(subtotal)}</span></div>
        <div className="cart-summary__total"><span>Total</span><strong>{formatCurrency(subtotal)}</strong></div>
      </div>

      <div className="cart-summary__form">
        <label className="cart-summary__field cart-summary__field--address" htmlFor="deliveryAddress">
          <span><MapPin size={17} /> Endereço de entrega <small>obrigatório</small></span>
          <textarea id="deliveryAddress" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Rua, número, bairro, cidade e complemento" rows={3} maxLength={500} required aria-required="true" disabled={disabled || isCheckingOut} />
        </label>
        <label className="cart-summary__field" htmlFor="deliveryDate"><span><CalendarDays size={17} /> Data desejada <small>opcional</small></span><input type="date" id="deliveryDate" value={deliveryDate} onChange={(event) => setDeliveryDate(event.target.value)} min={new Date().toISOString().split('T')[0]} disabled={disabled || isCheckingOut} /></label>
        <label className="cart-summary__field" htmlFor="observations"><span><NotebookPen size={17} /> Observações <small>opcional</small></span><textarea id="observations" value={observations} onChange={(event) => setObservations(event.target.value)} placeholder="Tema, cores, restrições ou detalhes importantes..." rows={3} maxLength={500} disabled={disabled || isCheckingOut} /><small className="cart-summary__counter">{observations.length}/500</small></label>
      </div>

      <p className="cart-summary__notice"><ShieldCheck size={17} /> O valor final e a disponibilidade serão confirmados pelo atendimento.</p>
      <button type="button" className="cart-summary__checkout" onClick={handleCheckout} disabled={disabled || !itemCount || isCheckingOut}>{isCheckingOut ? <span className="cart-summary__spinner" /> : <MessageCircle size={18} />} {isCheckingOut ? 'Processando...' : 'Finalizar pelo WhatsApp'}</button>
      <button type="button" className="cart-summary__clear" onClick={onClear} disabled={disabled || !itemCount || isCheckingOut}><Trash2 size={15} /> Esvaziar carrinho</button>
    </aside>
  );
}
