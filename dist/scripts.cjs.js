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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      module.exports = _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  module.exports = _typeof;
});

var FUNC_ERROR_TEXT = 'Expected a function';
var NAN = 0 / 0;
var symbolTag = '[object Symbol]';
var reTrim = /^\s+|\s+$/g;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
var freeGlobal = _typeof_1(commonjsGlobal) == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof_1(self)) == 'object' && self && self.Object === Object && self;
var root = freeGlobal || freeSelf || Function('return this')();
var objectProto = Object.prototype;
var objectToString = objectProto.toString;
var nativeMax = Math.max,
    nativeMin = Math.min;

var now = function now() {
  return root.Date.now();
};

function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  wait = toNumber(wait) || 0;

  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;
    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }

  function timerExpired() {
    var time = now();

    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }

    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }

    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }

    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }

      if (maxing) {
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }

    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }

    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

function isObject(value) {
  var type = _typeof_1(value);

  return !!value && (type == 'object' || type == 'function');
}

function isObjectLike(value) {
  return !!value && _typeof_1(value) == 'object';
}

function isSymbol(value) {
  return _typeof_1(value) == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}

function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }

  if (isSymbol(value)) {
    return NAN;
  }

  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }

  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }

  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

var lodash_throttle = throttle;

var lodash_isempty = createCommonjsModule(function (module, exports) {
  var MAX_SAFE_INTEGER = 9007199254740991;
  var argsTag = '[object Arguments]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      setTag = '[object Set]',
      weakMapTag = '[object WeakMap]';
  var dataViewTag = '[object DataView]';
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var freeGlobal = _typeof_1(commonjsGlobal) == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof_1(self)) == 'object' && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function('return this')();
  var freeExports =  exports && !exports.nodeType && exports;
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;

  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  function isHostObject(value) {
    var result = false;

    if (value != null && typeof value.toString != 'function') {
      try {
        result = !!(value + '');
      } catch (e) {}
    }

    return result;
  }

  function overArg(func, transform) {
    return function (arg) {
      return func(transform(arg));
    };
  }

  var funcProto = Function.prototype,
      objectProto = Object.prototype;
  var coreJsData = root['__core-js_shared__'];

  var maskSrcKey = function () {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? 'Symbol(src)_1.' + uid : '';
  }();

  var funcToString = funcProto.toString;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var objectToString = objectProto.toString;
  var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
  var Buffer = moduleExports ? root.Buffer : undefined,
      propertyIsEnumerable = objectProto.propertyIsEnumerable;
  var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
      nativeKeys = overArg(Object.keys, Object);
  var DataView = getNative(root, 'DataView'),
      Map = getNative(root, 'Map'),
      Promise = getNative(root, 'Promise'),
      Set = getNative(root, 'Set'),
      WeakMap = getNative(root, 'WeakMap');
  var nonEnumShadows = !propertyIsEnumerable.call({
    'valueOf': 1
  }, 'valueOf');
  var dataViewCtorString = toSource(DataView),
      mapCtorString = toSource(Map),
      promiseCtorString = toSource(Promise),
      setCtorString = toSource(Set),
      weakMapCtorString = toSource(WeakMap);

  function baseGetTag(value) {
    return objectToString.call(value);
  }

  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }

    var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }

  var getTag = baseGetTag;

  if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
    getTag = function getTag(value) {
      var result = objectToString.call(value),
          Ctor = result == objectTag ? value.constructor : undefined,
          ctorString = Ctor ? toSource(Ctor) : undefined;

      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag;

          case mapCtorString:
            return mapTag;

          case promiseCtorString:
            return promiseTag;

          case setCtorString:
            return setTag;

          case weakMapCtorString:
            return weakMapTag;
        }
      }

      return result;
    };
  }

  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }

  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
    return value === proto;
  }

  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}

      try {
        return func + '';
      } catch (e) {}
    }

    return '';
  }

  function isArguments(value) {
    return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') && (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
  }

  var isArray = Array.isArray;

  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }

  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }

  var isBuffer = nativeIsBuffer || stubFalse;

  function isEmpty(value) {
    if (isArrayLike(value) && (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' || isBuffer(value) || isArguments(value))) {
      return !value.length;
    }

    var tag = getTag(value);

    if (tag == mapTag || tag == setTag) {
      return !value.size;
    }

    if (nonEnumShadows || isPrototype(value)) {
      return !nativeKeys(value).length;
    }

    for (var key in value) {
      if (hasOwnProperty.call(value, key)) {
        return false;
      }
    }

    return true;
  }

  function isFunction(value) {
    var tag = isObject(value) ? objectToString.call(value) : '';
    return tag == funcTag || tag == genTag;
  }

  function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }

  function isObject(value) {
    var type = _typeof_1(value);

    return !!value && (type == 'object' || type == 'function');
  }

  function isObjectLike(value) {
    return !!value && _typeof_1(value) == 'object';
  }

  function stubFalse() {
    return false;
  }

  module.exports = isEmpty;
});

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
  throttleDelay: 100,
  customEventPrefix: 'scroll-stash:'
};

var camelCase = function camelCase(str) {
  return str.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
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
          key: el.dataset[camelCase(settings.dataScroll)]
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
      msg: 'Anchor was not found!'
    };
  }
};
var anchor = {
  get: anchorGet,
  show: anchorShow
};

var stateSave = function stateSave(settings) {
  var state = {};
  var scrolls = document.querySelectorAll("[data-".concat(settings.dataScroll, "]"));
  scrolls.forEach(function (el) {
    var id = el.dataset[camelCase(settings.dataScroll)];
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
var state = {
  save: stateSave,
  set: stateSet
};

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var core = (function (options) {
  var api = {};
  api.settings = _objectSpread(_objectSpread({}, defaults), options);
  api.state = {};
  api.scrolls = [];

  var handler = function handler() {
    return api.state = state.save(api.settings);
  };

  var throttleRef = lodash_throttle(handler, api.settings.throttleDelay, {
    leading: false
  });

  api.init = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (options) api.settings = _objectSpread(_objectSpread({}, api.settings), options);
    api.state = state.set(api.settings);
    api.state = lodash_isempty(api.state) ? state.save(api.settings) : api.state;
    api.scrolls = document.querySelectorAll("[data-".concat(api.settings.dataScroll, "]"));
    api.scrolls.forEach(function (item) {
      item.addEventListener('scroll', throttleRef, false);
      anchor.show(item, false, api.settings);
    });
  };

  api.destroy = function () {
    api.scrolls.forEach(function (item) {
      item.removeEventListener('scroll', throttleRef, false);
    });
    api.state = {};
    api.scrolls = [];
    localStorage.removeItem(api.settings.saveKey);
  };

  api.anchor = {
    get: function get(el) {
      return anchor.get(el, api.settings);
    },
    show: function show(el, behavior) {
      return anchor.show(el, behavior, api.settings);
    }
  };
  if (api.settings.autoInit) api.init();
  return api;
});

module.exports = core;
