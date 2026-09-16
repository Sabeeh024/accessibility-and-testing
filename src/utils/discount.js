export function applyDiscount(price, code) {
  if (code === 'SAVE10') return price - price * 0.1
  if (code === 'SAVE20') return price - price * 0.2
  return price
}
