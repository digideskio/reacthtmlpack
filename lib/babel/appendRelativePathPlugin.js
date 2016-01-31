"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = appendRelativePathPlugin;

var _path = require("path");

var _babelTypes = require("babel-types");

var t = _interopRequireWildcard(_babelTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function isCommonJSRequire(callee) {
  return t.isIdentifier(callee, { name: "require" }) && !( // We don't care require.resolve('./path') calls
  t.isMemberExpression(callee) && t.isIdentifier(callee.object, { name: "require" }));
}

function isRelativeModulePath(modulePath) {
  return (/\.{1,2}\//.test(modulePath)
  );
}

function isInExcludeList(modulePath, moduleExcludeList) {
  return moduleExcludeList.indexOf(modulePath) !== -1;
}

function transformRequireCall(nodePath, opts) {
  if (!isCommonJSRequire(nodePath.node.callee)) {
    return;
  }
  var moduleArg = nodePath.node.arguments[0];
  if (!t.isStringLiteral(moduleArg)) {
    return;
  }
  var modulePath = moduleArg.value;
  if (!isRelativeModulePath(modulePath)) {
    return;
  }
  if (isInExcludeList(modulePath, opts.moduleExcludeList)) {
    return;
  }
  var nextModulePath = (0, _path.join)(opts.appendPath, modulePath);
  moduleArg.value = nextModulePath;
}

function transformImportCall(nodePath, opts) {
  var moduleArg = nodePath.node.source;
  if (!t.isStringLiteral(moduleArg)) {
    return;
  }
  var modulePath = moduleArg.value;
  if (!isRelativeModulePath(modulePath)) {
    return;
  }
  if (isInExcludeList(modulePath, opts.moduleExcludeList)) {
    return;
  }
  var nextModulePath = (0, _path.join)(opts.appendPath, modulePath);
  moduleArg.value = nextModulePath;
}

function appendRelativePathPlugin() {
  return {
    visitor: {
      CallExpression: {
        exit: function exit(nodePath, _ref) {
          var opts = _ref.opts;

          transformRequireCall(nodePath, opts);
        }
      },
      ImportDeclaration: {
        exit: function exit(nodePath, _ref2) {
          var opts = _ref2.opts;

          transformImportCall(nodePath, opts);
        }
      }
    }
  };
}