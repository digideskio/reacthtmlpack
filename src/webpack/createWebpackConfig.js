import {
  isAbsolute as isAbsolutePath,
  resolve as resolvePath,
} from "path";

import {
  default as thenify,
} from "thenify";

import {
  track as trackTemppath,
  cleanup as cleanupTemppath,
  mkdir as nodeCreateTempdir,
} from "temp";

import {
  default as invariant,
} from "invariant";

import {
  default as _,
} from "lodash";

import {
  default as ExtractTextPlugin,
} from "extract-text-webpack-plugin";

import {
  default as createBaseConfig,
} from "./createBaseConfig";

const createTempdir = thenify(nodeCreateTempdir);

export function createWebpackWorkspaceDir(dirname: string, chunkName: string) {
  invariant(dirname, `chunkName should exist. Got %s`, dirname);
  invariant(chunkName, `chunkName should exist. Got %s`, chunkName);
  process.on(`SIGINT`, cleanupTemppath); // https://github.com/bruce/node-temp/issues/10
  trackTemppath(true);

  return createTempdir({
    dir: dirname,
    prefix: chunkName,
  });
}

let CLIENT_BABEL_PLUGINS;

if (process.env.NODE_ENV === `production`) {
  CLIENT_BABEL_PLUGINS = [];
} else {
  CLIENT_BABEL_PLUGINS = [
    [
      `react-transform`,
      {
        transforms: [
          {
            transform: `react-transform-hmr`,
            imports: [`react`],
            locals: [`module`],
          }, {
            transform: `react-transform-catch-errors`,
            imports: [`react`, `redbox-react`],
          },
        ],
      },
    ],
  ];
}

export function createClientWebpackConfig(customConfig: Object) {
  invariant(customConfig.output.path,
    `You must specify output.path. Got %s`, customConfig.output.path
  );
  const baseConfig = createBaseConfig();
  invariant(`publicPath` in baseConfig.output,
    `You must specify output.publicPath. Got %s`, baseConfig.output.publicPath
  );

  const clientExtractTextPlugin = new ExtractTextPlugin(`[name]-[chunkhash].css`, {
    disable: `production` !== process.env.NODE_ENV,
  });

  return {
    ...baseConfig,
    ...customConfig,
    output: {
      ...baseConfig.output,
      ...customConfig.output,
      path: resolvePath(customConfig.output.path, baseConfig.output.publicPath),
    },
    target: `web`,
    module: {
      ...baseConfig.module,
      loaders: [
        ...baseConfig.module.loaders.filter(({ loader }) => loader !== `babel`),
        {
          ...baseConfig.module.loaders.filter(({ loader }) => loader === `babel`)[0],
          query: {
            plugins: CLIENT_BABEL_PLUGINS,
          },
        },
        {
          test: /\.css$/,
          loader: clientExtractTextPlugin.extract(`style`, `css?module`),
        },
      ],
    },
    plugins: [
      ...baseConfig.plugins,
      clientExtractTextPlugin,
      ...customConfig.plugins,
    ],
  };
}

const CSS_REGEX = /\.css$/;

function requestToCommonJSModule(request: string): Object {
  // -!./../../node_modules/css-loader/index.js!flexboxgrid
  // flexboxgrid
  //
  try {
    // FIXME: Assume everything can be found in node_modules
    const absPath = require.resolve(request);
    if (CSS_REGEX.test(absPath)) {
      return { // Because we use css-modules by default
        isExternal: false,
        moduleName: null,
      };
    }
  } catch (e) {
    // DO nothing
  }
  // Make it external.
  return {
    isExternal: true,
    moduleName: `commonjs ${request}`,
  };
}

export function webpackExternalsResolver(context, requestWithLoaderStr, done) {
  let request = requestWithLoaderStr;
  if (/!/.test(requestWithLoaderStr)) {
    // We don't care about loader prefix……
    request = _.last(requestWithLoaderStr.split(`!`));
  }
  // https://github.com/webpack/webpack/issues/839#issuecomment-76736465
  if (isAbsolutePath(request)) {
    done();
  } else if (/^\./.test(request)) {
    done();
  } else if (CSS_REGEX.test(request)) {
    done();
  } else {
    const { isExternal, moduleName } = requestToCommonJSModule(request);
    if (isExternal) {
      done(null, moduleName);
    } else {
      done();
    }
  }
}

export function createServerWebpackConfig(customConfig: Object) {
  const baseConfig = createBaseConfig();

  const serverExtractTextPlugin = new ExtractTextPlugin(`[name]-[chunkhash].css`, {
    disable: `production` !== process.env.NODE_ENV,
  });

  return {
    ...baseConfig,
    ...customConfig,
    target: `node`,
    externals: webpackExternalsResolver,
    module: {
      ...baseConfig.module,
      loaders: [
        ...baseConfig.module.loaders,
        {
          test: /\.css$/,
          loader: serverExtractTextPlugin.extract(`css?module`),
        },
      ],
    },
    plugins: [
      ...baseConfig.plugins,
      serverExtractTextPlugin,
      ...customConfig.plugins,
    ],
  };
}
