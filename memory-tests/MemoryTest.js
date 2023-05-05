import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import path from 'path';
import puppeteerProfile from './perfTests.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import process from 'child_process';
import currentProcess from 'node:process';
import { allActionsUserStory } from './userStories.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitBranchName = currentProcess.argv[2];

export const log_file = (fileName) =>
  fs.createWriteStream(__dirname + `/results/${fileName}`, { flags: 'w' });

const url = 'http://localhost:3000';

export const makePerformaceProfile = async (page) => {
  const profilePage = puppeteerProfile(page);

  const timings = await profilePage.timings();
  const heap = await profilePage.profileHeap();
  const metrics = await profilePage.runtimeMetrics();

  return {
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
  await process.execSync(`git checkout ${gitBranchName}`);

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  browser.on('targetchanged', async (target) => {
    if (page && page.url() === url) {
      await page.addStyleTag({ content: '* {color: red}' });
    }
  });

  await page.goto(url);

  const revision = process.execSync('git rev-parse HEAD').toString().trim();

  const storyResults = await allActionsUserStory(page);

  const lhrResults = await makeLHRScores(page);

  log_file(revision.slice(0, 5) + '.json').write(
    JSON.stringify({ revision, storyResults, lhrResults }),
  );

  await browser.close();
})();
