export function formatCurrency(value) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return 'R$ 0,00';
  }

  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
