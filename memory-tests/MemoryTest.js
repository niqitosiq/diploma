import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import path from 'path';
import puppeteerProfile from './perfTests.js';
import { allActionsUserStory } from './userStories.js';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const revision = process.argv[2];

export const log_file = (fileName) =>
  fs.createWriteStream(__dirname + `/results/${fileName}`, { flags: 'w' });

const url = 'http://localhost:3000';

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

const sumNestedFields = (first, second) => {
  return Object.keys(first).reduce((acc, key) => {
    acc[key] = first[key] + second[key];
    return acc;
  }, {});
};

const divisionNestedFields = (first, divider) => {
  return Object.keys(first).reduce((acc, key) => {
    acc[key] = first[key] / divider;
    return acc;
  }, {});
};

(async () => {
  const browser = await puppeteer.launch({ headless: false });

  const results = [];

  const page = await browser.newPage();

  for (let i = 0; i < 19; i++) {
    await page.goto(url, {
      waitUntil: 'networkidle0',
    });
    results.push(await allActionsUserStory(page));
  }

  const averageStoryResults = results.reduce(
    ({ totalResult, count }, storyResult, index) => {
      if (index === results.length - 1) {
        return totalResult.map((totalStoryStep) => ({
          ...totalStoryStep,
          heap: totalStoryStep.heap / count,
          timings: divisionNestedFields(totalStoryStep.timings, count),
          metrics: divisionNestedFields(totalStoryStep.metrics, count),
        }));
      }

      const summedResults = totalResult.map((totalStoryStep, storyStepIndex) => {
        const storyStep = storyResult[storyStepIndex];
        return {
          ...totalStoryStep,
          heap: totalStoryStep.heap + storyStep.heap,
          timings: sumNestedFields(totalStoryStep.timings, storyStep.timings),
          metrics: sumNestedFields(totalStoryStep.metrics, storyStep.metrics),
        };
      });

      return { totalResult: summedResults, count: count + 1 };
    },
    { totalResult: results[0], count: 1 },
  );

  await page.goto(url, {
    waitUntil: 'networkidle0',
  });

  browser.on('targetchanged', async (target) => {
    if (page && page.url() === url) {
      await page.addStyleTag({ content: '* {color: red}' });
    }
  });

  const lhrResults = await makeLHRScores(page);

  const revisionHash = revision.slice(0, 7);
  log_file(revisionHash + '.json').write(
    JSON.stringify({ revision, averageStoryResults, lhrResults }),
  );

  console.log(revisionHash);

  await browser.close();
})();
