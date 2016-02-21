"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = devServer;

var _rx = require("rx");

var _core = require("./core");

function devServer(__srcFile__ /*: Observable*/, __publicDir__ /*: Observable*/, __prerenderPropsList__ /*: Observable*/) /*: Observable*/ {
  var __source__ = __srcFile__.let(_core.srcFileToAbsolutePath).let(_core.srcFileToSrcWithWorkspace).let(_core.srcWithWorkspaceAddWatcher).let(_core.srcWithWorkspaceToSource).shareReplay();

  var __webpackMultiCompiler__ = __source__.let(_core.sourceToWebpackMultiCompilerWithHMR);

  var __webpackJoinStatsMap__ = __webpackMultiCompiler__.withLatestFrom(__publicDir__).let(_core.watchWebpackMultiCompilerWithConnectAppToMultiStats);

  var __finalBundle__ = __webpackJoinStatsMap__.withLatestFrom(__publicDir__, __prerenderPropsList__, __source__).let(_core.joinStatsWithArgumentListToFinalBundle);

  return __finalBundle__.let(_core.finalBundleToOutputSideEffect);
}