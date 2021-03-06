"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.devServer = exports.build = undefined;

var _build = require("./build");

var _build2 = _interopRequireDefault(_build);

var _devServer = require("./devServer");

var _devServer2 = _interopRequireDefault(_devServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.build = _build2.default;
exports.devServer = _devServer2.default;