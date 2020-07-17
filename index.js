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
    setScrollPosition();
    api.scrolls.forEach((item) => {
      showAnchor(item);
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

  api.showAnchor = (el, behavior = api.settings.behavior) => {
    showAnchor(el, behavior);
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
    document.dispatchEvent(new CustomEvent(api.settings.customEventPrefix + 'saved', {
      bubbles: true,
      detail: api.state
    }));
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
      document.dispatchEvent(new CustomEvent(api.settings.customEventPrefix + 'applied', {
        bubbles: true,
        detail: api.state
      }));
    } else {
      saveScrollPosition();
    }
  };

  const getAnchor = (el) => {
    // 1. If dataAnchor is disabled, return null
    const dataAnchor = el.dataset[camelCase(api.settings.dataAnchor)];
    if (dataAnchor == 'false' || dataAnchor == 'ignore') {
      return null;
    }

    // 2. If dataAnchor returns an anchor, return dataAnchor
    if (dataAnchor && el.querySelector(dataAnchor)) {
      return el.querySelector(dataAnchor);
    }

    // 3. If selectAnchor and parentAnchor return an anchor, return parentAnchor
    const selectorAnchor = (api.settings.selectorAnchor) ?
      el.querySelector(api.settings.selectorAnchor) : null;
    if (selectorAnchor && api.settings.selectorAnchorParent) {
      const parentAnchor = selectorAnchor.closest(api.settings.selectorAnchorParent);
      if (parentAnchor) return parentAnchor;
    }

    // 4. If selectAnchor returned an anchor, return selectorAnchor
    // 5. else null
    return (selectorAnchor) ? selectorAnchor : null;
  };

  const getPosTop = (el, anchor) => {
    let pos = api.settings.anchorPadding;
    if (api.settings.selectorTopElem) {
      const topElem = el.querySelector(api.settings.selectorTopElem);
      if (topElem) pos += topElem.offsetHeight;
    }
    return anchor.offsetTop - (pos);
  };

  const getPosBot = (el, anchor) => {
    let pos = api.settings.anchorPadding;
    if (api.settings.selectorBotElem) {
      const botElem = el.querySelector(api.settings.selectorBotElem);
      if (botElem) pos += botElem.offsetHeight;
    }
    return anchor.offsetTop - (el.offsetHeight - (anchor.offsetHeight + pos));
  };

  const getPosNearest = (el, anchor) => {
    const posTop = getPosTop(el, anchor);
    const posBot = getPosBot(el, anchor);

    if (el.scrollTop > posTop) return posTop;
    if (el.scrollTop < posBot) return posBot;
    return false;
  };

  const getPosition = (el, anchor) => {
    const align = api.settings.alignment;
    switch (align) {
    case 'start' : return getPosTop(el, anchor);
    case 'end' : return getPosBot(el, anchor);
    case 'nearest' : return getPosNearest(el, anchor);
    default: return false;
    }
  };

  const showAnchor = (el, behavior = api.settings.behavior) => {
    const anchor = getAnchor(el);

    if (anchor) {
      const position = getPosition(el, anchor);

      if (position) {
        el.scroll({
          top: position,
          behavior: behavior
        });
      } else {
        return true;
      }

      el.dispatchEvent(new CustomEvent(api.settings.customEventPrefix + 'anchor', {
        bubbles: true,
        detail: {
          key: el.dataset[camelCase(api.settings.dataScroll)],
          position: el.scrollTop,
        }
      }));
    }
  };

  if (api.settings.autoInit) api.init();
  return api;
};
