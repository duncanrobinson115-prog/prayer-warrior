import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const output = new URL('../artifacts/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const report = [];

async function capture(name, viewport, characterChoice) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`page: ${error.message}`));
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await page.screenshot({ path: new URL(`${name}-selection.png`, output).pathname, fullPage: true });
  await page.getByRole('button', { name: characterChoice }).click();
  await page.screenshot({ path: new URL(`${name}-prayer.png`, output).pathname, fullPage: true });
  await page.getByRole('button', { name: 'Prayed' }).click();
  await page.waitForTimeout(450);
  await page.screenshot({ path: new URL(`${name}-completed.png`, output).pathname, fullPage: true });
  const metrics = await page.evaluate(() => ({
    viewport: { width: innerWidth, height: innerHeight },
    body: { width: document.body.scrollWidth, height: document.body.scrollHeight },
    prayerPanel: (() => {
      const box = document.querySelector('.prayer-panel').getBoundingClientRect();
      return { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
    })()
  }));
  report.push({ name, errors, metrics });
  await context.close();
}

await capture('desktop', { width: 1440, height: 900 }, 'Choose woman');
await capture('mobile', { width: 390, height: 844 }, 'Choose man');
await browser.close();
await writeFile(new URL('capture-report.json', output), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
