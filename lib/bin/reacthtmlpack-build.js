"use strict";

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

var _rx = require("rx");

var _prerenderProps = require("./prerenderProps");

var _prerenderProps2 = _interopRequireDefault(_prerenderProps);

var _index = require("../index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Git-style sub-commands
// https://github.com/tj/commander.js/blob/master/examples/pm-install
/* eslint-disable no-console */
_commander2.default.arguments("<srcFile>").option("--out-dir <outDir>", "required. Output directory path for *.(html|js|css|…)").option("--prerender-props-json-path [prerenderPropsJsonPath]", "optional. Prerender props in json format with react-router/match.").parse(process.argv);

var args = _commander2.default.args;
var outDir = _commander2.default.outDir;
var prerenderPropsJsonPath = _commander2.default.prerenderPropsJsonPath;

if (args.length === 0 || !outDir) {
  _commander2.default.outputHelp();
  process.exit(1);
} else {
  var _args = (0, _slicedToArray3.default)(args, 1);

  var srcFile = _args[0];

  var __srcFile__ = _rx.Observable.of(srcFile);
  var __outDir__ = _rx.Observable.of(outDir);
  var __prerenderPropsList__ = (0, _prerenderProps2.default)(prerenderPropsJsonPath);

  var __consoleObserver__ = _rx.Observer.create(function () {
    console.log("Next!");
  }, function (error) {
    console.error(error.stack);
  }, function () {
    console.log("Complete!");
  });

  (0, _index.build)(__srcFile__, __outDir__, __prerenderPropsList__).subscribe(__consoleObserver__);
}