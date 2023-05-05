import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import path from 'path';
import puppeteerProfile from './perfTests.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import process from 'child_process';
import currentProcess from 'node:process';
import { allActionsUserStory } from './userStories.js';
import { log } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const revision = currentProcess.argv[2];

export const log_file = (fileName) =>
  fs.createWriteStream(__dirname + `/results/${fileName}`, { flags: 'w' });

const url = 'http://localhost:3000';

function computeAverage(arrays, keyPath) {
  let total = 0;
  let count = 0;

  for (const array of arrays) {
    let value = array;
    for (const key of keyPath) {
      value = value[key];
      if (!value) break;
    }

    if (value && typeof value === 'number') {
      total += value;
      count++;
    }
  }

  return count !== 0 ? total / count : null;
}

function computeAverageForKeys(keys, results, keyPath) {
  const result = {};

  for (const key of keys) {
    result[key] = computeAverage(results, keyPath.concat([key]));
  }

  return result;
}

export const makePerformaceProfile = async (page, title) => {
  const profilePage = puppeteerProfile(page);

  const timings = await profilePage.timings();
  const heap = await profilePage.profileHeap();
  const metrics = await profilePage.runtimeMetrics();

  return {
    title,
    timings,
    heap,
    metrics,
  };
};

const makeLHRScores = async (page) => {
  const { lhr } = await lighthouse(url, undefined, undefined, page);

  const lhrScores = Object.entries(lhr.categories).reduce((acc, [key, value]) => {
    acc[key] = value.score;
    return acc;
  }, {});

  return { lhrScores };
};

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  browser.on('targetchanged', async (target) => {
    if (page && page.url() === url) {
      await page.addStyleTag({ content: '* {color: red}' });
    }
  });

  const results = [];
  await page.goto(url, {
    waitUntil: 'networkidle0',
  });

  results.push(await allActionsUserStory(page));
  await page.goto(url, {
    waitUntil: 'networkidle0',
  });
  results.push(await allActionsUserStory(page));
  await page.goto(url, {
    waitUntil: 'networkidle0',
  });
  results.push(await allActionsUserStory(page));
  await page.goto(url, {
    waitUntil: 'networkidle0',
  });
  results.push(await allActionsUserStory(page));
  await page.goto(url, {
    waitUntil: 'networkidle0',
  });
  results.push(await allActionsUserStory(page));

  const averageStoryResults = results.map((result) => {
    const resultNew = {
      ...result,
    };
    const timingsKeys = Object.keys(result[0].timings);
    const metricsKeys = ['heap'].concat(Object.keys(result[0].metrics));

    resultNew.timings = computeAverageForKeys(timingsKeys, result, ['timings']);

    for (const key of metricsKeys) {
      if (key === 'heap') {
        resultNew[key] = computeAverage(result, [key]);
      } else {
        if (!resultNew.metrics) resultNew.metrics = {};
        resultNew.metrics[key] = computeAverage(result, ['metrics', key]);
      }
    }

    return resultNew;
  });

  const lhrResults = await makeLHRScores(page);

  log_file(revision.slice(0, 7) + '.json').write(
    JSON.stringify({ revision, averageStoryResults, lhrResults }),
  );

  console.log(revision.slice(0, 7));

  await browser.close();
})();
