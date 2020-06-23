import 'expect-puppeteer';

describe('Google', () => {
  beforeAll(async () => {
    await page.goto('https://google.com');
  });

  it('should display "google" text on page', async () => {
    // await jestPuppeteer.debug();
    await expect(page).toMatch('google');
  });
});
