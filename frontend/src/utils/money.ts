export function formatCurrency(currency: number) {
  if (currency >= 1000) {
    const s = String(currency);
    const groups = [];
    for (let i = s.length; i > 0; i -= 3) {
      groups.unshift(s.substring(Math.max(0, i - 3), i));
    }
    return `${groups.join(' ')} ₽`;
  }
  return `${currency} ₽`;
}