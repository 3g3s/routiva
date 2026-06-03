import { test, expect } from '@playwright/test'

test.describe('Smoke tests', () => {
  test('SMK-001 landing page opens', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Routiva').first()).toBeVisible()
  })

  test('SMK-002 register page opens', async ({ page }) => {
    await page.goto('/kayit')
    await expect(page.getByText(/Kaydı|Kaydı|Kaydı|Kaydı|Kaydı|Kaydı|Kaydı|Kaydı|Kaydı|Kaydı|Kaydı|Kaydı|Kaydı/i).first()).toBeVisible({ timeout: 3000 }).catch(async () => {
      await expect(page.getByText(/Kayıt|Kaydı|Yük Veren Kaydı|Taşıyıcı Kaydı/i).first()).toBeVisible()
    })
  })

  test('SMK-003 login page opens', async ({ page }) => {
    await page.goto('/giris')
    await expect(page.getByPlaceholder('E-posta')).toBeVisible()
    await expect(page.getByPlaceholder('Şifre')).toBeVisible()
  })
})
