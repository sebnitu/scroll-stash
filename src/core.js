import throttle from 'lodash.throttle';
import { saveScrollPosition } from './saveScrollPosition';
import { setScrollPosition } from './setScrollPosition';
import { showAnchor } from './showAnchor';

export default (options) => {

  const api = {
    showAnchor: (el, behavior) => {
      showAnchor(el, behavior, api.settings);
    }
  };

  const defaults = {
    autoInit: false,
    dataScroll: 'scroll-stash',
    dataAnchor: 'scroll-stash-anchor',
    selectorAnchor: '',
    selectorAnchorParent: '',
    selectorTopElem: '',
    selectorBotElem: '',
    alignment: 'nearest', // start | end | nearest
    behavior: 'auto', // auto | smooth
    anchorPadding: 16,
    saveKey: 'ScrollStash',
    throttleDelay: 100,
    customEventPrefix: 'scroll-stash:',
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
