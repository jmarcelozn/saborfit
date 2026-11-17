export function formatOrderCode(orderId) {
  return `SF-${String(orderId).padStart(6, '0')}`;
}
