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

var index = (function (options) {
  var api = {};
  var defaults = {
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
  api.settings = _objectSpread(_objectSpread({}, defaults), options);
  api.lastPosition = 0;
  api.ticking = false;
  api.element = false;

  api.init = function () {
    api.element = document.querySelector(api.settings.selector);

    if (api.element) {
      setScrollPosition();

      if (api.settings.selectorActive) {
        showActive(api.element);
      }

      api.element.addEventListener('scroll', throttle, false);
    }
  };

  api.destroy = function () {
    if (api.element) {
      api.element.removeEventListener('scroll', throttle, false);
    }
  };

  api.showActive = function (el) {
    if (api.settings.selectorActive) {
      showActive(el);
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
    console.log(api.element.scrollTop);
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

  var showActive = function showActive(el) {
    var active = el.querySelector(api.settings.selectorActive);

    if (api.settings.selectorActiveParent) {
      active = active.closest(api.settings.selectorActiveParent);
    }

    if (active) {
      var adjustTop = api.settings.padding;
      var adjustBot = api.settings.padding;

      if (api.settings.selectorTopElem) {
        adjustTop = adjustTop + el.querySelector(api.settings.selectorElementPadding).offsetHeight;
      }

      if (api.settings.selectorBotElem) {
        adjustBot = adjustBot + el.querySelector(api.settings.selectorElementPadding).offsetHeight;
      }

      var posTop = active.offsetTop - adjustTop;
      var posBot = active.offsetTop - (el.offsetHeight - (active.offsetHeight + adjustBot));

      if (el.scrollTop > posTop) {
        el.scrollTop = posTop;
      } else if (el.scrollTop < posBot) {
        el.scrollTop = posBot;
      }
    }
  };

  if (api.settings.autoInit) api.init();
  return api;
});

module.exports = index;
