"use strict";

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

var _package = require("../../package.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Git-style sub-commands
// https://github.com/tj/commander.js#git-style-sub-commands

_commander2.default.version(_package.version).command("build", "build into html + assets").command("devServer", "build and also start a server at localhost:8080").parse([process.argv[0], __filename].concat((0, _toConsumableArray3.default)(process.argv.slice(2))));