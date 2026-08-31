import { test, expect } from '@playwright/test';

test('player chooses a character and completes a prayer', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Prayer Warrior' })).toBeVisible();
  await expect(page.getByText('Enter the Prayer Room. Pray some Old School Prayers.')).toBeVisible();
  await expect(page.getByText('The Chamber Awaits')).toHaveCount(0);
  await expect(page.getByText('Character choice is visual only. Prayer is not a contest.')).toHaveCount(0);

  await page.getByRole('button', { name: 'Choose woman' }).click();
  const prayerHeading = page.locator('#prayer-title');
  await expect(prayerHeading).toBeVisible();
  await expect(prayerHeading).toHaveText(/\S/);
  await expect(page.getByTestId('prayer-text')).toContainText('Amen.');
  const prayerWidth = await page.getByTestId('prayer-text').evaluate((element) => element.getBoundingClientRect().width);
  expect(prayerWidth).toBeLessThanOrEqual(420);

  const count = page.getByTestId('prayed-count');
  await expect(count).toHaveText('0');
  await page.getByRole('button', { name: 'Prayed' }).click();
  await expect(page.getByTestId('character')).toHaveAttribute('data-state', 'praying');
  await expect(page.locator('.character-sprite')).toHaveAttribute('src', /warrior-female-praying\.png$/);
  await expect(count).toHaveText('1');
  await expect(page.getByText('Your prayer is heard by the Father who sees in secret.')).toBeVisible();

  await page.getByRole('button', { name: 'Pray Another Prayer' }).click();
  await expect(page.getByTestId('character')).toHaveAttribute('data-state', 'ready');
});

test('keyboard and reduced motion remain usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Choose man' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Prayed' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('prayed-count')).toHaveText('1');
});
