"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = build;

var _rx = require("rx");

var _core = require("./core");

function build(__srcFile__ /*: Observable*/, __outDir__ /*: Observable*/, __prerenderPropsList__ /*: Observable*/) /*: Observable*/ {
  var __source__ = __srcFile__.let(_core.srcFileToAbsolutePath).let(_core.srcFileToSrcWithWorkspace).let(_core.srcWithWorkspaceToSource).shareReplay();

  var __webpackMultiCompiler__ = __source__.let(_core.sourceToWebpackMultiCompiler);

  var __webpackJoinStatsMap__ = __webpackMultiCompiler__.let(_core.runWebpackMultiCompilerToMultiStats);

  var __finalBundle__ = __webpackJoinStatsMap__.withLatestFrom(__outDir__, __prerenderPropsList__, __source__).let(_core.joinStatsWithArgumentListToFinalBundle);

  return __finalBundle__.let(_core.finalBundleToOutputSideEffect);
}