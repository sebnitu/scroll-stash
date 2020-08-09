import throttle from 'lodash.throttle';
import isEmpty from 'lodash.isempty';
import { defaults } from './settings';
import anchor from './anchor';
import state from './state';

class ScrollStash {
  constructor(options) {
    this.settings = { ...defaults, ...options };
    this.state = {};
    this.scrolls = [];
    if (this.settings.autoInit) this.init();
  }

  handler() {
    this.state = state.save(this.settings);
  }

  throttleRef() {
    throttle(this.handler, this.settings.throttleDelay, { leading: false });
  }

  init(options = null) {
    if (options) this.settings = { ...this.settings, ...options };
    this.state = state.set(this.settings);
    this.state = (isEmpty(this.state)) ? state.save(this.settings) : this.state;
    this.scrolls = document.querySelectorAll(`[data-${this.settings.dataScroll}]`);
    this.scrolls.forEach((item) => {
      item.addEventListener('scroll', this.throttleRef.bind(this), false);
      anchor.show(item, false, this.settings);
    });
  }

  destroy() {
    this.scrolls.forEach((item) => {
      item.removeEventListener('scroll', this.throttleRef.bind(this), false);
    });
    this.state = {};
    this.scrolls = [];
    localStorage.removeItem(this.settings.saveKey);
  }

  // api.anchor = {
  //   get: (el) => {
  //     return anchor.get(el, api.settings);
  //   },
  //   show: (el, behavior) => {
  //     return anchor.show(el, behavior, api.settings);
  //   }
  // }
}

export default ScrollStash;
