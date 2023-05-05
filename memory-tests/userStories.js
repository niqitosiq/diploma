import { log_file, makePerformaceProfile } from './MemoryTest.js';

const allActionsUserStory = async (page) => {
  const t1 = await makePerformaceProfile(page);
  await page.waitForTimeout(10000);
  await page.waitForSelector('.leaflet-marker-icon:nth-child(25)');
  const marker25 = await page.$('.leaflet-marker-icon:nth-child(25)');
  await marker25.click();
  console.log(`marker25 clicked`);

  const t2 = await makePerformaceProfile(page);

  await page.waitForSelector('.user-details button');
  const closeButton = await page.$('.user-details button');
  closeButton.click();
  console.log(`clicked closeButton`);

  const t3 = await makePerformaceProfile(page);
  await page.waitForSelector('.leaflet-marker-icon:nth-child(5)');
  const marker68 = await page.$('.leaflet-marker-icon:nth-child(5)');
  marker68.click();
  console.log(`marker68 clicked`);

  await page.waitForTimeout(1000);

  await page.waitForSelector('.search-user input');
  await page.focus('.search-user input');
  page.keyboard.type('i');
  await page.waitForTimeout(2500);
  page.keyboard.type('n');
  await page.waitForTimeout(2500);

  const t4 = await makePerformaceProfile(page);

  const userLi = await page.$('.user-list li:nth-child(1)');
  userLi.click();

  const t5 = await makePerformaceProfile(page);

  return [t1, t2, t3, t4, t5];
};

export { allActionsUserStory };
