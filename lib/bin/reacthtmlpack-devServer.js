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
_commander2.default.arguments("<srcFile>").option("--public-dir <publicDir>", "required. All *.(html|js|css|…) will go\n \"virtually\" under this path. Also put your extra static files in this path.").option("--prerender-props-json-path [prerenderPropsJsonPath]", "optional. Prerender props in json format with react-router/match.").parse(process.argv);

var args = _commander2.default.args;
var publicDir = _commander2.default.publicDir;
var prerenderPropsJsonPath = _commander2.default.prerenderPropsJsonPath;

if (args.length === 0 || !publicDir) {
  _commander2.default.outputHelp();
  process.exit(1);
} else {
  var _args = (0, _slicedToArray3.default)(args, 1);

  var srcFile = _args[0];

  var __srcFile__ = _rx.Observable.of(srcFile);
  var __publicDir__ = _rx.Observable.of(publicDir);
  var __prerenderPropsList__ = (0, _prerenderProps2.default)(prerenderPropsJsonPath);

  var __consoleObserver__ = _rx.Observer.create(function () {
    console.log("Next!");
  }, function (error) {
    console.error("ERRRRRRRRRORRRRRR");
    console.error("ERRRRRRRRRORRRRRR");
    console.error("ERRRRRRRRRORRRRRR");
    console.error(error.stack);
  }, function () {
    console.log("Complete!");
  });

  var subscrpition = (0, _index.devServer)(__srcFile__, __publicDir__, __prerenderPropsList__).subscribe(__consoleObserver__);

  process.on("SIGINT", subscrpition.dispose.bind(subscrpition));
}