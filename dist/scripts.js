(function (exports) {
  'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  var MemoryScroll = function MemoryScroll(options) {
    var api = {};
    var defaults = {
      autoInit: false,
      selector: '[data-scroll-stash]',
      selectorActive: '',
      selectorActiveParent: '',
      selectorElementPadding: '',
      saveKey: 'StickyScroll',
      throttleDelay: 500,
      positionBottom: true,
      padding: 30
    };
    api.settings = _objectSpread(_objectSpread({}, defaults), options);
    api.lastPosition = 0;
    api.ticking = false;
    api.element = false;

    api.init = function () {
      api.element = document.querySelector(api.settings.selector);

      if (api.element) {
        setScrollPosition();

        if (api.settings.selectorActive) {
          showActive();
        }

        api.element.addEventListener('scroll', throttle, false);
      }
    };

    api.destroy = function () {
      if (api.element) {
        api.element.removeEventListener('scroll', throttle, false);
      }
    };

    api.showActive = function () {
      if (api.settings.selectorActive) {
        showActive();
      }
    };

    var throttle = function throttle(event) {
      api.lastPosition = event.target.scrollTop;

      if (!api.ticking) {
        setTimeout(run, api.settings.throttleDelay);
        api.ticking = true;
      }
    };

    var run = function run() {
      saveScrollPosition();
      api.ticking = false;
    };

    var saveScrollPosition = function saveScrollPosition() {
      localStorage.setItem(api.settings.saveKey, api.lastPosition);
    };

    var setScrollPosition = function setScrollPosition() {
      var pos = localStorage.getItem(api.settings.saveKey);

      if (pos) {
        api.element.scrollTop = pos;
      }
    };

    var showActive = function showActive() {
      var el = api.element.querySelector(api.settings.selectorActive);

      if (api.settings.selectorActiveParent) {
        el = el.closest(api.settings.selectorActiveParent);
      }

      if (el) {
        var adjust = 0;

        if (api.settings.selectorElementPadding) {
          adjust = api.element.querySelector(api.settings.selectorElementPadding).getBoundingClientRect().height;
        }

        var bounding = el.getBoundingClientRect();
        var scrollBounding = api.element.getBoundingClientRect();
        var maxTop = scrollBounding.top + adjust;
        var maxBot = window.innerHeight || document.documentElement.clientHeight;
        var posTop = el.offsetTop - (adjust + api.settings.padding);
        var posBot = el.offsetTop + el.getBoundingClientRect().height + api.settings.padding - scrollBounding.height;

        if (bounding.top < maxTop) {
          api.element.scrollTop = posTop;
        } else if (bounding.bottom > maxBot) {
          api.element.scrollTop = api.settings.positionBottom ? posBot : posTop;
        }
      }
    };

    if (api.settings.autoInit) api.init();
    return api;
  };

  exports.MemoryScroll = MemoryScroll;

}(this['scroll-stash'] = this['scroll-stash'] || {}));
