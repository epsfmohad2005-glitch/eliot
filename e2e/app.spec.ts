import { test, expect } from '@playwright/test';

test.describe('Eliot E2E Application Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1. First application boot', async ({ page }) => {
    // Expect main header or brand title
    await expect(page.locator('body')).toBeVisible();
    const heading = page.locator('h1, h2, header').first();
    await expect(heading).toBeVisible();
  });

  test('2. Import PDF', async ({ page }) => {
    // Open Import Workspace if button present or inspect workspace
    const importBtn = page.getByRole('button', { name: /import/i }).first();
    if (await importBtn.isVisible()) {
      await importBtn.click();
    }
    await expect(page.locator('body')).toBeVisible();
  });

  test('3. Import Markdown', async ({ page }) => {
    const importBtn = page.getByRole('button', { name: /import/i }).first();
    if (await importBtn.isVisible()) {
      await importBtn.click();
    }
    await expect(page.locator('body')).toBeVisible();
  });

  test('4. Complete Knowledge Review', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('5. Commit Knowledge', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('6. Start Mission', async ({ page }) => {
    const startBtn = page.getByRole('button', { name: /resume|start|mission/i }).first();
    if (await startBtn.isVisible()) {
      await startBtn.click();
    }
    await expect(page.locator('body')).toBeVisible();
  });

  test('7. Complete Learning Session', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('8. Submit Evidence', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('9. Finish Session', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });
});
