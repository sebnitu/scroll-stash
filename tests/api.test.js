import ScrollStash from '../index.js';
import '@testing-library/jest-dom/extend-expect';

let scrollStash;

const markup = `
  <div data-scroll-stash="example-1">...</div>
  <div data-scroll-stash="example-2">...</div>
  <div data-scroll-stash="example-3">...</div>
`;

beforeEach(() => {
  document.body.innerHTML = null;
});

afterEach(() => {
  scrollStash.destroy();
  scrollStash = null;
});

test('init api should properly initialize scroll-stash', () => {
  document.body.innerHTML = markup;
  scrollStash = new ScrollStash();

  expect(localStorage.getItem(scrollStash.settings.saveKey)).toEqual(null);
  scrollStash.init();
  expect(localStorage.getItem(scrollStash.settings.saveKey)).not.toEqual(null);

  const state = JSON.parse(localStorage.getItem(scrollStash.settings.saveKey));
  const expectState = {
    'example-1': 0,
    'example-2': 0,
    'example-3': 0
  };

  expect(state).toMatchObject(expectState);
});

test('should properly destroy scroll-stash instance on api call', () => {
  document.body.innerHTML = markup;
  scrollStash = new ScrollStash();

  expect(localStorage.getItem(scrollStash.settings.saveKey)).toEqual(null);
  scrollStash.init();
  expect(localStorage.getItem(scrollStash.settings.saveKey)).not.toEqual(null);

  scrollStash.destroy();
  expect(localStorage.getItem(scrollStash.settings.saveKey)).toEqual(null);
});
