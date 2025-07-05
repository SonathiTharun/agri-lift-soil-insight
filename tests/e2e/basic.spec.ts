import { test, expect } from '@playwright/test';

test.describe('AgriLift Soil Insight - Basic E2E Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads
    await expect(page).toHaveTitle(/AgriLift/);
    
    // Check for main navigation elements
    await expect(page.locator('nav')).toBeVisible();
  });

  test('dairy lift page is accessible', async ({ page }) => {
    await page.goto('/dairy-lift');
    
    // Check if the dairy lift page loads
    await expect(page.locator('h1')).toContainText(/Dairy/i);
  });

  test('sell produce page loads', async ({ page }) => {
    await page.goto('/dairy-lift/sell-produce');
    
    // Check if the sell produce page loads
    await expect(page.locator('h1, h2')).toContainText(/Sell|Produce|Milk/i);
    
    // Check for main tabs
    await expect(page.locator('[role="tablist"]')).toBeVisible();
  });

  test('navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to dairy lift
    await page.click('text=Dairy');
    await expect(page).toHaveURL(/dairy-lift/);
    
    // Navigate to sell produce
    await page.click('text=Sell');
    await expect(page).toHaveURL(/sell-produce/);
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Check if mobile navigation is present
    await expect(page.locator('nav')).toBeVisible();
    
    // Check if content is properly displayed on mobile
    await expect(page.locator('main')).toBeVisible();
  });
});
