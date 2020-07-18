import throttle from 'lodash.throttle';
import { defaults } from './settings';
import anchor from './anchor';
import state from './state';

export default (options) => {

  const api = {};

  api.settings = { ...defaults, ...options };
  api.scrolls = [];
  api.state = {};

  const handler = () => api.state = state.save(api.state, api.settings);
  const throttleRef = throttle(handler, api.settings.throttleDelay, { leading: false });

  api.init = (options = null) => {
    if (options) api.settings = { ...api.settings, ...options };
    api.scrolls = document.querySelectorAll(`[data-${api.settings.dataScroll}]`);
    api.state = state.set(api.state, api.settings);
    api.scrolls.forEach((item) => {
      anchor.show(item, false, api.settings);
      item.addEventListener('scroll', throttleRef, false);
    });
  };

  api.destroy = () => {
    api.scrolls.forEach((item) => {
      item.removeEventListener('scroll', throttleRef, false);
    });
    api.scrolls = [];
    api.state = {};
    localStorage.removeItem(api.settings.saveKey);
  };

  api.anchor = {
    get: (el) => {
      return anchor.get(el, api.settings);
    },
    show: (el, behavior) => {
      return anchor.show(el, behavior, api.settings);
    }
  };

  if (api.settings.autoInit) api.init();

  return api;
};
