import { camelCase } from '@vrembem/core';

export default (options) => {

  let api = {};
  const defaults = {
    autoInit: false,
    dataScroll: 'scroll-stash',
    selector: '[data-scroll-stash]',
    selectorActive: '',
    selectorActiveParent: '',
    selectorTopElem: '',
    selectorBotElem: '',
    saveKey: 'ScrollStash',
    throttleDelay: 500,
    positionBottom: true,
    padding: 16
  };

  api.settings = { ...defaults, ...options };

  api.scrolls = [];
  api.state = {};
  api.ticking = false;

  api.init = () => {
    api.scrolls = document.querySelectorAll(`[data-${api.settings.dataScroll}]`);
    api.scrolls.forEach((item) => {
      setScrollPosition();
      if (api.settings.selectorActive) {
        showActive(item);
      }
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

  api.showActive = (el) => {
    if (api.settings.selectorActive) {
      showActive(el);
    }
  };

  const throttle = () => {
    if (!api.ticking) {
      setTimeout(run, api.settings.throttleDelay);
      api.ticking = true;
    }
  };

  const run = () => {
    saveScrollPosition();
    api.ticking = false;
  };

  const saveScrollPosition = () => {
    const scrolls = document.querySelectorAll(`[data-${api.settings.dataScroll}]`);
    scrolls.forEach((el) => {
      const id = el.dataset[camelCase(api.settings.dataScroll)];
      if (id) api.state[id] = el.scrollTop;
    });
    localStorage.setItem(api.settings.saveKey, JSON.stringify(api.state));
  };

  const setScrollPosition = () => {
    if (localStorage.getItem(api.settings.saveKey)) {
      api.state = JSON.parse(localStorage.getItem(api.settings.saveKey));
      Object.keys(api.state).forEach((key) => {
        const item = document.querySelector(
          `[data-${api.settings.dataScroll}="${key}"]`
        );
        if (item) item.scrollTop = api.state[key];
      });
    } else {
      saveScrollPosition();
    }
  };

  const showActive = (el) => {
    let active = el.querySelector(api.settings.selectorActive);
    if (active && api.settings.selectorActiveParent) {
      active = active.closest(api.settings.selectorActiveParent);
    }

    if (active) {
      let adjustTop = api.settings.padding;
      let adjustBot = api.settings.padding;
      if (api.settings.selectorTopElem) {
        adjustTop = adjustTop + el.querySelector(api.settings.selectorElementPadding).offsetHeight;
      }
      if (api.settings.selectorBotElem) {
        adjustBot = adjustBot + el.querySelector(api.settings.selectorElementPadding).offsetHeight;
      }

      const posTop = active.offsetTop - (adjustTop);
      const posBot = active.offsetTop - (el.offsetHeight - (active.offsetHeight + adjustBot));

      if (el.scrollTop > posTop) {
        el.scrollTop = posTop;
      } else if (el.scrollTop < posBot) {
        el.scrollTop = posBot;
      }
    }
  };

  if (api.settings.autoInit) api.init();
  return api;
};
