import throttle from 'lodash.throttle';
import isEmpty from 'lodash.isempty';
import { defaults } from './settings';
import anchor from './anchor';
import state from './state';

export default class ScrollStash {
  constructor(options) {
    this.settings = { ...defaults, ...options };
    this.state = {};
    this.scrolls = [];
    this.throttleRef = throttle(
      this.handler,
      this.settings.throttleDelay,
      { leading: false }
    ).bind(this);
    if (this.settings.autoInit) this.init();
  }

  init(options = null) {
    if (options) this.settings = { ...this.settings, ...options };
    this.state = state.set(this.settings);
    this.state = (isEmpty(this.state)) ? state.save(this.settings) : this.state;
    this.scrolls = document.querySelectorAll(`[data-${this.settings.dataScroll}]`);
    this.scrolls.forEach((item) => {
      item.addEventListener('scroll', this.throttleRef);
      anchor.show(item, false, this.settings);
    });
  }

  destroy() {
    this.scrolls.forEach((item) => {
      item.removeEventListener('scroll', this.throttleRef);
    });
    this.state = {};
    this.scrolls = [];
    localStorage.removeItem(this.settings.saveKey);
  }

  handler() {
    this.state = state.save(this.settings);
  }

  anchorGet(el) {
    return anchor.get(el, this.settings);
  }

  anchorShow(el, behavior) {
    return anchor.show(el, behavior, this.settings);
  }
}
