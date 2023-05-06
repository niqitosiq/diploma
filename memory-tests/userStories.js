import { makePerformaceProfile } from './MemoryTest.js';

const allActionsUserStory = async (page) => {
  const t1 = await makePerformaceProfile(page, 'start');

  await page.waitForSelector('.leaflet-marker-icon:nth-child(25)');
  const marker25 = await page.$('.leaflet-marker-icon:nth-child(25)');
  await marker25.click();

  const t2 = await makePerformaceProfile(page, 'marker clicked');

  await page.waitForSelector('.user-details button');
  const closeButton = await page.$('.user-details button');
  closeButton.click();

  const tClose = await makePerformaceProfile(page, 'Popup closed');

  await page.waitForSelector('.leaflet-marker-icon:nth-child(5)');
  const marker68 = await page.$('.leaflet-marker-icon:nth-child(5)');
  if (marker68) marker68.click();

  const t3 = await makePerformaceProfile(page, 'marker2 clicked');
  await page.waitForTimeout(1000);

  await page.waitForSelector('.search-user input');
  await page.focus('.search-user input');
  page.keyboard.type('a');
  await page.waitForTimeout(300);
  page.keyboard.type('n');
  const w1 = await makePerformaceProfile(page, '1 word');
  await page.waitForTimeout(300);
  const w2 = await makePerformaceProfile(page, '2 word');
  page.keyboard.type('i');
  const w3 = await makePerformaceProfile(page, '3 word');
  await page.waitForTimeout(1000);

  const t4 = await makePerformaceProfile(page, 'input filled');

  await page.waitForSelector('.user-list li:nth-child(1)');
  const userLi = await page.$('.user-list li:nth-child(1)');
  userLi.click();

  const t5 = await makePerformaceProfile(page, 'List selected');

  return [t1, t2, tClose, t3, w1, w2, w3, t4, t5];
};

export { allActionsUserStory };
