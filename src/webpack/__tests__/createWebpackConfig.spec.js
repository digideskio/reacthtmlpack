/* eslint-disable prefer-arrow-callback */

import {
  default as expect,
} from "expect";

import {
  default as thenify,
} from "thenify";

import {
  webpackExternalsResolver as nodeWebpackExternalsResolver,
} from "../createWebpackConfig";

const webpackExternalsResolver = thenify(nodeWebpackExternalsResolver);

const context = `/some/context/path`;

describe(`createWebpackConfig`, function describeCreateWebpackConfig() {
  describe(`webpackExternalsResolver`, function describeWebpackExternalsResolver() {
    it(`transform node built-in module`, async function it() {
      const result = await webpackExternalsResolver(context, `path`);
      expect(result).toEqual(`commonjs path`);
    });

    it(`transform local modules in node_modules`, async function it() {
      const result = await webpackExternalsResolver(context, `lodash/fp/map`);
      expect(result).toEqual(`commonjs lodash/fp/map`);
    });

    it(`transform local modules with webpack loader syntax`, async function it() {
      const result = await webpackExternalsResolver(context, `css?module!lodash`);
      expect(result).toInclude(`commonjs lodash`);
    });

    it(`transform local modules with css-modules`, async function it() {
      const result = await webpackExternalsResolver(context, `css?module!normalize.css`);
      expect(result).toBeFalsy();
    });
  });
});
