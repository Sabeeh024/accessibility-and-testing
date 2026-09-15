import { describe, expect, it } from 'vitest'
import { formatCurrency } from './formatCurrency'

describe('formatCurrency', () => {
  it('formats whole dollar amounts', () => {
    expect(formatCurrency(1000)).toBe('$10.00')
  })

  it('formats amounts with cents', () => {
    expect(formatCurrency(1050)).toBe('$10.50')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('formats negative amounts (refunds)', () => {
    expect(formatCurrency(-500)).toBe('-$5.00')
  })

  it('supports other currencies', () => {
    expect(formatCurrency(1000, 'EUR')).toBe('€10.00')
  })

  it('rejects fractional cents', () => {
    expect(() => formatCurrency(10.5)).toThrow(TypeError)
  })
})
