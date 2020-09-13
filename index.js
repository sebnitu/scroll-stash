import defaults from './src/defaults';
import { anchorGet, anchorShow } from './src/anchor';
import { stateSave, stateSet } from './src/state';

export default class ScrollStash {
  constructor(options) {
    this.settings = { ...defaults, ...options };
    this.state = {};
    this.scrolls = [];
    this.ticking = false;
    this.handlerRef = this.handler.bind(this);
    if (this.settings.autoInit) this.init();
  }

  init(options = null) {
    if (options) this.settings = { ...this.settings, ...options };
    this.state = stateSet(this.settings);
    this.state = (!Object.keys(this.state).length) ? stateSave(this.settings) : this.state;
    this.scrolls = document.querySelectorAll(`[data-${this.settings.dataScroll}]`);
    this.scrolls.forEach((item) => {
      item.addEventListener('scroll', this.handlerRef);
      anchorShow(item, false, this.settings);
    });
  }

  destroy() {
    this.scrolls.forEach((item) => {
      item.removeEventListener('scroll', this.handlerRef);
    });
    this.state = {};
    this.scrolls = [];
    localStorage.removeItem(this.settings.saveKey);
  }

  handler() {
    if (this.ticking) return;
    this.ticking = true;
    setTimeout(() => {
      this.state = stateSave(this.settings);
      this.ticking = false;
    }, this.settings.throttleDelay);
  }

  anchorGet(el) {
    return anchorGet(el, this.settings);
  }

  anchorShow(el, behavior) {
    return anchorShow(el, behavior, this.settings);
  }
}
