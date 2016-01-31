"use strict";

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require("babel-runtime/helpers/extends");

var _extends5 = _interopRequireDefault(_extends4);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PORT = undefined;
exports.srcFileToSrcWithWorkspace = srcFileToSrcWithWorkspace;
exports.srcWithWorkspaceAddWatcher = srcWithWorkspaceAddWatcher;
exports.srcWithWorkspaceToSource = srcWithWorkspaceToSource;
exports.sourceToWebpackMultiCompilerWithHMR = sourceToWebpackMultiCompilerWithHMR;
exports.sourceToWebpackMultiCompiler = sourceToWebpackMultiCompiler;
exports.runWebpackMultiCompilerToMultiStats = runWebpackMultiCompilerToMultiStats;
exports.watchWebpackMultiCompilerWithConnectAppToMultiStats = watchWebpackMultiCompilerWithConnectAppToMultiStats;
exports.joinStatsWithArgumentListToFinalBundle = joinStatsWithArgumentListToFinalBundle;
exports.finalBundleToOutputSideEffect = finalBundleToOutputSideEffect;

var _fs = require("mz/fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

var _chokidar = require("chokidar");

var _chokidar2 = _interopRequireDefault(_chokidar);

var _cheerio = require("cheerio");

var _cheerio2 = _interopRequireDefault(_cheerio);

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

var _mkdirp = require("mkdirp");

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _thenify = require("thenify");

var _thenify2 = _interopRequireDefault(_thenify);

var _connect = require("connect");

var _connect2 = _interopRequireDefault(_connect);

var _serveStatic = require("serve-static");

var _serveStatic2 = _interopRequireDefault(_serveStatic);

var _webpackDevMiddleware = require("webpack-dev-middleware");

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require("webpack-hot-middleware");

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _transformRelativePath = require("../babel/transformRelativePath");

var _transformRelativePath2 = _interopRequireDefault(_transformRelativePath);

var _elementProcessor = require("../html/elementProcessor");

var _createWebpackConfig = require("../webpack/createWebpackConfig");

var _createJoinStats = require("../webpack/createJoinStats");

var _createJoinStats2 = _interopRequireDefault(_createJoinStats);

var _thenifyMemoryFS = require("./thenifyMemoryFS");

var _thenifyMemoryFS2 = _interopRequireDefault(_thenifyMemoryFS);

var _rx = require("rx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import {
//   default as serveFaviconMiddleware,
// } from "serve-favicon";

// import {
//   default as serveIndexMiddleware,
// } from "serve-index";

var debugCore = (0, _debug2.default)("reacthtmlpack:core");

var mkdirp = (0, _thenify2.default)(_mkdirp2.default);

var copy = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(srcFS, src, dest) {
    var encoding;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Weird bug. Can't accept arguments.length > 3
            encoding = "utf8";

            debugCore("srcFS.readFile", !!srcFS.readFile);
            debugCore("args", {
              src: !!src,
              dest: !!dest,
              srcFS: !!srcFS
            });
            _context.t0 = _fs2.default;
            _context.t1 = dest;
            _context.next = 7;
            return srcFS.readFile(src, encoding);

          case 7:
            _context.t2 = _context.sent;
            _context.t3 = encoding;
            _context.next = 11;
            return _context.t0.writeFile.call(_context.t0, _context.t1, _context.t2, _context.t3);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function copy(_x, _x2, _x3) {
    return ref.apply(this, arguments);
  };
}();

function srcFileToSrcWithWorkspace(__srcFile__) {
  return __srcFile__.selectMany(function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(srcFile /*: string*/) {
      var _ref, _ref2, clientWorkspacePath, serverWorkspacePath;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _promise2.default.all([(0, _createWebpackConfig.createWebpackWorkspaceDir)((0, _path.dirname)(srcFile), "client"), (0, _createWebpackConfig.createWebpackWorkspaceDir)((0, _path.dirname)(srcFile), "server")]);

            case 2:
              _ref = _context2.sent;
              _ref2 = (0, _slicedToArray3.default)(_ref, 2);
              clientWorkspacePath = _ref2[0];
              serverWorkspacePath = _ref2[1];
              return _context2.abrupt("return", {
                srcFile: srcFile,
                clientWorkspacePath: clientWorkspacePath,
                serverWorkspacePath: serverWorkspacePath
              });

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));
    return function selectSrcFileWithWorkspacePath(_x4) {
      return ref.apply(this, arguments);
    };
  }());
}

function srcWithWorkspaceAddWatcher(__srcWithWorkspace__) {
  return __srcWithWorkspace__.selectMany(function (srcFileWithWorkspacePath /*: Object*/) {
    return _rx.Observable.create(function (observer) {
      var emitChange = function emitChange() {
        return observer.onNext(srcFileWithWorkspacePath);
      };

      emitChange();

      var watcher = _chokidar2.default.watch(srcFileWithWorkspacePath.srcFile);
      watcher.on("change", emitChange);
      return function () {
        watcher.close();
      };
    });
  });
}

function srcWithWorkspaceToSource(__srcWithWorkspace__) {
  return __srcWithWorkspace__.selectMany(function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref3) {
      var srcFile = _ref3.srcFile;
      var clientWorkspacePath = _ref3.clientWorkspacePath;
      var serverWorkspacePath = _ref3.serverWorkspacePath;

      var html, $, clientEntryList, serverEntryList, moduleList, moduleExcludeList, _clientEntryList$redu, clientEntry, clientWriteFilePromiseList, _serverEntryList$redu, serverEntry, serverWriteFilePromiseList, moduleWriteFilePromiseList;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              debugCore({
                srcFile: !!srcFile,
                clientWorkspacePath: !!clientWorkspacePath,
                serverWorkspacePath: !!serverWorkspacePath
              });
              _context3.next = 3;
              return _fs2.default.readFile((0, _path.resolve)(process.cwd(), srcFile), "utf8");

            case 3:
              html = _context3.sent;
              $ = _cheerio2.default.load(html);
              clientEntryList = (0, _elementProcessor.extractClientEntryList)($);
              serverEntryList = (0, _elementProcessor.extractServerEntryList)($);
              moduleList = (0, _elementProcessor.extractModuleList)($);
              moduleExcludeList = moduleList.map(function (_ref4) {
                var moduleName = _ref4.moduleName;
                return(
                  // FIXME: normalize module resolution from path
                  moduleName.replace((0, _path.extname)(moduleName), "")
                );
              });

              debugCore(moduleExcludeList);

              _clientEntryList$redu = clientEntryList.reduce(function (acc, _ref6) {
                var moduleName = _ref6.moduleName;
                var chunkName = _ref6.chunkName;
                var text = _ref6.text;

                var clientFilepath = (0, _path.resolve)(clientWorkspacePath, moduleName);
                var code = (0, _transformRelativePath2.default)(text, moduleExcludeList);

                return {
                  clientEntry: (0, _extends5.default)({}, acc.clientEntry, (0, _defineProperty3.default)({}, chunkName, [clientFilepath])),
                  clientWriteFilePromiseList: [].concat((0, _toConsumableArray3.default)(acc), [_fs2.default.writeFile(clientFilepath, code, "utf8")])
                };
              }, { clientEntry: {}, clientWriteFilePromiseList: [] });
              clientEntry = _clientEntryList$redu.clientEntry;
              clientWriteFilePromiseList = _clientEntryList$redu.clientWriteFilePromiseList;
              _serverEntryList$redu = serverEntryList.reduce(function (acc, _ref7) {
                var moduleName = _ref7.moduleName;
                var chunkName = _ref7.chunkName;
                var text = _ref7.text;

                var serverFilepath = (0, _path.resolve)(serverWorkspacePath, moduleName);
                var code = (0, _transformRelativePath2.default)(text, moduleExcludeList);

                return {
                  serverEntry: (0, _extends5.default)({}, acc.serverEntry, (0, _defineProperty3.default)({}, chunkName, [serverFilepath])),
                  serverWriteFilePromiseList: [].concat((0, _toConsumableArray3.default)(acc), [_fs2.default.writeFile(serverFilepath, code, "utf8")])
                };
              }, { serverEntry: {}, serverWriteFilePromiseList: [] });
              serverEntry = _serverEntryList$redu.serverEntry;
              serverWriteFilePromiseList = _serverEntryList$redu.serverWriteFilePromiseList;
              moduleWriteFilePromiseList = moduleList.reduce(function (acc, _ref5) {
                var moduleName = _ref5.moduleName;
                var text = _ref5.text;

                var clientFilepath = (0, _path.resolve)(clientWorkspacePath, moduleName);
                var serverFilepath = (0, _path.resolve)(serverWorkspacePath, moduleName);
                var code = (0, _transformRelativePath2.default)(text, moduleExcludeList);

                return [].concat((0, _toConsumableArray3.default)(acc), [_fs2.default.writeFile(clientFilepath, code, "utf8"), _fs2.default.writeFile(serverFilepath, code, "utf8")]);
              }, []);
              _context3.next = 19;
              return _promise2.default.all([].concat((0, _toConsumableArray3.default)(clientWriteFilePromiseList), (0, _toConsumableArray3.default)(serverWriteFilePromiseList), (0, _toConsumableArray3.default)(moduleWriteFilePromiseList)));

            case 19:
              return _context3.abrupt("return", {
                srcFile: srcFile,
                html: html,
                clientEntryList: clientEntryList,
                serverEntryList: serverEntryList,
                //
                customClientConfig: {
                  clientWorkspacePath: clientWorkspacePath,
                  entry: clientEntry,
                  output: {
                    path: (0, _path.resolve)(clientWorkspacePath, "./public")
                  },
                  plugins: []
                },
                customServerConfig: {
                  serverWorkspacePath: serverWorkspacePath,
                  entry: serverEntry,
                  output: {
                    libraryTarget: "commonjs2",
                    path: (0, _path.resolve)(serverWorkspacePath, "./public")
                  },
                  plugins: []
                }
              });

            case 20:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));
    return function selectSource(_x5) {
      return ref.apply(this, arguments);
    };
  }());
}

function distinctClientWebpackConfigInSource(__source__) {
  return __source__.distinctUntilChanged(function (_ref8) {
    var customClientConfig = _ref8.customClientConfig;
    return (0, _stringify2.default)(customClientConfig);
  });
}

function distinctServerWebpackConfigInSource(__source__) {
  return __source__.distinctUntilChanged(function (_ref9) {
    var customServerConfig = _ref9.customServerConfig;
    return (0, _stringify2.default)(customServerConfig);
  });
}

function addWebpackHMRStuffToClientEntry(__source__) {
  return __source__.map(function (source) {
    var customClientConfig = source.customClientConfig;
    var entry = customClientConfig.entry;

    var extraEntry = require.resolve("webpack-hot-middleware/client");

    (0, _keys2.default)(entry).forEach(function (chunkName) {
      entry[chunkName].unshift(extraEntry);
    });

    customClientConfig.plugins = [].concat((0, _toConsumableArray3.default)(customClientConfig.plugins), [new _webpack2.default.HotModuleReplacementPlugin()]);
    return source;
  });
}

function sourceToClientWebpackConfig(__source__) {
  return __source__.map(function (_ref10) {
    var srcFile = _ref10.srcFile;
    var customClientConfig = _ref10.customClientConfig;
    return (0, _createWebpackConfig.createClientWebpackConfig)(customClientConfig);
  });
}

function sourceToServerWebpackConfig(__source__) {
  return __source__.map(function (_ref11) {
    var srcFile = _ref11.srcFile;
    var customServerConfig = _ref11.customServerConfig;
    return (0, _createWebpackConfig.createServerWebpackConfig)(customServerConfig);
  });
}

function sourceToWebpackMultiCompilerWithHMR(__source__) {
  var __client__ = __source__.let(distinctClientWebpackConfigInSource).let(addWebpackHMRStuffToClientEntry).let(sourceToClientWebpackConfig);

  var __server__ = __source__.let(distinctServerWebpackConfigInSource).let(sourceToServerWebpackConfig);

  return _rx.Observable.combineLatest(__client__, __server__, function (clientWebpackConfig, serverWebpackConfig) {
    return [clientWebpackConfig, serverWebpackConfig];
  }).scan(function (webpackMultiCompiler, webpackConfigList) {
    return (0, _webpack2.default)(webpackConfigList);
  }, null);
}

function sourceToWebpackMultiCompiler(__source__) {
  var __client__ = __source__.let(distinctClientWebpackConfigInSource).let(sourceToClientWebpackConfig);

  var __server__ = __source__.let(distinctServerWebpackConfigInSource).let(sourceToServerWebpackConfig);

  return _rx.Observable.combineLatest(__client__, __server__, function (clientWebpackConfig, serverWebpackConfig) {
    return [clientWebpackConfig, serverWebpackConfig];
  }).scan(function (webpackMultiCompiler, webpackConfigList) {
    return (0, _webpack2.default)(webpackConfigList);
  }, null);
}

function runWebpackMultiCompilerToMultiStats(__webpackMultiCompiler__) {
  return __webpackMultiCompiler__.selectMany(function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(webpackMultiCompiler) {
      var _webpackMultiCompiler, clientWebpackConfig, serverWebpackConfig, webpackMultiStats, _webpackMultiStats$st, client, server;

      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _webpackMultiCompiler = (0, _slicedToArray3.default)(webpackMultiCompiler.compilers, 2);
              clientWebpackConfig = _webpackMultiCompiler[0].options;
              serverWebpackConfig = _webpackMultiCompiler[1].options;

              debugCore("clientWebpackConfig", !!clientWebpackConfig);
              debugCore("serverWebpackConfig", !!serverWebpackConfig);

              _context4.next = 7;
              return (0, _thenify2.default)(webpackMultiCompiler.run.bind(webpackMultiCompiler))();

            case 7:
              webpackMultiStats = _context4.sent;
              _webpackMultiStats$st = (0, _slicedToArray3.default)(webpackMultiStats.stats, 2);
              client = _webpackMultiStats$st[0];
              server = _webpackMultiStats$st[1];

              debugCore("webpack client errors", client.toJson().errors);
              debugCore("webpack server errors", server.toJson().errors);

              return _context4.abrupt("return", {
                clientSrcFS: _fs2.default,
                clientWorkspacePath: clientWebpackConfig.clientWorkspacePath,
                clientOutputPublicPath: clientWebpackConfig.output.publicPath,
                clientOutputPath: clientWebpackConfig.output.path,
                serverWorkspacePath: serverWebpackConfig.serverWorkspacePath,
                client: (0, _createJoinStats2.default)(client),
                server: (0, _createJoinStats2.default)(server)
              });

            case 14:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));
    return function selectWebpackMultiCompiler(_x6) {
      return ref.apply(this, arguments);
    };
  }());
}

var PORT = exports.PORT = 8080;

function watchWebpackMultiCompilerWithConnectAppToMultiStats(__webpackMultiCompiler__) {
  return __webpackMultiCompiler__.selectMany(function (_ref12) {
    var _ref13 = (0, _slicedToArray3.default)(_ref12, 2);

    var webpackMultiCompiler = _ref13[0];
    var publicDir = _ref13[1];

    var _webpackMultiCompiler2 = (0, _slicedToArray3.default)(webpackMultiCompiler.compilers, 1);

    var webpackClientCompiler = _webpackMultiCompiler2[0];

    var _webpackMultiCompiler3 = (0, _slicedToArray3.default)(webpackMultiCompiler.compilers, 2);

    var clientWebpackConfig = _webpackMultiCompiler3[0].options;
    var serverWebpackConfig = _webpackMultiCompiler3[1].options;

    debugCore("clientWebpackConfig", !!clientWebpackConfig);
    debugCore("serverWebpackConfig", !!serverWebpackConfig);

    return _rx.Observable.create(function (observer) {
      // Because we only pass in webpackClientCompiler to webpackDevMiddleware
      // , we have to watch ourselves
      var watcher = webpackMultiCompiler.watch({
        aggregateTimeout: 200
      }, function (error) {
        if (error) {
          observer.onNext(error);
        }
      });
      var app = (0, _connect2.default)();
      // We only pass in webpackClientCompiler to middlewares
      // so that the publicPath will be correct
      app.use((0, _webpackDevMiddleware2.default)(webpackClientCompiler, {
        publicPath: "/" + clientWebpackConfig.output.publicPath,
        noInfo: true,
        quiet: true
      }));
      app.use((0, _webpackHotMiddleware2.default)(webpackClientCompiler));
      //
      app.use((0, _serveStatic2.default)(publicDir));
      //
      webpackMultiCompiler.plugin("done", function (webpackMultiStats) {
        var _webpackMultiStats$st2 = (0, _slicedToArray3.default)(webpackMultiStats.stats, 2);

        var client = _webpackMultiStats$st2[0];
        var server = _webpackMultiStats$st2[1];

        debugCore("webpack client errors", client.toJson().errors);
        debugCore("webpack server errors", server.toJson().errors);

        var clientSrcFS = (0, _thenifyMemoryFS2.default)(webpackClientCompiler.outputFileSystem);

        observer.onNext({
          clientSrcFS: clientSrcFS,
          clientWorkspacePath: clientWebpackConfig.clientWorkspacePath,
          clientOutputPublicPath: clientWebpackConfig.output.publicPath,
          clientOutputPath: clientWebpackConfig.output.path,
          serverWorkspacePath: serverWebpackConfig.serverWorkspacePath,
          client: (0, _createJoinStats2.default)(client),
          server: (0, _createJoinStats2.default)(server)
        });
      });

      var server = app.listen(PORT);

      return function () {
        debugCore("Close connect server!!");
        watcher.close();
        server.close();
      };
    });
  }).shareReplay();
}

function joinStatsWithArgumentListToFinalBundle(__joinStatsWithArgList__) {
  return __joinStatsWithArgList__.selectMany(function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(_ref14) {
      var _ref15 = (0, _slicedToArray3.default)(_ref14, 4);

      var webpackJoinStatsMap = _ref15[0];
      var outDir = _ref15[1];
      var prerenderPropsList = _ref15[2];
      var source = _ref15[3];
      var srcFile, html, serverEntryList, srcExtname, htmlFileList;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              srcFile = source.srcFile;
              html = source.html;
              serverEntryList = source.serverEntryList;
              srcExtname = (0, _path.extname)(srcFile);
              _context6.next = 6;
              return _promise2.default.all(prerenderPropsList.map(function () {
                var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(prerenderProps) {
                  var $, injectPropsByProvideName, destFile;
                  return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                      switch (_context5.prev = _context5.next) {
                        case 0:
                          $ = _cheerio2.default.load(html);
                          _context5.next = 3;
                          return (0, _elementProcessor.renderServerEntryList)(prerenderProps, serverEntryList, webpackJoinStatsMap.server);

                        case 3:
                          injectPropsByProvideName = _context5.sent;

                          debugCore("combineLatestToBundle", {
                            clientSrcFS: !!webpackJoinStatsMap.clientSrcFS,
                            prerenderProps: !!prerenderProps,
                            outDir: !!outDir
                          });

                          (0, _elementProcessor.alterInjectEntryList)($, injectPropsByProvideName);
                          (0, _elementProcessor.alterServerEntryList)($);
                          //
                          (0, _elementProcessor.alterClientEntryList)($, webpackJoinStatsMap.client);
                          //
                          (0, _elementProcessor.alterModuleEntryList)($);

                          destFile = prerenderProps.location;

                          if (destFile.match(/\/$/)) {
                            destFile = destFile + "index";
                          }
                          destFile = "" + destFile + srcExtname;

                          return _context5.abrupt("return", {
                            destFile: destFile,
                            html: $.html()
                          });

                        case 13:
                        case "end":
                          return _context5.stop();
                      }
                    }
                  }, _callee5, this);
                }));
                return function prerenderPropsToHTMLFile(_x8) {
                  return ref.apply(this, arguments);
                };
              }()));

            case 6:
              htmlFileList = _context6.sent;
              return _context6.abrupt("return", {
                htmlFileList: htmlFileList,
                outDir: outDir,
                clientSrcFS: webpackJoinStatsMap.clientSrcFS,
                clientWorkspacePath: webpackJoinStatsMap.clientWorkspacePath,
                clientOutputPublicPath: webpackJoinStatsMap.clientOutputPublicPath,
                clientOutputPath: webpackJoinStatsMap.clientOutputPath,
                serverWorkspacePath: webpackJoinStatsMap.serverWorkspacePath
              });

            case 8:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));
    return function selectArgsToFinalBundle(_x7) {
      return ref.apply(this, arguments);
    };
  }());
}

function finalBundleToOutputSideEffect(__finalBundle__) {
  return __finalBundle__.selectMany(function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(options) {
      var htmlFileList, outDir, clientSrcFS, clientOutputPublicPath, clientOutputPath, outDirWithPublicPath, _ref16, _ref17, rawClientAssetList, clientAssetList, firstAsset, isFile;

      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              htmlFileList = options.htmlFileList;
              outDir = options.outDir;
              clientSrcFS = options.clientSrcFS;
              clientOutputPublicPath = options.clientOutputPublicPath;
              clientOutputPath = options.clientOutputPath;

              debugCore("finalBundleToOutputSideEffect", htmlFileList.length);
              outDirWithPublicPath = (0, _path.resolve)(outDir, clientOutputPublicPath);
              _context8.next = 9;
              return _promise2.default.all([clientSrcFS.readdir(clientOutputPath), mkdirp(outDirWithPublicPath)]);

            case 9:
              _ref16 = _context8.sent;
              _ref17 = (0, _slicedToArray3.default)(_ref16, 1);
              rawClientAssetList = _ref17[0];
              clientAssetList = rawClientAssetList.filter(function (it) {
                return !it.match(/hot-update/);
              });
              firstAsset = (0, _path.resolve)(clientOutputPath, clientAssetList[0]);
              _context8.next = 16;
              return clientSrcFS.stat(firstAsset);

            case 16:
              isFile = _context8.sent.isFile();

              debugCore("clientAssetList", !!clientAssetList);
              debugCore("exists?", isFile);

              _context8.next = 21;
              return _promise2.default.all([].concat((0, _toConsumableArray3.default)(clientAssetList.map(function (name) {
                return copy(clientSrcFS, (0, _path.resolve)(clientOutputPath, name), (0, _path.resolve)(outDirWithPublicPath, name));
              })), (0, _toConsumableArray3.default)(htmlFileList.map(function () {
                var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(_ref18) {
                  var destFile = _ref18.destFile;
                  var html = _ref18.html;
                  var filename, dirname;
                  return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          filename = (0, _path.resolve)(outDir, "." + destFile);
                          dirname = (0, _path.dirname)(filename);
                          _context7.next = 4;
                          return mkdirp(dirname);

                        case 4:
                          _context7.next = 6;
                          return _fs2.default.writeFile(filename, html, "utf8");

                        case 6:
                        case "end":
                          return _context7.stop();
                      }
                    }
                  }, _callee7, this);
                }));
                return function htmlFileWithMkdirp(_x10) {
                  return ref.apply(this, arguments);
                };
              }()))));

            case 21:
              return _context8.abrupt("return", {
                clientWorkspacePath: options.clientWorkspacePath,
                serverWorkspacePath: options.serverWorkspacePath
              });

            case 22:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));
    return function selectOptionsIntoBundle(_x9) {
      return ref.apply(this, arguments);
    };
  }());
}