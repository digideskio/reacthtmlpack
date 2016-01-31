import {
  join as joinPath,
} from "path";

import * as t from "babel-types";

function isCommonJSRequire(callee) {
  return (
    t.isIdentifier(callee, { name: `require` }) &&
    !(// We don't care require.resolve('./path') calls
      t.isMemberExpression(callee) &&
      t.isIdentifier(callee.object, { name: `require` })
    )
  );
}

function isRelativeModulePath(modulePath) {
  return /\.{1,2}\//.test(modulePath);
}

function isInExcludeList(modulePath, moduleExcludeList) {
  return moduleExcludeList.indexOf(modulePath) !== -1;
}

function transformRequireCall(nodePath, opts) {
  if (!isCommonJSRequire(nodePath.node.callee)) {
    return;
  }
  const moduleArg = nodePath.node.arguments[0];
  if (!t.isStringLiteral(moduleArg)) {
    return;
  }
  const modulePath = moduleArg.value;
  if (!isRelativeModulePath(modulePath)) {
    return;
  }
  if (isInExcludeList(modulePath, opts.moduleExcludeList)) {
    return;
  }
  const nextModulePath = joinPath(opts.appendPath, modulePath);
  moduleArg.value = nextModulePath;
}

function transformImportCall(nodePath, opts) {
  const moduleArg = nodePath.node.source;
  if (!t.isStringLiteral(moduleArg)) {
    return;
  }
  const modulePath = moduleArg.value;
  if (!isRelativeModulePath(modulePath)) {
    return;
  }
  if (isInExcludeList(modulePath, opts.moduleExcludeList)) {
    return;
  }
  const nextModulePath = joinPath(opts.appendPath, modulePath);
  moduleArg.value = nextModulePath;
}

export default function appendRelativePathPlugin() {
  return {
    visitor: {
      CallExpression: {
        exit(nodePath, { opts }) {
          transformRequireCall(nodePath, opts);
        },
      },
      ImportDeclaration: {
        exit(nodePath, { opts }) {
          transformImportCall(nodePath, opts);
        },
      },
    },
  };
}
