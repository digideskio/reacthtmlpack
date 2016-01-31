"use strict";

var _expect = require("expect");

var _expect2 = _interopRequireDefault(_expect);

var _transformRelativePath = require("../transformRelativePath");

var _transformRelativePath2 = _interopRequireDefault(_transformRelativePath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable prefer-arrow-callback */

describe("transformRelativePath", function describeTransformRelativePath() {
  describe("default", function describeDefault() {
    it("transform commonjs require", function it() {
      var code = (0, _transformRelativePath2.default)("require(\"./path\");", []);
      (0, _expect2.default)(code).toEqual("require(\"../path\");");
    });

    it("transform ES2015 import", function it() {
      var code = (0, _transformRelativePath2.default)("import \"./path\";", []);
      (0, _expect2.default)(code).toEqual("import \"../path\";");
    });

    context("node_modules name", function contextNodeModulesName() {
      it("will not transform ES2015 import", function it() {
        var code = (0, _transformRelativePath2.default)("import \"path\";", []);
        (0, _expect2.default)(code).toEqual("import \"path\";");
      });
    });

    context("with exclude module list", function contextWithExcludeModuleList() {
      it("will not transform", function it() {
        var code = (0, _transformRelativePath2.default)("import * as p from \"./path\";", ["./path"]);
        (0, _expect2.default)(code).toEqual("import * as p from \"./path\";");
      });

      it("will transform", function it() {
        var code = (0, _transformRelativePath2.default)("import * as p from \"./node\";", ["./path"]);
        (0, _expect2.default)(code).toEqual("import * as p from \"../node\";");
      });
    });
  });
});