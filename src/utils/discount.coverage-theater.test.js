import { describe, expect, it } from 'vitest'
import { applyDiscount } from './discount'

// Deliberately bad: this suite exercises every branch of applyDiscount
// (100% statement/branch coverage, checked below) but never asserts what
// the function actually returns. See NOTES/b4-coverage.md — this is the
// coverage-theater half of the demonstration, kept as a readable example
// rather than deleted once its point was proven.

describe('applyDiscount (coverage theater — asserts nothing real)', () => {
  // Skipped, not deleted: this test reported 100% statement/branch
  // coverage on discount.js while a real bug (SAVE20 applying 2% instead
  // of 20%) shipped completely undetected. See NOTES/b4-coverage.md.
  it.skip('runs for every discount code without throwing', () => {
    applyDiscount(100, 'SAVE10')
    applyDiscount(100, 'SAVE20')
    applyDiscount(100, 'NONE')
    expect(true).toBe(true)
  })
})
