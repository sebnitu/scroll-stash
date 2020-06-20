export default (options) => {

  let api = {};
  const defaults = {
    autoInit: false,
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

  api.lastPosition = 0;
  api.ticking = false;
  api.element = false;

  api.init = () => {
    api.element = document.querySelector(api.settings.selector);
    if (api.element) {
      setScrollPosition();
      if (api.settings.selectorActive) {
        showActive(api.element);
      }
      api.element.addEventListener('scroll', throttle, false);
    }
  };

  api.destroy = () => {
    if (api.element) {
      api.element.removeEventListener('scroll', throttle, false);
    }
  };

  api.showActive = (el) => {
    if (api.settings.selectorActive) {
      showActive(el);
    }
  };

  const throttle = (event) => {
    api.lastPosition = event.target.scrollTop;
    if (!api.ticking) {
      setTimeout(run, api.settings.throttleDelay);
      api.ticking = true;
    }
  };

  const run = () => {
    console.log(api.element.scrollTop);
    saveScrollPosition();
    api.ticking = false;
  };

  const saveScrollPosition = () => {
    localStorage.setItem(api.settings.saveKey, api.lastPosition);
  };

  const setScrollPosition = () => {
    let pos = localStorage.getItem(api.settings.saveKey);
    if (pos) {
      api.element.scrollTop = pos;
    }
  };

  const showActive = (el) => {
    let active = el.querySelector(api.settings.selectorActive);
    if (api.settings.selectorActiveParent) {
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
