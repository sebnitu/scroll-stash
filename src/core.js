import throttle from 'lodash.throttle';
import { anchorShow } from './anchor';
import state from './state';

export default (options) => {

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

  const api = {
    anchorShow: (el, behavior) => {
      anchorShow(el, behavior, api.settings);
    }
  };

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
      anchorShow(item, false, api.settings);
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
