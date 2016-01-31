"use strict";

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createWebpackWorkspaceDir = createWebpackWorkspaceDir;
exports.createClientWebpackConfig = createClientWebpackConfig;
exports.webpackExternalsResolver = webpackExternalsResolver;
exports.createServerWebpackConfig = createServerWebpackConfig;

var _path = require("path");

var _thenify = require("thenify");

var _thenify2 = _interopRequireDefault(_thenify);

var _temp = require("temp");

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

var _extractTextWebpackPlugin = require("extract-text-webpack-plugin");

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _createBaseConfig = require("./createBaseConfig");

var _createBaseConfig2 = _interopRequireDefault(_createBaseConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createTempdir = (0, _thenify2.default)(_temp.mkdir);

function createWebpackWorkspaceDir(dirname /*: string*/, chunkName /*: string*/) {
  (0, _invariant2.default)(dirname, "chunkName should exist. Got %s", dirname);
  (0, _invariant2.default)(chunkName, "chunkName should exist. Got %s", chunkName);
  process.on("SIGINT", _temp.cleanup); // https://github.com/bruce/node-temp/issues/10
  (0, _temp.track)(true);

  return createTempdir({
    dir: dirname,
    prefix: chunkName
  });
}

var CLIENT_BABEL_PLUGINS = undefined;

if (process.env.NODE_ENV === "production") {
  CLIENT_BABEL_PLUGINS = [];
} else {
  CLIENT_BABEL_PLUGINS = [["react-transform", {
    transforms: [{
      transform: "react-transform-hmr",
      imports: ["react"],
      locals: ["module"]
    }, {
      transform: "react-transform-catch-errors",
      imports: ["react", "redbox-react"]
    }]
  }]];
}

function createClientWebpackConfig(customConfig /*: Object*/) {
  (0, _invariant2.default)(customConfig.output.path, "You must specify output.path. Got %s", customConfig.output.path);
  var baseConfig = (0, _createBaseConfig2.default)();
  (0, _invariant2.default)("publicPath" in baseConfig.output, "You must specify output.publicPath. Got %s", baseConfig.output.publicPath);

  var clientExtractTextPlugin = new _extractTextWebpackPlugin2.default("[name]-[chunkhash].css", {
    disable: "production" !== process.env.NODE_ENV
  });

  return (0, _extends3.default)({}, baseConfig, customConfig, {
    output: (0, _extends3.default)({}, baseConfig.output, customConfig.output, {
      path: (0, _path.resolve)(customConfig.output.path, baseConfig.output.publicPath)
    }),
    target: "web",
    module: (0, _extends3.default)({}, baseConfig.module, {
      loaders: [].concat((0, _toConsumableArray3.default)(baseConfig.module.loaders.filter(function (_ref) {
        var loader = _ref.loader;
        return loader !== "babel";
      })), [(0, _extends3.default)({}, baseConfig.module.loaders.filter(function (_ref2) {
        var loader = _ref2.loader;
        return loader === "babel";
      })[0], {
        query: {
          plugins: CLIENT_BABEL_PLUGINS
        }
      }), {
        test: /\.css$/,
        loader: clientExtractTextPlugin.extract("style", "css")
      }])
    }),
    plugins: [].concat((0, _toConsumableArray3.default)(baseConfig.plugins), [clientExtractTextPlugin], (0, _toConsumableArray3.default)(customConfig.plugins))
  });
}

function webpackExternalsResolver(context, request, done) {
  // https://github.com/webpack/webpack/issues/839#issuecomment-76736465
  if ((0, _path.isAbsolute)(request)) {
    done();
  } else if (request.match(/^\./)) {
    done();
  } else if (request.match(/\.css$/)) {
    done();
  } else {
    // sep as pathSep,
    // const [potentialModuleName] = request.split(pathSep);
    // FIXME: Assume everything can be found in node_modules
    done(null, "commonjs " + request);
  }
}

function createServerWebpackConfig(customConfig /*: Object*/) {
  var baseConfig = (0, _createBaseConfig2.default)();

  var serverExtractTextPlugin = new _extractTextWebpackPlugin2.default("[name]-[chunkhash].css", {
    disable: "production" !== process.env.NODE_ENV
  });

  return (0, _extends3.default)({}, baseConfig, customConfig, {
    target: "node",
    externals: webpackExternalsResolver,
    module: (0, _extends3.default)({}, baseConfig.module, {
      loaders: [].concat((0, _toConsumableArray3.default)(baseConfig.module.loaders), [{
        test: /\.css$/,
        loader: serverExtractTextPlugin.extract("css")
      }])
    }),
    plugins: [].concat((0, _toConsumableArray3.default)(baseConfig.plugins), [serverExtractTextPlugin], (0, _toConsumableArray3.default)(customConfig.plugins))
  });
}