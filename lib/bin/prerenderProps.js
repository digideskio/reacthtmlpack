"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prerenderProps;

var _fs = require("mz/fs");

var _fs2 = _interopRequireDefault(_fs);

var _rx = require("rx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prerenderProps(prerenderPropsJsonPath) {
  if (!prerenderPropsJsonPath) {
    return _rx.Observable.of([{ location: "/" }]);
  }
  return _rx.Observable.fromPromise(_fs2.default.readFile(prerenderPropsJsonPath, "utf8")).map(function (text) {
    return JSON.parse(text);
  });
}