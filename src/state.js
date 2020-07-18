import { camelCase } from '@vrembem/core';

export const stateSave = (state, settings) => {
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

export const stateSet = (state, settings) => {
  if (localStorage.getItem(settings.saveKey)) {
    state = JSON.parse(localStorage.getItem(settings.saveKey));
    Object.keys(state).forEach((key) => {
      const item = document.querySelector(
        `[data-${settings.dataScroll}="${key}"]`
      );
      if (item) item.scrollTop = state[key];
    });
    document.dispatchEvent(new CustomEvent(settings.customEventPrefix + 'applied', {
      bubbles: true,
      detail: state
    }));
    return state;
  } else {
    return stateSave(state, settings);
  }
};

export default {
  save: stateSave,
  set: stateSet
};
