import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/DOBEU/);
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check if navigation is visible
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
});

test.describe('Authentication', () => {
  test('should show sign in page', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.locator('text=Sign In')).toBeVisible();
  });
});

