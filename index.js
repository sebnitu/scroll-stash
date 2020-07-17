import { saveScrollPosition } from './src/saveScrollPosition';
import { setScrollPosition } from './src/setScrollPosition';
import { showAnchor } from './src/showAnchor';

export default (options) => {

  let api = {
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
    throttleDelay: 250,
    customEventPrefix: 'scroll-stash:',
  };

  api.settings = { ...defaults, ...options };

  api.scrolls = [];
  api.state = {};
  api.ticking = false;

  api.init = () => {
    api.scrolls = document.querySelectorAll(`[data-${api.settings.dataScroll}]`);
    api.state = setScrollPosition(api.state, api.settings);
    api.scrolls.forEach((item) => {
      showAnchor(item, false, api.settings);
      item.addEventListener('scroll', throttle, false);
    });
  };

  api.destroy = () => {
    api.scrolls.forEach((item) => {
      item.removeEventListener('scroll', throttle, false);
    });
    api.scrolls = [];
    api.state = {};
    localStorage.removeItem(api.settings.saveKey);
  };

  const throttle = () => {
    if (!api.ticking) {
      setTimeout(run, api.settings.throttleDelay);
      api.ticking = true;
    }
  };

  const run = () => {
    api.state = saveScrollPosition(api.state, api.settings);
    api.ticking = false;
  };

  if (api.settings.autoInit) api.init();
  return api;
};
