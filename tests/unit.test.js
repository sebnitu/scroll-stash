/**
 * @jest-environment jsdom
 */

import ScrollStash from '../index.js';
import '@testing-library/jest-dom/extend-expect';
import { throttleDelay } from './helpers/throttleDelay';

let scrollStash;

const markup = `
  <div data-scroll-stash="example-1" data-scroll-stash-anchor=".anchor">
    <span class="top"></span>
    <span class="anchor"></span>
    <span class="bot"></span>
  </div>
  <div data-scroll-stash="example-2"></div>
  <div data-scroll-stash="example-3"></div>
`;

beforeEach(() => {
  document.body.innerHTML = markup;
});

afterEach(() => {
  scrollStash.destroy();
  scrollStash = null;
});

test('should save scroll stash instances and scroll position on init', () => {
  scrollStash = new ScrollStash({ autoInit: true });
  const storage = JSON.parse(localStorage.getItem('ScrollStash'));
  expect(scrollStash.state).toEqual(storage);
});

test('should update state on scrolll event', async () => {
  scrollStash = new ScrollStash({ autoInit: true });
  const el1 = document.querySelector('[data-scroll-stash="example-1"]');
  const el2 = document.querySelector('[data-scroll-stash="example-2"]');
  const el3 = document.querySelector('[data-scroll-stash="example-3"]');
  el1.scrollTop = 100;
  el2.scrollTop = 200;
  el3.scrollTop = 300;
  el1.dispatchEvent(new CustomEvent('scroll'));
  await throttleDelay();
  const storage = JSON.parse(localStorage.getItem('ScrollStash'));
  expect(scrollStash.state).toEqual(storage);
  expect(scrollStash.state['example-1']).toEqual(100);
  expect(scrollStash.state['example-2']).toEqual(200);
  expect(scrollStash.state['example-3']).toEqual(300);
});

test('should apply saved scroll state to a fresh document', () => {
  localStorage.setItem('ScrollStash', JSON.stringify({
    'example-1': 25,
    'example-2': 50,
    'example-3': 75,
  }));
  const el1 = document.querySelector('[data-scroll-stash="example-1"]');
  const el2 = document.querySelector('[data-scroll-stash="example-2"]');
  const el3 = document.querySelector('[data-scroll-stash="example-3"]');
  expect(el1.scrollTop).toBe(0);
  expect(el2.scrollTop).toBe(0);
  expect(el3.scrollTop).toBe(0);

  scrollStash = new ScrollStash({ autoInit: true });
  const storage = JSON.parse(localStorage.getItem('ScrollStash'));
  expect(scrollStash.state).toEqual(storage);
  expect(el1.scrollTop).toBe(25);
  expect(el2.scrollTop).toBe(50);
  expect(el3.scrollTop).toBe(75);
});

test('should scroll to anchor when anchor selector is set', () => {
  window.HTMLElement.prototype.scroll = jest.fn();

  scrollStash = new ScrollStash({
    autoInit: true,
    selectorAnchor: '.anchor',
    selectorAnchorParent: '.anchor-parent',
    selectorTopElem: '.top',
    selectorBotElem: '.bot',
  });
  const el1 = document.querySelector('[data-scroll-stash="example-1"]');
  expect(el1.scroll).toHaveBeenCalled();
});

test('should scroll to anchor when showAnchor api is called', () => {
  window.HTMLElement.prototype.scroll = jest.fn();
  scrollStash = new ScrollStash({
    autoInit: true,
    selectorAnchor: '.anchor',
  });
  const el1 = document.querySelector('[data-scroll-stash="example-1"]');
  scrollStash.showAnchor(el1);
  expect(el1.scroll).toHaveBeenCalled();
});

test('should ignore anchor selector if data value is set to false or ignore', () => {
  window.HTMLElement.prototype.scroll = jest.fn();
  const el1 = document.querySelector('[data-scroll-stash="example-1"]');
  el1.dataset.scrollStashAnchor = 'false';
  scrollStash = new ScrollStash({
    autoInit: true,
    selectorAnchor: '.anchor',
  });
  expect(el1.scroll).not.toHaveBeenCalled();

  scrollStash.destroy();
  el1.dataset.scrollStashAnchor = 'ignore';
  scrollStash = new ScrollStash({
    autoInit: true,
    selectorAnchor: '.anchor',
  });
  expect(el1.scroll).not.toHaveBeenCalled();

  scrollStash.destroy();
  delete el1.dataset.scrollStashAnchor;
  scrollStash = new ScrollStash({
    autoInit: true,
    selectorAnchor: '.anchor',
  });
  expect(el1.scroll).toHaveBeenCalled();
});
