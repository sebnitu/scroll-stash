this.ScrollStash = (function () {
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

  var getAnchor = function getAnchor(el, settings) {
    var dataAnchor = el.dataset[camelCase(settings.dataAnchor)];

    if (dataAnchor == 'false' || dataAnchor == 'ignore') {
      return null;
    }

    if (dataAnchor && el.querySelector(dataAnchor)) {
      return el.querySelector(dataAnchor);
    }

    var selectorAnchor = settings.selectorAnchor ? el.querySelector(settings.selectorAnchor) : null;

    if (selectorAnchor && settings.selectorAnchorParent) {
      var parentAnchor = selectorAnchor.closest(settings.selectorAnchorParent);
      if (parentAnchor) return parentAnchor;
    }

    return selectorAnchor ? selectorAnchor : null;
  };

  var getPosTop = function getPosTop(el, anchor, settings) {
    var pos = settings.anchorPadding;

    if (settings.selectorTopElem) {
      var topElem = el.querySelector(settings.selectorTopElem);
      if (topElem) pos += topElem.offsetHeight;
    }

    return anchor.offsetTop - pos;
  };

  var getPosBot = function getPosBot(el, anchor, settings) {
    var pos = settings.anchorPadding;

    if (settings.selectorBotElem) {
      var botElem = el.querySelector(settings.selectorBotElem);
      if (botElem) pos += botElem.offsetHeight;
    }

    return anchor.offsetTop - (el.offsetHeight - (anchor.offsetHeight + pos));
  };

  var getPosNearest = function getPosNearest(el, anchor, settings) {
    var posTop = getPosTop(el, anchor, settings);
    var posBot = getPosBot(el, anchor, settings);
    if (el.scrollTop > posTop) return posTop;
    if (el.scrollTop < posBot) return posBot;
    return false;
  };

  var getPosition = function getPosition(el, anchor, settings) {
    var align = settings.alignment;

    switch (align) {
      case 'start':
        return getPosTop(el, anchor, settings);

      case 'end':
        return getPosBot(el, anchor, settings);

      case 'nearest':
        return getPosNearest(el, anchor, settings);

      default:
        return false;
    }
  };

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  var index = (function (options) {
    var api = {};
    var defaults = {
      autoInit: false,
      dataScroll: 'scroll-stash',
      dataAnchor: 'scroll-stash-anchor',
      selectorAnchor: '',
      selectorAnchorParent: '',
      selectorTopElem: '',
      selectorBotElem: '',
      alignment: 'nearest',
      behavior: 'auto',
      anchorPadding: 16,
      saveKey: 'ScrollStash',
      throttleDelay: 250,
      customEventPrefix: 'scroll-stash:'
    };
    api.settings = _objectSpread(_objectSpread({}, defaults), options);
    api.scrolls = [];
    api.state = {};
    api.ticking = false;

    api.init = function () {
      api.scrolls = document.querySelectorAll("[data-".concat(api.settings.dataScroll, "]"));
      setScrollPosition();
      api.scrolls.forEach(function (item) {
        api.showAnchor(item);
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
      document.dispatchEvent(new CustomEvent(api.settings.customEventPrefix + 'saved', {
        bubbles: true,
        detail: api.state
      }));
    };

    var setScrollPosition = function setScrollPosition() {
      if (localStorage.getItem(api.settings.saveKey)) {
        api.state = JSON.parse(localStorage.getItem(api.settings.saveKey));
        Object.keys(api.state).forEach(function (key) {
          var item = document.querySelector("[data-".concat(api.settings.dataScroll, "=\"").concat(key, "\"]"));
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

    api.showAnchor = function (el) {
      var behavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : api.settings.behavior;
      var anchor = getAnchor(el, api.settings);

      if (anchor) {
        var position = getPosition(el, anchor, api.settings);

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
            position: el.scrollTop
          }
        }));
      }
    };

    if (api.settings.autoInit) api.init();
    return api;
  });

  return index;

}());
