import { test, expect } from '@playwright/test'
import { uniqueEmail, strongPassword } from '../fixtures/test-data'

async function registerViaApi(request: any, role: 'yukveren' | 'tasiyici') {
  const email = uniqueEmail(role)
  const resp = await request.post('http://localhost:5188/api/auth/register', {
    data: {
      displayName: `QA ${role}`,
      email,
      password: strongPassword,
      phone: '5551112233',
      role,
    },
  })
  expect(resp.ok()).toBeTruthy()
  return { email, password: strongPassword }
}

async function loginUi(page: any, email: string, password: string) {
  await page.goto('/giris')
  await page.getByPlaceholder('E-posta').fill(email)
  await page.getByPlaceholder('Şifre').fill(password)
  await page.getByRole('button', { name: /^Giriş yap$/i }).click()
  await expect(page).toHaveURL(/\/$/)
}

test.describe('Authorization and roles', () => {
  test('AUTH-001 unauthenticated user is redirected from panel', async ({ page }) => {
    await page.goto('/panel')
    await expect(page).toHaveURL(/\/giris/)
  })

  test('AUTH-003 carrier can access carrier map', async ({ page, request }) => {
    const user = await registerViaApi(request, 'tasiyici')
    await loginUi(page, user.email, user.password)
    await page.goto('/tasiyici/harita')
    await expect(page).not.toHaveURL(/\/giris/)
  })

  test('AUTH-002 shipper should not access carrier-only map', async ({ page, request }) => {
    const user = await registerViaApi(request, 'yukveren')
    await loginUi(page, user.email, user.password)
    await page.goto('/tasiyici/harita')
    await expect(page).not.toHaveURL(/\/tasiyici\/harita$/)
  })
})
