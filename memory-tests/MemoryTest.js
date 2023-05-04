const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http://localhost:3000');

  await page.tracing.start({ path: 'trace.json', categories: ['devtools.timeline'] });

  await page.tracing.stop();

  const performanceTiming = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.timing)),
  );
  const timeToFirstByte = performanceTiming.responseStart - performanceTiming.navigationStart;
  const domContentLoaded =
    performanceTiming.domContentLoadedEventEnd - performanceTiming.navigationStart;
  const pageLoadTime = performanceTiming.loadEventEnd - performanceTiming.navigationStart;

  console.log('Time to First Byte:', timeToFirstByte);
  console.log('DOM Content Loaded:', domContentLoaded);
  console.log('Page Load Time:', pageLoadTime);

  const memory = await page.metrics();
  console.log(memory);
  console.log('Memory Usage:', memory.JSHeapUsedSize / 1024 / 1024, 'MB');

  await browser.close();
})();
