"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformRelativePath;

var _babelCore = require("babel-core");

var _appendRelativePathPlugin = require("./appendRelativePathPlugin");

var _appendRelativePathPlugin2 = _interopRequireDefault(_appendRelativePathPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformRelativePath(text /*: string*/, moduleExcludeList /*: Array<string>*/) /*: string*/ {
  return (0, _babelCore.transform)(text, {
    babelrc: false,
    presets: ["babel-preset-syntax-from-presets"],
    plugins: [[_appendRelativePathPlugin2.default, {
      appendPath: "..",
      moduleExcludeList: moduleExcludeList
    }]]
  }).code;
}