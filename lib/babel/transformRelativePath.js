"use strict";

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformRelativePath;

var _fs = require("mz/fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _babelCore = require("babel-core");

var _appendRelativePathPlugin = require("./appendRelativePathPlugin");

var _appendRelativePathPlugin2 = _interopRequireDefault(_appendRelativePathPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// FIXME
var BabelPluginSyntaxList = _fs2.default.readdirSync((0, _path.resolve)(__dirname, "../../node_modules"), "utf8").filter(function (name) {
  return (/^babel-plugin-syntax/.test(name)
  );
});

function transformRelativePath(text /*: string*/, moduleExcludeList /*: Array<string>*/) /*: string*/ {
  return (0, _babelCore.transform)(text, {
    babelrc: false,
    plugins: [].concat((0, _toConsumableArray3.default)(BabelPluginSyntaxList), [[_appendRelativePathPlugin2.default, {
      appendPath: "..",
      moduleExcludeList: moduleExcludeList
    }]])
  }).code;
}