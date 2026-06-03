import { test, expect } from '@playwright/test'
import { uniqueEmail, strongPassword } from '../fixtures/test-data'

async function fillStepOne(page: any, email: string, password = strongPassword) {
  await page.getByPlaceholder('Ad').fill('Betul')
  await page.getByPlaceholder('Soyad').fill('QA')
  await page.getByPlaceholder('E-posta').fill(email)
  await page.getByPlaceholder('Şifre').fill(password)
  await page.getByPlaceholder('Şifre (tekrar)').fill(password)
}

test.describe('Register/Login E2E', () => {
  test('REG-001 yük veren can register and access dashboard', async ({ page }) => {
    const email = uniqueEmail('yukveren')
    await page.goto('/kayit')
    await page.getByRole('button', { name: 'Yük Veren' }).click()
    await fillStepOne(page, email)
    await page.getByRole('button', { name: /Devam et/i }).click()
    await page.getByPlaceholder(/Firma Adı/i).fill('Routiva QA Ltd')
    await page.getByPlaceholder('Adres').fill('Istanbul test adresi')
    await page.getByRole('button', { name: /Kaydı Tamamla/i }).click()

    await expect(page).toHaveURL(/\/$/)
    await page.goto('/panel')
    await expect(page.getByText(/Hoş geldin/i)).toBeVisible()
  })

  test('REG-002 taşıyıcı can register and access dashboard', async ({ page }) => {
    const email = uniqueEmail('tasiyici')
    await page.goto('/kayit')
    await page.getByRole('button', { name: 'Taşıyıcı' }).click()
    await fillStepOne(page, email)
    await page.getByRole('button', { name: /Devam et/i }).click()
    await page.getByPlaceholder('Plaka').fill('34QA123')
    await page.getByPlaceholder('Kapasite (Ton)').fill('10')
    await page.getByRole('button', { name: /Kaydı Tamamla/i }).click()

    await expect(page).toHaveURL(/\/$/)
    await page.goto('/panel')
    await expect(page.getByText(/Taşıyıcı kontrol paneli|Hoş geldin/i)).toBeVisible()
  })

  test('REG-003 invalid email blocks register step one', async ({ page }) => {
    await page.goto('/kayit')
    await fillStepOne(page, 'invalid-email')
    await page.getByRole('button', { name: /Devam et/i }).click()
    await expect(page.getByText(/Geçerli bir e-posta girin/i)).toBeVisible()
  })

  test('REG-005 short password blocks register', async ({ page }) => {
    await page.goto('/kayit')
    await fillStepOne(page, uniqueEmail('short'), '123')
    await page.getByRole('button', { name: /Devam et/i }).click()
    await expect(page.getByText(/Şifre en az 4 karakter olmalı/i)).toBeVisible()
  })

  test('REG-006 password mismatch blocks register', async ({ page }) => {
    await page.goto('/kayit')
    await page.getByPlaceholder('Ad').fill('Betul')
    await page.getByPlaceholder('Soyad').fill('QA')
    await page.getByPlaceholder('E-posta').fill(uniqueEmail('mismatch'))
    await page.getByPlaceholder('Şifre').fill('QaTest123!')
    await page.getByPlaceholder('Şifre (tekrar)').fill('Different123!')
    await page.getByRole('button', { name: /Devam et/i }).click()
    await expect(page.getByText(/Şifreler aynı olmalı/i)).toBeVisible()
  })
})
