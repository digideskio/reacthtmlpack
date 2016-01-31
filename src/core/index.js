import {
  default as fs,
} from "mz/fs";

import {
  resolve as resolvePath,
  dirname as extractDirname,
  extname as extractExtname,
} from "path";

import {
  default as nodeDebug,
} from "debug";

import {
  default as chokidar,
} from "chokidar";

import {
  default as cheerio,
} from "cheerio";

import {
  default as webpack,
} from "webpack";

import {
  default as nodeMkdirp,
} from "mkdirp";

import {
  default as thenify,
} from "thenify";

import {
  default as connect,
} from "connect";

import {
  default as serveStaticMiddleware,
} from "serve-static";

// import {
//   default as serveFaviconMiddleware,
// } from "serve-favicon";

// import {
//   default as serveIndexMiddleware,
// } from "serve-index";

import {
  default as webpackDevMiddleware,
} from "webpack-dev-middleware";

import {
  default as webpackHotMiddleware,
} from "webpack-hot-middleware";

import {
  default as transformRelativePath,
} from "../babel/transformRelativePath";

import {
  extractClientEntryList,
  extractServerEntryList,
  extractModuleList,
  //
  renderServerEntryList,
  alterInjectEntryList,
  alterServerEntryList,
  alterClientEntryList,
  alterModuleEntryList,
} from "../html/elementProcessor";

import {
  createWebpackWorkspaceDir,
  createClientWebpackConfig,
  createServerWebpackConfig,
} from "../webpack/createWebpackConfig";

import {
  default as createJoinStats,
} from "../webpack/createJoinStats";

import {
  default as thenifyMemoryFS,
} from "./thenifyMemoryFS";

import {
  Observable,
} from "rx";

const debugCore = nodeDebug(`reacthtmlpack:core`);

const mkdirp = thenify(nodeMkdirp);

async function copy(srcFS, src, dest) {// Weird bug. Can't accept arguments.length > 3
  const encoding = `utf8`;
  debugCore(`srcFS.readFile`, !!srcFS.readFile);
  debugCore(`args`, {
    src: !!src,
    dest: !!dest,
    srcFS: !!srcFS,
  });
  await fs.writeFile(dest, await srcFS.readFile(src, encoding), encoding);
}

export function srcFileToSrcWithWorkspace(__srcFile__) {
  return __srcFile__
    .selectMany(async function selectSrcFileWithWorkspacePath(srcFile: string) {
      const [clientWorkspacePath, serverWorkspacePath] = await Promise.all([
        createWebpackWorkspaceDir(extractDirname(srcFile), `client`),
        createWebpackWorkspaceDir(extractDirname(srcFile), `server`),
      ]);
      return {
        srcFile,
        clientWorkspacePath,
        serverWorkspacePath,
      };
    });
}

export function srcWithWorkspaceAddWatcher(__srcWithWorkspace__) {
  return __srcWithWorkspace__
    .selectMany((srcFileWithWorkspacePath: Object) => Observable.create(observer => {
      const emitChange = () => observer.onNext(srcFileWithWorkspacePath);

      emitChange();

      const watcher = chokidar.watch(srcFileWithWorkspacePath.srcFile);
      watcher.on(`change`, emitChange);
      return () => {
        watcher.close();
      };
    }));
}

export function srcWithWorkspaceToSource(__srcWithWorkspace__) {
  return __srcWithWorkspace__
    .selectMany(async function selectSource({
        srcFile,
        clientWorkspacePath,
        serverWorkspacePath,
      }) {
      debugCore({
        srcFile: !!srcFile,
        clientWorkspacePath: !!clientWorkspacePath,
        serverWorkspacePath: !!serverWorkspacePath,
      });
      const html = await fs.readFile(resolvePath(process.cwd(), srcFile), `utf8`);
      const $ = cheerio.load(html);
      const clientEntryList = extractClientEntryList($);
      const serverEntryList = extractServerEntryList($);
      const moduleList = extractModuleList($);
      const moduleExcludeList = moduleList.map(({ moduleName }) =>
        // FIXME: normalize module resolution from path
        moduleName.replace(extractExtname(moduleName), ``)
      );
      debugCore(moduleExcludeList);

      const {
        clientEntry,
        clientWriteFilePromiseList,
      } = clientEntryList.reduce((acc, { moduleName, chunkName, text }) => {
        const clientFilepath = resolvePath(clientWorkspacePath, moduleName);
        const code = transformRelativePath(text, moduleExcludeList);

        return {
          clientEntry: {
            ...acc.clientEntry,
            [chunkName]: [
              clientFilepath,
            ],
          },
          clientWriteFilePromiseList: [
            ...acc,
            fs.writeFile(clientFilepath, code, `utf8`),
          ],
        };
      }, { clientEntry: {}, clientWriteFilePromiseList: [] });

      const {
        serverEntry,
        serverWriteFilePromiseList,
      } = serverEntryList.reduce((acc, { moduleName, chunkName, text }) => {
        const serverFilepath = resolvePath(serverWorkspacePath, moduleName);
        const code = transformRelativePath(text, moduleExcludeList);

        return {
          serverEntry: {
            ...acc.serverEntry,
            [chunkName]: [
              serverFilepath,
            ],
          },
          serverWriteFilePromiseList: [
            ...acc,
            fs.writeFile(serverFilepath, code, `utf8`),
          ],
        };
      }, { serverEntry: {}, serverWriteFilePromiseList: [] });

      const moduleWriteFilePromiseList = moduleList.reduce((acc, { moduleName, text }) => {
        const clientFilepath = resolvePath(clientWorkspacePath, moduleName);
        const serverFilepath = resolvePath(serverWorkspacePath, moduleName);
        const code = transformRelativePath(text, moduleExcludeList);

        return [
          ...acc,
          fs.writeFile(clientFilepath, code, `utf8`),
          fs.writeFile(serverFilepath, code, `utf8`),
        ];
      }, []);

      await Promise.all([
        ...clientWriteFilePromiseList,
        ...serverWriteFilePromiseList,
        ...moduleWriteFilePromiseList,
      ]);

      return {
        srcFile,
        html,
        clientEntryList,
        serverEntryList,
        //
        customClientConfig: {
          clientWorkspacePath,
          entry: clientEntry,
          output: {
            path: resolvePath(clientWorkspacePath, `./public`),
          },
          plugins: [],
        },
        customServerConfig: {
          serverWorkspacePath,
          entry: serverEntry,
          output: {
            libraryTarget: `commonjs2`,
            path: resolvePath(serverWorkspacePath, `./public`),
          },
          plugins: [],
        },
      };
    });
}

function distinctClientWebpackConfigInSource(__source__) {
  return __source__
    .distinctUntilChanged(({ customClientConfig }) =>
      JSON.stringify(customClientConfig)
    );
}

function distinctServerWebpackConfigInSource(__source__) {
  return __source__
    .distinctUntilChanged(({ customServerConfig }) =>
      JSON.stringify(customServerConfig)
    );
}

function addWebpackHMRStuffToClientEntry(__source__) {
  return __source__
    .map(source => {
      const { customClientConfig } = source;
      const { entry } = customClientConfig;
      const extraEntry = require.resolve(`webpack-hot-middleware/client`);

      Object.keys(entry).forEach(chunkName => {
        entry[chunkName].unshift(extraEntry);
      });

      customClientConfig.plugins = [
        ...customClientConfig.plugins,
        new webpack.HotModuleReplacementPlugin(),
      ];
      return source;
    });
}

function sourceToClientWebpackConfig(__source__) {
  return __source__
    .map(({ srcFile, customClientConfig }) =>
      createClientWebpackConfig(customClientConfig)
    );
}

function sourceToServerWebpackConfig(__source__) {
  return __source__
    .map(({ srcFile, customServerConfig }) =>
      createServerWebpackConfig(customServerConfig)
    );
}

export function sourceToWebpackMultiCompilerWithHMR(__source__) {
  const __client__ = __source__
    .let(distinctClientWebpackConfigInSource)
    .let(addWebpackHMRStuffToClientEntry)
    .let(sourceToClientWebpackConfig);

  const __server__ = __source__
    .let(distinctServerWebpackConfigInSource)
    .let(sourceToServerWebpackConfig);

  return Observable
    .combineLatest(
      __client__,
      __server__,
      (clientWebpackConfig, serverWebpackConfig) => (
        [clientWebpackConfig, serverWebpackConfig]
      )
    )
    .scan((webpackMultiCompiler, webpackConfigList) => (
       webpack(webpackConfigList)
    ), null);
}

export function sourceToWebpackMultiCompiler(__source__) {
  const __client__ = __source__
    .let(distinctClientWebpackConfigInSource)
    .let(sourceToClientWebpackConfig);

  const __server__ = __source__
    .let(distinctServerWebpackConfigInSource)
    .let(sourceToServerWebpackConfig);

  return Observable
    .combineLatest(
      __client__,
      __server__,
      (clientWebpackConfig, serverWebpackConfig) => (
        [clientWebpackConfig, serverWebpackConfig]
      )
    )
    .scan((webpackMultiCompiler, webpackConfigList) => (
      webpack(webpackConfigList)
    ), null);
}

export function runWebpackMultiCompilerToMultiStats(__webpackMultiCompiler__) {
  return __webpackMultiCompiler__
    .selectMany(async function selectWebpackMultiCompiler(webpackMultiCompiler) {
      const [
        { options: clientWebpackConfig },
        { options: serverWebpackConfig },
      ] = webpackMultiCompiler.compilers;
      debugCore(`clientWebpackConfig`, !!clientWebpackConfig);
      debugCore(`serverWebpackConfig`, !!serverWebpackConfig);

      const webpackMultiStats = await thenify(::webpackMultiCompiler.run)();
      const [client, server] = webpackMultiStats.stats;

      debugCore(`webpack client errors`, client.toJson().errors);
      debugCore(`webpack server errors`, server.toJson().errors);

      return {
        clientSrcFS: fs,
        clientWorkspacePath: clientWebpackConfig.clientWorkspacePath,
        clientOutputPublicPath: clientWebpackConfig.output.publicPath,
        clientOutputPath: clientWebpackConfig.output.path,
        serverWorkspacePath: serverWebpackConfig.serverWorkspacePath,
        client: createJoinStats(client),
        server: createJoinStats(server),
      };
    });
}

export const PORT = 8080;

export function watchWebpackMultiCompilerWithConnectAppToMultiStats(__webpackMultiCompiler__) {
  return __webpackMultiCompiler__
    .selectMany(([webpackMultiCompiler, publicDir]) => {
      const [webpackClientCompiler] = webpackMultiCompiler.compilers;
      const [
        { options: clientWebpackConfig },
        { options: serverWebpackConfig },
      ] = webpackMultiCompiler.compilers;
      debugCore(`clientWebpackConfig`, !!clientWebpackConfig);
      debugCore(`serverWebpackConfig`, !!serverWebpackConfig);

      return Observable.create(observer => {
        // Because we only pass in webpackClientCompiler to webpackDevMiddleware
        // , we have to watch ourselves
        const watcher = webpackMultiCompiler.watch({
          aggregateTimeout: 200,
        }, error => {
          if (error) {
            observer.onNext(error);
          }
        });
        const app = connect();
        // We only pass in webpackClientCompiler to middlewares
        // so that the publicPath will be correct
        app.use(webpackDevMiddleware(webpackClientCompiler, {
          publicPath: `/${ clientWebpackConfig.output.publicPath }`,
          noInfo: true,
          quiet: true,
        }));
        app.use(webpackHotMiddleware(webpackClientCompiler));
        //
        app.use(serveStaticMiddleware(publicDir));
        //
        webpackMultiCompiler.plugin(`done`, webpackMultiStats => {
          const [client, server] = webpackMultiStats.stats;

          debugCore(`webpack client errors`, client.toJson().errors);
          debugCore(`webpack server errors`, server.toJson().errors);

          const clientSrcFS = thenifyMemoryFS(webpackClientCompiler.outputFileSystem);

          observer.onNext({
            clientSrcFS,
            clientWorkspacePath: clientWebpackConfig.clientWorkspacePath,
            clientOutputPublicPath: clientWebpackConfig.output.publicPath,
            clientOutputPath: clientWebpackConfig.output.path,
            serverWorkspacePath: serverWebpackConfig.serverWorkspacePath,
            client: createJoinStats(client),
            server: createJoinStats(server),
          });
        });

        const server = app.listen(PORT);

        return () => {
          debugCore(`Close connect server!!`);
          watcher.close();
          server.close();
        };
      });
    })
    .shareReplay();
}

export function joinStatsWithArgumentListToFinalBundle(__joinStatsWithArgList__) {
  return __joinStatsWithArgList__
    .selectMany(async function selectArgsToFinalBundle(
      [webpackJoinStatsMap, outDir, prerenderPropsList, source]
    ) {
      const { srcFile, html, serverEntryList } = source;
      const srcExtname = extractExtname(srcFile);

      const htmlFileList = await Promise.all(
        prerenderPropsList.map(async function prerenderPropsToHTMLFile(prerenderProps) {
          const $ = cheerio.load(html);
          const injectPropsByProvideName = await renderServerEntryList(
            prerenderProps,
            serverEntryList,
            webpackJoinStatsMap.server
          );
          debugCore(`combineLatestToBundle`, {
            clientSrcFS: !!webpackJoinStatsMap.clientSrcFS,
            prerenderProps: !!prerenderProps,
            outDir: !!outDir,
          });

          alterInjectEntryList($, injectPropsByProvideName);
          alterServerEntryList($);
          //
          alterClientEntryList($, webpackJoinStatsMap.client);
          //
          alterModuleEntryList($);

          let destFile = prerenderProps.location;
          if (destFile.match(/\/$/)) {
            destFile = `${ destFile }index`;
          }
          destFile = `${ destFile }${ srcExtname }`;

          return {
            destFile,
            html: $.html(),
          };
        })
      );

      return {
        htmlFileList,
        outDir,
        clientSrcFS: webpackJoinStatsMap.clientSrcFS,
        clientWorkspacePath: webpackJoinStatsMap.clientWorkspacePath,
        clientOutputPublicPath: webpackJoinStatsMap.clientOutputPublicPath,
        clientOutputPath: webpackJoinStatsMap.clientOutputPath,
        serverWorkspacePath: webpackJoinStatsMap.serverWorkspacePath,
      };
    });
}

export function finalBundleToOutputSideEffect(__finalBundle__) {
  return __finalBundle__
    .selectMany(async function selectOptionsIntoBundle(options) {
      const {
        htmlFileList,
        outDir,
        clientSrcFS,
        clientOutputPublicPath,
        clientOutputPath,
      } = options;
      debugCore(`finalBundleToOutputSideEffect`, htmlFileList.length);
      const outDirWithPublicPath = resolvePath(outDir, clientOutputPublicPath);

      const [rawClientAssetList] = await Promise.all([
        clientSrcFS.readdir(clientOutputPath),
        mkdirp(outDirWithPublicPath),
      ]);
      const clientAssetList = rawClientAssetList.filter(it => !it.match(/hot-update/));

      const firstAsset = resolvePath(clientOutputPath, clientAssetList[0]);
      const isFile = (await clientSrcFS.stat(firstAsset)).isFile();
      debugCore(`clientAssetList`, !!clientAssetList);
      debugCore(`exists?`, isFile);

      await Promise.all([
        ...clientAssetList.map(name => copy(
          clientSrcFS,
          resolvePath(clientOutputPath, name),
          resolvePath(outDirWithPublicPath, name),
        )),
        ...htmlFileList.map(async function htmlFileWithMkdirp({ destFile, html }) {
          const filename = resolvePath(outDir, `.${ destFile }`);
          const dirname = extractDirname(filename);
          await mkdirp(dirname);
          await fs.writeFile(filename, html, `utf8`);
        }),
      ]);

      return {
        clientWorkspacePath: options.clientWorkspacePath,
        serverWorkspacePath: options.serverWorkspacePath,
      };
    });
}
