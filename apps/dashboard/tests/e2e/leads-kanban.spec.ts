import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3001';

/**
 * Creates a lead through the UI and verifies drag-and-drop persistence
 * by reloading the page and checking the updated column/position.
 */
test.describe('Leads Kanban', () => {
  test('creates lead and persists drag', async ({ page }) => {
    const name = `E2E Lead ${randomUUID().slice(0, 8)}`;
    const website = 'https://example.com';
    const phone = '+1 555-1234';

    await page.goto(`${baseURL}/dashboard/leads`);

    // Open create lead form
    await page.getByRole('button', { name: /nuevo lead|new lead|add lead/i }).click();

    await page.getByLabel(/nombre|name/i).fill(name);
    await page.getByLabel(/sitio|website/i).fill(website);
    await page.getByLabel(/tel[eé]fono|phone/i).fill(phone);
    await page.getByRole('button', { name: /crear|guardar|save/i }).click();

    // Wait for card to appear in first column
    const sourceColumn = page.locator('[data-column-id]').first();
    const card = page.locator(`[data-lead-id][data-lead-name="${name}"]`).first();
    await expect(card).toBeVisible({ timeout: 15000 });

    // Target column: pick the second one
    const targetColumn = page.locator('[data-column-id]').nth(1);
    const targetColumnId = await targetColumn.getAttribute('data-column-id');
    expect(targetColumnId).toBeTruthy();

    // Drag via pointer fallback (works with our data attributes)
    const sourceBox = await card.boundingBox();
    const targetBox = await targetColumn.boundingBox();
    expect(sourceBox).toBeTruthy();
    expect(targetBox).toBeTruthy();

    if (!sourceBox || !targetBox) throw new Error('Missing bounding boxes for drag');

    await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + 50);
    await page.mouse.up();

    // Expect card now rendered in target column
    const cardInTarget = targetColumn.locator(`[data-lead-name="${name}"]`).first();
    await expect(cardInTarget).toBeVisible({ timeout: 10000 });

    // Reload to confirm persistence
    await page.reload();

    const persistedTargetColumn = page.locator(`[data-column-id="${targetColumnId}"]`);
    const persistedCard = persistedTargetColumn.locator(`[data-lead-name="${name}"]`).first();
    await expect(persistedCard).toBeVisible({ timeout: 10000 });

    // Open sheet to confirm details still intact
    await persistedCard.click();
    await expect(page.getByRole('heading', { name })).toBeVisible();
    await expect(page.getByText(website)).toBeVisible();
  });
});
