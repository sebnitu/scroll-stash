import { saveScrollPosition } from './saveScrollPosition';

export const setScrollPosition = (state, settings) => {
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
    return saveScrollPosition(state, settings);
  }
};
