"use strict";

var _expect = require("expect");

var _expect2 = _interopRequireDefault(_expect);

var _createWebpackConfig = require("../createWebpackConfig");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable prefer-arrow-callback */

var context = "/some/context/path";

describe("createWebpackConfig", function describeCreateWebpackConfig() {
  describe("webpackExternalsResolver", function describeWebpackExternalsResolver() {
    it("transform node built-in module", function it() {
      (0, _createWebpackConfig.webpackExternalsResolver)(context, "path", function (error, result) {
        (0, _expect2.default)(result).toEqual("commonjs path");
      });
    });

    it("transform local modules in node_modules", function it() {
      (0, _createWebpackConfig.webpackExternalsResolver)(context, "lodash/fp/map", function (error, result) {
        (0, _expect2.default)(result).toEqual("commonjs lodash/fp/map");
      });
    });

    it("transform local modules with webpack loader syntax", function it() {
      (0, _createWebpackConfig.webpackExternalsResolver)(context, "css?module!flexboxgrid", function (error, result) {
        (0, _expect2.default)(result).toEqual("commonjs flexboxgrid");
      });
    });
  });
});