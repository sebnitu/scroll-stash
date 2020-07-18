import { throttle } from 'lodash';
import { defaults } from './src/settings';
import { saveScrollPosition } from './src/saveScrollPosition';
import { setScrollPosition } from './src/setScrollPosition';
import { showAnchor } from './src/showAnchor';

export default (options) => {

  let api = {
    showAnchor: (el, behavior) => {
      showAnchor(el, behavior, api.settings);
    }
  };

  api.settings = { ...defaults, ...options };

  api.scrolls = [];
  api.state = {};

  const handler = () => api.state = saveScrollPosition(api.state, api.settings);
  const throttleRef = throttle(handler, api.settings.throttleDelay, { leading: false });

  api.init = (options = null) => {
    if (options) api.settings = { ...api.settings, ...options };
    api.scrolls = document.querySelectorAll(`[data-${api.settings.dataScroll}]`);
    api.state = setScrollPosition(api.state, api.settings);
    api.scrolls.forEach((item) => {
      showAnchor(item, false, api.settings);
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

  if (api.settings.autoInit) api.init();
  return api;
};
