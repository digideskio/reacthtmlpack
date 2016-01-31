"use strict";

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createBaseConfig;

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FILENAME_FORMAT = undefined;
var PRODUCTION_PLUGINS = undefined;

if (process.env.NODE_ENV === "production") {
  FILENAME_FORMAT = "[name]-[chunkhash].js";
  PRODUCTION_PLUGINS = [
  // Same effect as webpack -p
  new _webpack2.default.optimize.UglifyJsPlugin(), new _webpack2.default.optimize.OccurenceOrderPlugin()];
} else {
  // When HMR is enabled, chunkhash cannot be used.
  FILENAME_FORMAT = "[name].js";
  PRODUCTION_PLUGINS = [];
}

function createBaseConfig() {
  return {
    output: {
      pathinfo: "production" !== process.env.NODE_ENV,
      publicPath: "assets/",
      filename: FILENAME_FORMAT
    },
    module: {
      loaders: [{
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        loader: "babel"
      }, {
        test: /\.json$/,
        loader: "json"
      }]
    },
    plugins: [new _webpack2.default.EnvironmentPlugin("NODE_ENV")].concat((0, _toConsumableArray3.default)(PRODUCTION_PLUGINS))
  };
}