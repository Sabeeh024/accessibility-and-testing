import { describe, expect, it } from 'vitest'
import { applyDiscount } from './discount'

describe('applyDiscount', () => {
  it('applies a 10% discount for SAVE10', () => {
    expect(applyDiscount(100, 'SAVE10')).toBe(90)
  })

  it('applies a 20% discount for SAVE20', () => {
    expect(applyDiscount(100, 'SAVE20')).toBe(80)
  })

  it('returns the full price for an unknown code', () => {
    expect(applyDiscount(100, 'NONE')).toBe(100)
  })
})
