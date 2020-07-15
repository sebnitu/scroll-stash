import 'expect-puppeteer';
import pti from 'puppeteer-to-istanbul';
import path from 'path';
import { throttleDelay } from './helpers/throttleDelay';

const scrollAnimationDelay = 300;

let eLog = {
  anchor: [],
  saved: [],
};

beforeAll(async () => {
  await page.coverage.startJSCoverage();
  await page.exposeFunction('onCustomEvent', ({ type, detail, target }) => {
    if (type == 'scroll-stash:anchor') {
      eLog.anchor.push({ type, detail, target });
    } else if (type == 'scroll-stash:saved') {
      eLog.saved.push({ type, detail, target });
    }
  });

  await page.evaluateOnNewDocument(() => {
    window.addEventListener('scroll-stash:anchor', ({ type, detail, target }) => {
      window.onCustomEvent({ type, detail, target });
    });
    window.addEventListener('scroll-stash:saved', ({ type, detail, target }) => {
      window.onCustomEvent({ type, detail, target });
    });
  });

  await page.goto(`file:${path.join(__dirname, '../example.html')}`);
});

afterAll(async () => {
  const jsCoverage = await page.coverage.stopJSCoverage();
  pti.write(jsCoverage);
});

test('should scroll to anchor on showAnchor api call', async () => {
  let result = await page.$eval('[data-scroll-stash="example-2"]', (el) => {
    document.querySelector('#example-2').scrollIntoView();
    const btn = el.closest('.example').querySelector('.js-api-showAnchor');
    el.scrollTop = 0;
    btn.click();
    return el.scrollTop;
  });
  expect(result).toBe(0);
  await throttleDelay(scrollAnimationDelay);
  result = await page.$eval('[data-scroll-stash="example-2"]', (el) => {
    return el.scrollTop;
  });
  expect(result).toBe(217);
});

test('should scroll to anchor with space adjustments on showAnchor api call', async () => {
  let result = await page.$eval('[data-scroll-stash="example-3"]', (el) => {
    document.querySelector('#example-3').scrollIntoView();
    const btn = el.closest('.example').querySelector('.js-api-showAnchor');
    el.scrollTop = 0;
    btn.click();
    return el.scrollTop;
  });
  expect(result).toBe(0);
  await throttleDelay(scrollAnimationDelay);
  result = await page.$eval('[data-scroll-stash="example-3"]', (el) => {
    return el.scrollTop;
  });
  expect(result).toBe(107);

  result = await page.$eval('[data-scroll-stash="example-3"]', (el) => {
    document.querySelector('#example-3').scrollIntoView();
    const btn = el.closest('.example').querySelector('.js-api-showAnchor');
    el.scrollTop = 9999;
    btn.click();
    return el.scrollTop;
  });
  expect(result).toBe(517);
  await throttleDelay(scrollAnimationDelay);
  result = await page.$eval('[data-scroll-stash="example-3"]', (el) => {
    return el.scrollTop;
  });
  expect(result).toBe(369);
});

test('should scroll to custom anchor on showAnchor api call', async () => {
  let result = await page.$eval('[data-scroll-stash="example-4"]', (el) => {
    document.querySelector('#example-4').scrollIntoView();
    const btn = el.closest('.example').querySelector('.js-api-showAnchor');
    el.scrollTop = 0;
    btn.click();
    return el.scrollTop;
  });
  expect(result).toBe(0);
  await throttleDelay(scrollAnimationDelay);
  result = await page.$eval('[data-scroll-stash="example-4"]', (el) => {
    return el.scrollTop;
  });
  expect(result).toBe(217);
});

test('should properly destroy scroll-stash instance on api call', async () => {
  const result = await page.evaluate(() => {
    document.querySelector('#example-api').scrollIntoView();
    document.querySelector('.js-api-destroy').click();
    return localStorage.getItem('ScrollStash');
  });
  await throttleDelay();
  expect(result).toBe(null);

  const eCount = eLog.saved.length;
  await page.$eval('#page', (el) => {
    el.scrollTop = 0;
  });
  await throttleDelay();
  expect(eLog.saved.length).toBe(eCount);
});

test('should re-initialize scroll-stash instance on api call', async () => {
  let result = await page.evaluate(() => {
    document.querySelector('#example-api').scrollIntoView();
    document.querySelector('.js-api-destroy').click();
    return localStorage.getItem('ScrollStash');
  });
  await throttleDelay();
  expect(result).toBe(null);

  const eSavedCount = eLog.saved.length;
  const eAnchorCount = eLog.anchor.length;

  result = await page.evaluate(() => {
    document.querySelector('.js-api-init').click();
    return localStorage.getItem('ScrollStash');
  });
  await throttleDelay();
  expect(result).not.toBe(null);
  expect(eLog.saved.length).toBe(eSavedCount + 1);
  expect(eLog.anchor.length).toBe(eAnchorCount);
});
