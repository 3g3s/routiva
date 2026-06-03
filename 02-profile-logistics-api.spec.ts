import { test, expect } from '@playwright/test'

test.describe('UI responsive checks', () => {
  test('UI-001 landing page does not horizontally overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    expect(hasOverflow).toBe(false)
  })

  test('UI-002 register page visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/kayit')
    await expect(page.getByPlaceholder('E-posta')).toBeVisible()
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    expect(hasOverflow).toBe(false)
  })

  test('UI-003 login page visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/giris')
    await expect(page.getByRole('button', { name: /^Giriş yap$/i })).toBeVisible()
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    expect(hasOverflow).toBe(false)
  })
})
