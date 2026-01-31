import { chromium, type FullConfig } from '@playwright/test';

/**
 * Logs in via UI and saves storage state for tests.
 * Requires E2E_EMAIL and E2E_PASSWORD env vars.
 */
export default async function globalSetup(config: FullConfig) {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;
  const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3001';

  if (!email || !password) {
    throw new Error('E2E_EMAIL and E2E_PASSWORD must be set for E2E tests');
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`${baseURL}/login`);
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /login|sign in|entrar/i }).click();

  // If login doesn't navigate, attempt registration then login again
  try {
    await page.waitForURL('**/dashboard*', { timeout: 8000 });
  } catch {
    // Register flow
    await page.goto(`${baseURL}/register`);
    await page.getByLabel(/full name/i).fill('E2E User');
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole('button', { name: /sign up|registrar|crear/i }).click();

    // Proceed to login regardless of redirect
    await page.goto(`${baseURL}/login`);
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole('button', { name: /login|sign in|entrar/i }).click();
    await page.waitForURL('**/dashboard*', { timeout: 20000 });
  }

  await page.context().storageState({ path: 'playwright/.auth/state.json' });
  await browser.close();
}
