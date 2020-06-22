import { camelCase } from '@vrembem/core';

export default (options) => {

  let api = {};
  const defaults = {
    autoInit: false,
    dataScroll: 'scroll-stash',
    dataAnchor: 'scroll-stash-anchor',
    selectorAnchor: '',
    selectorAnchorParent: '',
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
    setScrollPosition();
    api.scrolls.forEach((item) => {
      if (api.settings.selectorAnchor) {
        showAnchor(item);
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

  api.showAnchor = (el) => {
    if (api.settings.selectorAnchor) {
      showAnchor(el);
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

  const showAnchor = (el) => {
    // Element size and scrolling
    // https://javascript.info/size-and-scroll

    let anchor = el.querySelector(api.settings.selectorAnchor);
    if (anchor && api.settings.selectorAnchorParent) {
      anchor = anchor.closest(api.settings.selectorAnchorParent);
    }

    const dataAnchor = el.dataset[camelCase(api.settings.dataAnchor)];
    if (dataAnchor == ('false' || '0')) {
      return false;
    } else if (dataAnchor) {
      anchor = (el.querySelector(dataAnchor)) ? el.querySelector(dataAnchor) : anchor;
    }

    if (anchor) {
      let adjustTop = api.settings.padding;
      let adjustBot = api.settings.padding;
      if (api.settings.selectorTopElem) {
        const topElem = el.querySelector(api.settings.selectorTopElem);
        if (topElem) {
          adjustTop = adjustTop + topElem.offsetHeight;
        }
      }
      if (api.settings.selectorBotElem) {
        const botElem = el.querySelector(api.settings.selectorBotElem);
        if (botElem) {
          adjustBot = adjustBot + botElem.offsetHeight;
        }
      }

      const posTop = anchor.offsetTop - (adjustTop);
      const posBot = anchor.offsetTop - (el.offsetHeight - (anchor.offsetHeight + adjustBot));

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
