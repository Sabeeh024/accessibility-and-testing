/**
 * Formats a number of cents as a currency string.
 * Throws on non-integer input since fractional cents aren't a valid amount.
 */
export function formatCurrency(cents, currency = 'USD') {
  if (!Number.isInteger(cents)) {
    throw new TypeError('formatCurrency expects an integer number of cents')
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100)
}
