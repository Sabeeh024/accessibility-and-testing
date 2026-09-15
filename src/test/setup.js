import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

// Without this, each test's rendered DOM stays mounted for the next test —
// confirmed by running this suite without it first: queries started
// matching leftover elements from earlier tests (getByRole throwing
// "multiple elements found", and one assertion reading a stale value from
// a previous test's unmounted-in-name-only component).
afterEach(() => {
  cleanup()
})
