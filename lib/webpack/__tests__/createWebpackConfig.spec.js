"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _expect = require("expect");

var _expect2 = _interopRequireDefault(_expect);

var _thenify = require("thenify");

var _thenify2 = _interopRequireDefault(_thenify);

var _createWebpackConfig = require("../createWebpackConfig");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var webpackExternalsResolver = (0, _thenify2.default)(_createWebpackConfig.webpackExternalsResolver); /* eslint-disable prefer-arrow-callback */

var context = "/some/context/path";

describe("createWebpackConfig", function describeCreateWebpackConfig() {
  describe("webpackExternalsResolver", function describeWebpackExternalsResolver() {
    it("transform node built-in module", function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var result;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return webpackExternalsResolver(context, "path");

              case 2:
                result = _context.sent;

                (0, _expect2.default)(result).toEqual("commonjs path");

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
      return function it() {
        return ref.apply(this, arguments);
      };
    }());

    it("transform local modules in node_modules", function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var result;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return webpackExternalsResolver(context, "lodash/fp/map");

              case 2:
                result = _context2.sent;

                (0, _expect2.default)(result).toEqual("commonjs lodash/fp/map");

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));
      return function it() {
        return ref.apply(this, arguments);
      };
    }());

    it("transform local modules with webpack loader syntax", function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        var result;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return webpackExternalsResolver(context, "css?module!lodash");

              case 2:
                result = _context3.sent;

                (0, _expect2.default)(result).toInclude("commonjs lodash");

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));
      return function it() {
        return ref.apply(this, arguments);
      };
    }());

    it("transform local modules with css-modules", function () {
      var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        var result;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return webpackExternalsResolver(context, "css?module!normalize.css");

              case 2:
                result = _context4.sent;

                (0, _expect2.default)(result).toBeFalsy();

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));
      return function it() {
        return ref.apply(this, arguments);
      };
    }());
  });
});