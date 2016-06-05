## Getting Started

The simplest example is [SimpleScript](https://github.com/tomchentw/reacthtmlpack/tree/master/examples/SimpleScript). It takes **4** steps to build them up. The result directory structure is like this (using [tree](http://mama.indstate.edu/users/ice/tree/)):

```shell
➜  SimpleScript git:(master) tree -L 2
.
├── SimpleScript.webpackConfig.js
├── node_modules
│   └──               # Ignore
├── package.json
├── scripts
│   ├── SimpleMap.js  # Our React Components
│   └── client.js     # The script that browsers will load as entry point
└── views
    └── index.html.js # "Template" file for generating `index.html`
```


### 1 - Generate HTML Template with React

Create an [`index.html.js`](https://github.com/tomchentw/reacthtmlpack/blob/master/examples/SimpleScript/scripts/index.html.js) file that exports your html template as react elements.

```js
export default (
  <html>
    <head>
    // omitted ...
    </body>
  </html>
);
```

#### Notice

* This file will be `require`d and evaluated in **node** context. Be sure to only use components that don't contain browser stuff.
* The default export is a *instance* of `ReactElement`. Exporting the *class* of `React.Component` (or `React.createClass`) is **NOT** supported.
* You have to import `React` in your code since JSX transformer in babel will need it present in the local scope.


### 2 - Put <WebpackScriptEntry> Component(s) in the Template

Inside the `<body>` of [`index.html.js`](https://github.com/tomchentw/reacthtmlpack/blob/master/examples/SimpleScript/views/index.html.js), add `<WebpackScriptEntry>`.

```js
    // omitted ...
    <WebpackScriptEntry
      chunkName="assets/client"
      chunkFilepath="./scripts/client.js"
      configFilepath="../SimpleScript.webpackConfig.js"
    />
    </body>
  </html>
);
```

The `WebpackScriptEntry` specified your webpack entry point for the application. It will be replaced to `<script>` after webpack compiles. There are three required props: `chunkName`, `chunkFilepath` and `configFilepath`:

#### `(string) chunkName`

The **key** part of [`entry` object property in the webpack config file](http://webpack.github.io/docs/configuration.html#entry).

#### `(string/array<string>) chunkFilepath`

The **value** part of [`entry` object property in the webpack config file](http://webpack.github.io/docs/configuration.html#entry). If you pass relative path in, its base path will be this template file.

#### `(string) configFilepath`

The **relative filepath** from this template to your webpack config file. The webpack config will be responsible for generating the entry.

#### Notice

* Unlike webpack config, `chunkName` is always required for explicity.


### 3 - Setting up Webpack Config File

Create [the webpack config file](https://github.com/tomchentw/reacthtmlpack/blob/master/examples/SimpleScript/SimpleScript.webpackConfig.js). Please don't include `entry` property in the config since we already specify it using `<WebpackScriptEntry>`. If you do, they will be replaced by *reacthtmlpack* and thus has **NO** effect.

```js
module.exports = {
  output: {
    path: Path.resolve(__dirname, "../../public"),
    filename: "[name].js",
  },
  module: {
    loaders: [
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        loaders: ["babel"],
      },
    ],
  },
  // ... omitted
};
```

#### Notice

* To reduce debugging time, you should set [the `context` property in the webpack config file](http://webpack.github.io/docs/configuration.html#context).


### 4 - Build up the Assets

```sh
cd examples/SimpleScript
npm install
npm run dev # reacthtmlpack buildToDir ../../public './views/*.html.js'
```

Look at the [public](https://github.com/tomchentw/reacthtmlpack/tree/master/public) folder and you'll see the following:

```txt
➜  public git:(master) ✗ tree
.
├── CNAME
├── assets
│   └── client.js   # Browser side entry created by <WebpackScriptEntry>
└── index.html      # Generated by index.html.js. Will hava a <script> tag points to assets/client.js

1 directory, 3 files
```


### Full View of Input

*index.html.js*

```js
import {
  default as React,
} from "react";

import {
  WebpackScriptEntry
} from "../../../lib/entry";

export default (
  <html>
    <head>
      <title>React Google Maps | tomchentw</title>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <meta charSet="UTF-8" />
      <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing" />
    </head>
    <body>
      <div id="react-container" />
      <WebpackScriptEntry
        chunkName="assets/client"
        chunkFilepath="./scripts/client.js"
        configFilepath="../SimpleScript.webpackConfig.js"
      />
    </body>
  </html>
);
```

*SimpleScript.webpackConfig.js*

```js
"use strict";

var Path = require("path");
var webpack = require("webpack");

module.exports = {
  output: {
    path: Path.resolve(__dirname, "../../public"),
    filename: "[name].js",
  },
  module: {
    loaders: [
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        loaders: ["babel"],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin("NODE_ENV"),
  ],
};
```

P.S. You can write [babel](https://babeljs.io/) supported [webpack](https://webpack.github.io/) config since [0.3.0](https://github.com/tomchentw/reacthtmlpack/blob/master/CHANGELOG.md#030-2015-09-01).


### Full View of Output

*public/index.html*

```html
<!DOCTYPE html><html><head><title>React Google Maps | tomchentw</title><meta name="viewport" content="width=device-width, initial-scale=1"><meta charset="UTF-8"><script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&amp;libraries=geometry,drawing"></script></head><body><div id="react-container"></div><script src="assets/client.js"></script></body></html>
```

*public/assets/client.js*

```js
/******/ (function(modules) { // webpackBootstrap
/******/  // The module cache
/******/  var installedModules = {};

/******/  // The require function
/******/  function __webpack_require__(moduleId) {

// Omitted ...

/******/  // Load entry module and return exports
/******/  return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

// Omitted ...

  _react2["default"].render(_react2["default"].createElement(_SimpleMap2["default"], null), document.getElementById("react-container"));

// Omitted ...
```