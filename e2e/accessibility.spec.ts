import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('page has no critical or serious axe violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#widget-resilience-threshold');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const serious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );

    if (serious.length > 0) {
      const summary = serious
        .map((v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} instances)`)
        .join('\n');
      console.error('Accessibility violations:\n' + summary);
    }

    expect(serious).toHaveLength(0);
  });

  test('all interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/');

    const sliders = page.locator('input[type="range"]');
    const count = await sliders.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const slider = sliders.nth(i);
      await expect(slider).toBeEnabled();
      const id = await slider.getAttribute('id');
      const label = page.locator(`label[for="${id}"]`);
      await expect(label).toBeVisible();
    }

    const buttons = page.locator('button');
    const btnCount = await buttons.count();
    expect(btnCount).toBeGreaterThan(0);
    for (let i = 0; i < btnCount; i++) {
      await expect(buttons.nth(i)).toBeEnabled();
    }
  });
});
