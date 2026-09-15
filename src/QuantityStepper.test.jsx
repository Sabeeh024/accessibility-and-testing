import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import QuantityStepper from './QuantityStepper'

// Query priority used throughout: getByRole first (mirrors how a screen
// reader/keyboard user finds things), getByLabelText next, then getByText.
// getByTestId is deliberately never used here — reaching for it usually
// means the markup doesn't expose the thing accessibly in the first place.

describe('QuantityStepper', () => {
  it('renders with the initial quantity', () => {
    render(<QuantityStepper initial={3} />)
    expect(screen.getByRole('spinbutton', { name: /quantity/i })).toHaveValue(
      3,
    )
  })

  it('increments when the increase button is clicked', async () => {
    const user = userEvent.setup()
    render(<QuantityStepper initial={1} />)

    await user.click(screen.getByRole('button', { name: /increase/i }))

    expect(screen.getByRole('spinbutton', { name: /quantity/i })).toHaveValue(
      2,
    )
  })

  it('decrements when the decrease button is clicked', async () => {
    const user = userEvent.setup()
    render(<QuantityStepper initial={5} />)

    await user.click(screen.getByRole('button', { name: /decrease/i }))

    expect(screen.getByRole('spinbutton', { name: /quantity/i })).toHaveValue(
      4,
    )
  })

  it('disables the decrease button at the minimum', () => {
    render(<QuantityStepper initial={0} min={0} />)
    expect(screen.getByRole('button', { name: /decrease/i })).toBeDisabled()
  })

  it('disables the increase button and shows a message at the maximum', () => {
    render(<QuantityStepper initial={10} max={10} />)
    expect(screen.getByRole('button', { name: /increase/i })).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent(
      'Maximum quantity reached.',
    )
  })

  it('does not exceed the maximum when typed directly into the input', async () => {
    const user = userEvent.setup()
    render(<QuantityStepper initial={1} max={5} />)

    const input = screen.getByRole('spinbutton', { name: /quantity/i })
    await user.clear(input)
    await user.type(input, '99')

    expect(input).toHaveValue(5)
  })
})
