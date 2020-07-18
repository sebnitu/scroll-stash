import throttle from 'lodash.throttle';
import isEmpty from 'lodash.isEmpty';
import { defaults } from './settings';
import anchor from './anchor';
import state from './state';

export default (options) => {

  const api = {};

  api.settings = { ...defaults, ...options };
  api.state = {};
  api.scrolls = [];

  const handler = () => api.state = state.save(api.settings);
  const throttleRef = throttle(handler, api.settings.throttleDelay, { leading: false });

  api.init = (options = null) => {
    if (options) api.settings = { ...api.settings, ...options };
    api.state = state.set(api.settings);
    api.state = (isEmpty(api.state)) ? state.save(api.settings) : api.state;
    api.scrolls = document.querySelectorAll(`[data-${api.settings.dataScroll}]`);
    api.scrolls.forEach((item) => {
      item.addEventListener('scroll', throttleRef, false);
      anchor.show(item, false, api.settings);
    });
  };

  api.destroy = () => {
    api.scrolls.forEach((item) => {
      item.removeEventListener('scroll', throttleRef, false);
    });
    api.state = {};
    api.scrolls = [];
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
