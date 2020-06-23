import 'expect-puppeteer';
import path from 'path';

describe('Example page', () => {
  beforeAll(async () => {
    await page.goto(`file:${path.join(__dirname, '../example.html')}`);
  });

  it('should display "scroll-stash" in the page title', async () => {
    // await jestPuppeteer.debug();
    await expect(await page.title()).toEqual('scroll-stash');
  });
});
