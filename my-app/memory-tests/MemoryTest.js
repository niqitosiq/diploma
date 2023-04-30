const puppeteer = require('puppeteer');

describe('Memory usage', () => {
  it('should not increase memory usage on render', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('http://localhost:3000');

    // Получаем начальное использование памяти
    const initialMemoryUsage = await page.evaluate(() => performance.memory.usedJSHeapSize);

    await page.reload();

    // Получаем использование памяти после рендера
    const finalMemoryUsage = await page.evaluate(() => performance.memory.usedJSHeapSize);

    await browser.close();

    expect(finalMemoryUsage).toBeLessThanOrEqual(initialMemoryUsage);
  });
});
