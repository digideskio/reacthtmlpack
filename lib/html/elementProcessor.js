"use strict";

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require("babel-runtime/helpers/extends");

var _extends4 = _interopRequireDefault(_extends3);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderServerEntryList = undefined;
exports.evaluateAsES2015Module = evaluateAsES2015Module;
exports.processModule = processModule;
exports.extractClientEntryList = extractClientEntryList;
exports.extractServerEntryList = extractServerEntryList;
exports.extractModuleList = extractModuleList;
exports.alterInjectEntryList = alterInjectEntryList;
exports.alterServerEntryList = alterServerEntryList;
exports.alterClientEntryList = alterClientEntryList;
exports.alterModuleEntryList = alterModuleEntryList;

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

var _path = require("path");

var _thenify = require("thenify");

var _thenify2 = _interopRequireDefault(_thenify);

var _objectPath = require("object-path");

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

var _evalAsModule = require("eval-as-module");

var _evalAsModule2 = _interopRequireDefault(_evalAsModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debugElementProcessor = (0, _debug2.default)("reacthtmlpack:elementProcessor");

var MODULE_NAME = "data-reacthtmlpack-module-name";

function evaluateAsES2015Module(code /*: string*/, filepath /*: ?string*/) {
  var cjsModule = (0, _evalAsModule2.default)(code, filepath);
  var shouldBeAES2015Module = cjsModule.exports && cjsModule.exports.__esModule;
  (0, _invariant2.default)(shouldBeAES2015Module, "The code should be in module format");
  return cjsModule.exports;
}

function moduleChunkName(moduleName) {
  return (0, _path.basename)(moduleName, (0, _path.extname)(moduleName));
}

function processModule($) {
  return function (index, element) {
    var $entry = $(element);
    var moduleName = $entry.attr(MODULE_NAME);
    (0, _invariant2.default)(moduleName, "You must provide a valid value to " + MODULE_NAME);

    return {
      moduleName: moduleName,
      chunkName: moduleChunkName(moduleName),
      text: $entry.text(),
      providePropsName: $entry.attr("data-reacthtmlpack-provide-props")
    };
  };
}

var ENTRY_TARGET = "data-reacthtmlpack-entry-target";
var ENTRY_TARGET__WEB__SELECTOR = "[" + ENTRY_TARGET + "=\"web\"]";
var ENTRY_TARGET__NODE__SELECTOR = "[" + ENTRY_TARGET + "=\"node\"]";

function extractClientEntryList($) {
  return $(ENTRY_TARGET__WEB__SELECTOR).map(processModule($)).toArray();
}

function extractServerEntryList($) {
  return $(ENTRY_TARGET__NODE__SELECTOR).map(processModule($)).toArray();
}

function extractModuleList($) {
  return $("[" + MODULE_NAME + "]").not("[" + ENTRY_TARGET + "]").map(processModule($)).toArray();
}

var renderServerEntryList = exports.renderServerEntryList = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(prerenderProps, serverEntryList, serverJoinStats) {
    var promiseList;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            promiseList = serverEntryList.map(function () {
              var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref) {
                var chunkName = _ref.chunkName;
                var providePropsName = _ref.providePropsName;

                var code, _evaluateAsES2015Modu, server, injectProps;

                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        code = serverJoinStats.getSourceByChunkName(chunkName, ".js");
                        _evaluateAsES2015Modu = evaluateAsES2015Module(code);
                        server = _evaluateAsES2015Modu.default;

                        debugElementProcessor({
                          chunkName: !!chunkName,
                          code: !!code,
                          server: !!server.toString(),
                          prerenderProps: !!prerenderProps
                        });

                        _context.next = 6;
                        return (0, _thenify2.default)(server)(prerenderProps);

                      case 6:
                        injectProps = _context.sent;

                        debugElementProcessor("Provide " + providePropsName + " with ", {
                          chunkName: !!chunkName,
                          injectProps: !!injectProps
                        });
                        return _context.abrupt("return", {
                          providePropsName: providePropsName,
                          injectProps: injectProps
                        });

                      case 9:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));
              return function selectServerEntryListToInjectProps(_x4) {
                return ref.apply(this, arguments);
              };
            }());
            _context2.next = 3;
            return _promise2.default.all(promiseList);

          case 3:
            _context2.t0 = function (acc, _ref2) {
              var providePropsName = _ref2.providePropsName;
              var injectProps = _ref2.injectProps;
              return (0, _extends4.default)({}, acc, (0, _defineProperty3.default)({}, providePropsName, injectProps));
            };

            _context2.t1 = {};
            return _context2.abrupt("return", _context2.sent.reduce(_context2.t0, _context2.t1));

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function renderServerEntryList(_x, _x2, _x3) {
    return ref.apply(this, arguments);
  };
}();

var INJECT_PROPS = "data-reacthtmlpack-inject-props";
var INJECT_METHOD = "data-reacthtmlpack-inject-method";

function alterInjectEntryList($, injectPropsByProvideName) {
  $("[" + INJECT_PROPS + "]").each(function (index, element) {
    var $entry = $(element);
    var objectPath = $entry.attr(INJECT_PROPS);
    var method = $entry.attr(INJECT_METHOD) || "innerHTML";

    $entry.removeAttr(INJECT_PROPS).removeAttr(INJECT_METHOD);

    var value = (0, _objectPath.get)(injectPropsByProvideName, objectPath);
    var valueAsString = String(value);

    debugElementProcessor({
      objectPath: !!objectPath,
      method: !!method,
      value: !!value,
      valueAsString: !!valueAsString
    });

    switch (method) {
      case "innerHTML":
        {
          $entry.html(valueAsString);
          break;
        }
      case "replaceWith":
        {
          $entry.replaceWith(valueAsString);
          break;
        }
      default:
        {
          (0, _invariant2.default)(false, "Unimplemented");
        }
    }
  });
}

function alterServerEntryList($) {
  $(ENTRY_TARGET__NODE__SELECTOR).each(function (index, element) {
    var $entry = $(element);

    $entry.remove();
  });
}

var EXTRACT_TEXT_FROM_MODULE_NAME = "data-reacthtmlpack-extract-text-from-module-name";

function alterClientEntryList($, clientJoinStats) {
  var alterElement = function alterElement(element) {
    var $entry = $(element);

    var moduleName = $entry.attr(MODULE_NAME) || $entry.attr(EXTRACT_TEXT_FROM_MODULE_NAME);
    var chunkName = moduleChunkName(moduleName);
    var extension = {
      script: ".js",
      link: ".css"
    }[element.tagName];

    var clientPath = clientJoinStats.getPublicPathByChunkName(chunkName, extension);

    var pathKey = {
      script: "src",
      link: "href"
    }[element.tagName];

    $entry.attr(pathKey, clientPath).removeAttr(ENTRY_TARGET).removeAttr(MODULE_NAME).removeAttr(EXTRACT_TEXT_FROM_MODULE_NAME).html("");
  };

  $(ENTRY_TARGET__WEB__SELECTOR).each(function (index, element) {
    return alterElement(element);
  });

  if (process.env.NODE_ENV === "production") {
    $("[" + EXTRACT_TEXT_FROM_MODULE_NAME + "]").each(function (index, element) {
      return alterElement(element);
    });
  } else {
    $("[" + EXTRACT_TEXT_FROM_MODULE_NAME + "]").remove();
  }
}

function alterModuleEntryList($) {
  $("[" + MODULE_NAME + "]").each(function (index, element) {
    var $entry = $(element);

    $entry.remove();
  });
}