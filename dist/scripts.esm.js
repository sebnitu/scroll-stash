function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

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

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var defaults = {
  autoInit: false,
  dataScroll: 'scroll-stash',
  dataAnchor: 'scroll-stash-anchor',
  selectorAnchor: '',
  selectorAnchorParent: '',
  selectorTopElem: '',
  selectorBotElem: '',
  alignment: 'nearest',
  // start | end | nearest
  behavior: 'auto',
  // auto | smooth
  anchorPadding: 16,
  saveKey: 'ScrollStash',
  throttleDelay: 100,
  customEventPrefix: 'scroll-stash:'
};

var anchorPositionStart = function anchorPositionStart(el, anchor, settings) {
  var pos = settings.anchorPadding;

  if (settings.selectorTopElem) {
    var topElem = el.querySelector(settings.selectorTopElem);
    if (topElem) pos += topElem.offsetHeight;
  }

  return anchor.offsetTop - pos;
};
var anchorPositionEnd = function anchorPositionEnd(el, anchor, settings) {
  var pos = settings.anchorPadding;

  if (settings.selectorBotElem) {
    var botElem = el.querySelector(settings.selectorBotElem);
    if (botElem) pos += botElem.offsetHeight;
  }

  return anchor.offsetTop - (el.offsetHeight - (anchor.offsetHeight + pos));
};
var anchorPositionCenter = function anchorPositionCenter(el, anchor, settings) {
  var posTop = anchorPositionStart(el, anchor, settings);
  var posBot = anchorPositionEnd(el, anchor, settings);
  return posBot + (posTop - posBot) / 2;
};
var anchorPositionNearest = function anchorPositionNearest(el, anchor, settings) {
  var posTop = anchorPositionStart(el, anchor, settings);
  var posBot = anchorPositionEnd(el, anchor, settings);
  if (el.scrollTop > posTop) return posTop;
  if (el.scrollTop < posBot) return posBot;
  return false;
};
var anchorInView = function anchorInView(el, anchor, settings) {
  var posTop = anchorPositionStart(el, anchor, settings);
  var posBot = anchorPositionEnd(el, anchor, settings);
  if (el.scrollTop > posTop || el.scrollTop < posBot) return false;
  return true;
};
var anchorPositionGet = function anchorPositionGet(el, anchor, settings) {
  var inView = anchorInView(el, anchor, settings);

  switch (settings.alignment) {
    case 'start':
      return inView ? false : anchorPositionStart(el, anchor, settings);

    case 'center':
      return inView ? false : anchorPositionCenter(el, anchor, settings);

    case 'end':
      return inView ? false : anchorPositionEnd(el, anchor, settings);

    case 'nearest':
      return anchorPositionNearest(el, anchor, settings);

    default:
      return false;
  }
};

var anchorGet = function anchorGet(el, settings) {
  var dataAnchor = el.getAttribute("data-".concat(settings.dataAnchor));

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
var anchorShow = function anchorShow(el, behavior, settings) {
  var anchor = anchorGet(el, settings);

  if (anchor) {
    var position = anchorPositionGet(el, anchor, settings);

    if (position) {
      behavior = behavior ? behavior : settings.behavior;
      el.scroll({
        top: position,
        behavior: behavior
      });
      el.dispatchEvent(new CustomEvent(settings.customEventPrefix + 'anchor', {
        bubbles: true,
        detail: {
          scrolled: {
            value: position,
            behavior: behavior
          },
          key: el.getAttribute("data-".concat(settings.dataScroll))
        }
      }));
      return {
        scrolled: {
          value: position,
          behavior: behavior
        },
        msg: 'Anchor was scrolled into view'
      };
    } else {
      return {
        scrolled: false,
        msg: 'Anchor is already in view'
      };
    }
  } else {
    return {
      scrolled: false,
      msg: 'Anchor was not found'
    };
  }
};

var stateSave = function stateSave(settings) {
  var state = {};
  var scrolls = document.querySelectorAll("[data-".concat(settings.dataScroll, "]"));
  scrolls.forEach(function (el) {
    var id = el.getAttribute("data-".concat(settings.dataScroll));
    if (id) state[id] = el.scrollTop;
  });
  localStorage.setItem(settings.saveKey, JSON.stringify(state));
  document.dispatchEvent(new CustomEvent(settings.customEventPrefix + 'saved', {
    bubbles: true,
    detail: {
      state: state
    }
  }));
  return state;
};
var stateSet = function stateSet(settings) {
  if (localStorage.getItem(settings.saveKey)) {
    var state = JSON.parse(localStorage.getItem(settings.saveKey));
    Object.keys(state).forEach(function (key) {
      var item = document.querySelector("[data-".concat(settings.dataScroll, "=\"").concat(key, "\"]"));
      if (item) item.scrollTop = state[key];
    });
    document.dispatchEvent(new CustomEvent(settings.customEventPrefix + 'applied', {
      bubbles: true,
      detail: {
        state: state
      }
    }));
    return state;
  } else {
    return {};
  }
};

var ScrollStash = /*#__PURE__*/function () {
  function ScrollStash(options) {
    _classCallCheck(this, ScrollStash);

    this.settings = _objectSpread2(_objectSpread2({}, defaults), options);
    this.state = {};
    this.scrolls = [];
    this.ticking = false;
    this.__handler = this.handler.bind(this);
    if (this.settings.autoInit) this.init();
  }

  _createClass(ScrollStash, [{
    key: "init",
    value: function init() {
      var _this = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (options) this.settings = _objectSpread2(_objectSpread2({}, this.settings), options);
      this.state = stateSet(this.settings);
      this.state = !Object.keys(this.state).length ? stateSave(this.settings) : this.state;
      this.scrolls = document.querySelectorAll("[data-".concat(this.settings.dataScroll, "]"));
      this.scrolls.forEach(function (item) {
        item.addEventListener('scroll', _this.__handler, false);

        anchorShow(item, false, _this.settings);
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this2 = this;

      this.scrolls.forEach(function (item) {
        item.removeEventListener('scroll', _this2.__handler, false);
      });
      this.state = {};
      this.scrolls = [];
      localStorage.removeItem(this.settings.saveKey);
    }
  }, {
    key: "handler",
    value: function handler() {
      var _this3 = this;

      if (this.ticking) return;
      this.ticking = true;
      setTimeout(function () {
        _this3.state = stateSave(_this3.settings);
        _this3.ticking = false;
      }, this.settings.throttleDelay);
    }
  }, {
    key: "anchorGet",
    value: function anchorGet$1(el) {
      return anchorGet(el, this.settings);
    }
  }, {
    key: "anchorShow",
    value: function anchorShow$1(el, behavior) {
      return anchorShow(el, behavior, this.settings);
    }
  }]);

  return ScrollStash;
}();

export default ScrollStash;
