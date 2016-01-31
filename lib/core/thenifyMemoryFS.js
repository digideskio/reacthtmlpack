"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = thenifyMemoryFS;

var _thenify = require("thenify");

var _thenify2 = _interopRequireDefault(_thenify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = [
// From mz/fs
"rename", "ftruncate", "chown", "fchown", "lchown", "chmod", "fchmod", "stat", "lstat", "fstat", "link", "symlink", "readlink", "realpath", "unlink", "rmdir", "mkdir", "readdir", "close", "open", "utimes", "futimes", "fsync", "write", "read", "readFile", "writeFile", "appendFile"];

function thenifyMemoryFS(memoryFS) {
  return (0, _keys2.default)((0, _getPrototypeOf2.default)(memoryFS)).reduce(function (acc, key) {
    var isAsyncFunction = api.indexOf(key) !== -1;
    var boundFn = memoryFS[key].bind(memoryFS);
    /* eslint-disable no-param-reassign */
    acc[key] = isAsyncFunction ? (0, _thenify2.default)(boundFn) : boundFn;
    /* eslint-enable no-param-reassign */
    return acc;
  }, (0, _extends3.default)({}, memoryFS));
}