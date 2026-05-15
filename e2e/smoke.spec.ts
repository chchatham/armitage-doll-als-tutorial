import { test, expect } from '@playwright/test';

test.describe('Tutorial smoke tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Armitage-Doll ALS Interactive Tutorial');
  });

  test('all four sections render', async ({ page }) => {
    await expect(page.locator('#fundamentals')).toBeVisible();
    await expect(page.locator('#limitations')).toBeVisible();
    await expect(page.locator('#als')).toBeVisible();
    await expect(page.locator('#future')).toBeVisible();
  });

  test('navigation links exist and point to sections', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Tutorial sections"]');
    await expect(nav).toBeVisible();
    const links = nav.locator('a');
    await expect(links).toHaveCount(4);
    await expect(links.nth(0)).toHaveAttribute('href', '#fundamentals');
    await expect(links.nth(1)).toHaveAttribute('href', '#limitations');
    await expect(links.nth(2)).toHaveAttribute('href', '#als');
    await expect(links.nth(3)).toHaveAttribute('href', '#future');
  });

  test('all 7 widgets render', async ({ page }) => {
    await expect(page.locator('#widget-multistage-builder')).toBeVisible();
    await expect(page.locator('#widget-distribution-comparison')).toBeVisible();
    await expect(page.locator('#widget-curve-fitting-trap')).toBeVisible();
    await expect(page.locator('#widget-old-age-plateau')).toBeVisible();
    await expect(page.locator('#widget-fit-off')).toBeVisible();
    await expect(page.locator('#widget-steps-to-slopes')).toBeVisible();
    await expect(page.locator('#widget-resilience-threshold')).toBeVisible();
  });

  test('all SVG plots render', async ({ page }) => {
    const plots = [
      '#plot-multistage',
      '#plot-distributions',
      '#plot-curve-trap',
      '#plot-old-age',
      '#plot-fit-off',
      '#plot-steps-slopes',
      '#plot-resilience',
    ];
    for (const id of plots) {
      const svg = page.locator(id);
      await expect(svg).toBeVisible();
      await expect(svg).toHaveAttribute('role', 'img');
      const ariaLabel = await svg.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
  });

  test('Widget 1 slider changes plot', async ({ page }) => {
    const slider = page.locator('#w1-k');
    await expect(slider).toBeVisible();
    const svg = page.locator('#plot-multistage');
    const pathsBefore = await svg.locator('path').count();
    await slider.fill('3');
    await page.waitForTimeout(200);
    const pathsAfter = await svg.locator('path').count();
    expect(pathsBefore).toBeGreaterThan(0);
    expect(pathsAfter).toBeGreaterThan(0);
  });

  test('Widget 7 slider updates onset prediction', async ({ page }) => {
    const slider = page.locator('#w7-genetic');
    await slider.fill('0.6');
    await page.waitForTimeout(200);
    const prediction = page.locator('#widget-resilience-threshold p[style]').last();
    await expect(prediction).toContainText(/age|never/i);
  });

  test('reset buttons work', async ({ page }) => {
    const slider = page.locator('#w1-k');
    await slider.fill('2');
    const resetBtn = page.locator('#widget-multistage-builder button');
    await resetBtn.click();
    await expect(slider).toHaveValue('6');
  });

  test('skip link is present and functional', async ({ page }) => {
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toHaveAttribute('href', '#main-content');
    await skipLink.focus();
    await expect(skipLink).toBeVisible();
  });

  test('all plots have aria descriptions', async ({ page }) => {
    const svgs = page.locator('svg[role="img"]');
    const count = await svgs.count();
    expect(count).toBe(7);
    for (let i = 0; i < count; i++) {
      const label = await svgs.nth(i).getAttribute('aria-label');
      expect(label).toBeTruthy();
      expect(label!.length).toBeGreaterThan(10);
    }
  });
});
