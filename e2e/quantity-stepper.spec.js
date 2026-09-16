import { expect, test } from '@playwright/test'

// One happy-path flow, deliberately — this is a smoke test, not a
// flake-hunting exercise. It checks the app actually works end-to-end in
// a real browser: real rendering, real click events, real state.

test('user can increase and decrease the quantity', async ({ page }) => {
  await page.goto('/')

  const quantity = page.getByRole('spinbutton', { name: /quantity/i })
  await expect(quantity).toHaveValue('1')

  await page.getByRole('button', { name: /increase quantity/i }).click()
  await page.getByRole('button', { name: /increase quantity/i }).click()
  await expect(quantity).toHaveValue('3')

  await page.getByRole('button', { name: /decrease quantity/i }).click()
  await expect(quantity).toHaveValue('2')
})
