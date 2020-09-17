import 'expect-puppeteer';
import path from 'path';
import defaults from '../src/defaults';

const scrollAnimationDelay = defaults.throttleDelay;

let eLog = {
  anchor: [],
  saved: [],
};

beforeAll(async () => {
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

test('should scroll to anchor on anchorShow api call', async () => {
  // Setup
  let result = await page.$eval('[data-scroll-stash="example-2"]', (el) => {
    document.querySelector('#example-2').scrollIntoView();
    el.scrollTop = 0;
    return el.scrollTop;
  });
  expect(result).toBe(0);

  // Click button and wait for animation
  await page.$eval('[data-scroll-stash="example-2"]', (el) => {
    const btn = el.closest('.example').querySelector('.js-api-anchor-show');
    btn.click();
  });
  await page.waitForTimeout(scrollAnimationDelay);

  // Check scroll position
  result = await page.$eval('[data-scroll-stash="example-2"]', (el) => {
    return el.scrollTop;
  });
  expect(result).toBe(217);
});

test('should scroll to anchor with space adjustments on anchorShow api call', async () => {
  // Setup
  let result = await page.$eval('[data-scroll-stash="example-3"]', (el) => {
    document.querySelector('#example-3').scrollIntoView();
    el.scrollTop = 0;
    return el.scrollTop;
  });
  expect(result).toBe(0);

  // Click button and wait for animation
  await page.$eval('[data-scroll-stash="example-3"]', (el) => {
    const btn = el.closest('.example').querySelector('.js-api-anchor-show');
    btn.click();
  });
  await page.waitForTimeout(scrollAnimationDelay);

  // Check scroll position
  result = await page.$eval('[data-scroll-stash="example-3"]', (el) => {
    return el.scrollTop;
  });
  expect(result).toBe(107);

  // Setup
  result = await page.$eval('[data-scroll-stash="example-3"]', (el) => {
    document.querySelector('#example-3').scrollIntoView();
    el.scrollTop = 9999;
    return el.scrollTop;
  });
  expect(result).toBe(517);

  // Click button and wait for animation
  await page.$eval('[data-scroll-stash="example-3"]', (el) => {
    const btn = el.closest('.example').querySelector('.js-api-anchor-show');
    btn.click();
  });
  await page.waitForTimeout(scrollAnimationDelay);

  // Check scroll position
  result = await page.$eval('[data-scroll-stash="example-3"]', (el) => {
    return el.scrollTop;
  });
  expect(result).toBe(369);
});

test('should scroll to custom anchor on anchorShow api call', async () => {
  // Setup
  let result = await page.$eval('[data-scroll-stash="example-4"]', (el) => {
    document.querySelector('#example-4').scrollIntoView();
    el.scrollTop = 0;
    return el.scrollTop;
  });
  expect(result).toBe(0);

  // Click button and wait for animation
  await page.$eval('[data-scroll-stash="example-4"]', (el) => {
    const btn = el.closest('.example').querySelector('.js-api-anchor-show');
    btn.click();
  });
  await page.waitForTimeout(scrollAnimationDelay);

  // Check scroll position
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
  await page.waitForTimeout(scrollAnimationDelay);
  expect(result).toBe(null);

  const eCount = eLog.saved.length;
  await page.$eval('#page', (el) => {
    el.scrollTop = 0;
  });
  await page.waitForTimeout(scrollAnimationDelay);
  expect(eLog.saved.length).toBe(eCount);
});

test('should re-initialize scroll-stash instance on api call', async () => {
  let result = await page.evaluate(() => {
    document.querySelector('#example-api').scrollIntoView();
    document.querySelector('.js-api-destroy').click();
    return localStorage.getItem('ScrollStash');
  });
  await page.waitForTimeout(scrollAnimationDelay);
  expect(result).toBe(null);

  const eSavedCount = eLog.saved.length;
  const eAnchorCount = eLog.anchor.length;

  result = await page.evaluate(() => {
    document.querySelector('.js-api-init').click();
    return localStorage.getItem('ScrollStash');
  });
  await page.waitForTimeout(scrollAnimationDelay);
  expect(result).not.toBe(null);
  expect(eLog.saved.length).toBe(eSavedCount + 1);
  expect(eLog.anchor.length).toBe(eAnchorCount);
});
