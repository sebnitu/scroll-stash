import { camelCase } from '@vrembem/core';

export const saveScrollPosition = (state, settings) => {
  const scrolls = document.querySelectorAll(`[data-${settings.dataScroll}]`);
  scrolls.forEach((el) => {
    const id = el.dataset[camelCase(settings.dataScroll)];
    if (id) state[id] = el.scrollTop;
  });
  localStorage.setItem(settings.saveKey, JSON.stringify(state));
  document.dispatchEvent(new CustomEvent(settings.customEventPrefix + 'saved', {
    bubbles: true,
    detail: state
  }));
  return state;
};
