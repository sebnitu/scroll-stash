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

var camelCase = function camelCase(str) {
  return str.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
};

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var index = (function (options) {
  var api = {};
  var defaults = {
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
  api.settings = _objectSpread(_objectSpread({}, defaults), options);
  api.scrolls = [];
  api.state = {};
  api.ticking = false;

  api.init = function () {
    api.scrolls = document.querySelectorAll("[data-".concat(api.settings.dataScroll, "]"));
    setScrollPosition();
    api.scrolls.forEach(function (item) {
      if (api.settings.selectorActive) {
        showActive(item);
      }

      item.addEventListener('scroll', throttle, false);
    });
  };

  api.destroy = function () {
    api.scrolls.forEach(function (item) {
      item.removeEventListener('scroll', throttle, false);
    });
    api.scrolls = [];
    api.state = {};
    localStorage.removeItem(api.settings.saveKey);
  };

  api.showActive = function (el) {
    if (api.settings.selectorActive) {
      showActive(el);
    }
  };

  var throttle = function throttle() {
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
    var scrolls = document.querySelectorAll("[data-".concat(api.settings.dataScroll, "]"));
    scrolls.forEach(function (el) {
      var id = el.dataset[camelCase(api.settings.dataScroll)];
      if (id) api.state[id] = el.scrollTop;
    });
    localStorage.setItem(api.settings.saveKey, JSON.stringify(api.state));
  };

  var setScrollPosition = function setScrollPosition() {
    if (localStorage.getItem(api.settings.saveKey)) {
      api.state = JSON.parse(localStorage.getItem(api.settings.saveKey));
      Object.keys(api.state).forEach(function (key) {
        var item = document.querySelector("[data-".concat(api.settings.dataScroll, "=\"").concat(key, "\"]"));
        if (item) item.scrollTop = api.state[key];
      });
    } else {
      saveScrollPosition();
    }
  };

  var showActive = function showActive(el) {
    var active = el.querySelector(api.settings.selectorActive);

    if (active && api.settings.selectorActiveParent) {
      active = active.closest(api.settings.selectorActiveParent);
    }

    if (active) {
      var adjustTop = api.settings.padding;
      var adjustBot = api.settings.padding;

      if (api.settings.selectorTopElem) {
        var topElem = el.querySelector(api.settings.selectorTopElem);

        if (topElem) {
          adjustTop = adjustTop + topElem.offsetHeight;
        }
      }

      if (api.settings.selectorBotElem) {
        var botElem = el.querySelector(api.settings.selectorBotElem);

        if (botElem) {
          adjustBot = adjustBot + botElem.offsetHeight;
        }
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
