/* eslint-disable prefer-arrow-callback */

import {
  default as expect,
} from "expect";

import {
  webpackExternalsResolver,
} from "../createWebpackConfig";

const context = `/some/context/path`;

describe(`createWebpackConfig`, function describeCreateWebpackConfig() {
  describe(`webpackExternalsResolver`, function describeWebpackExternalsResolver() {
    it(`transform node built-in module`, function it() {
      webpackExternalsResolver(context, `path`, (error, result) => {
        expect(result).toEqual(`commonjs path`);
      });
    });

    it(`transform local modules in node_modules`, function it() {
      webpackExternalsResolver(context, `lodash/fp/map`, (error, result) => {
        expect(result).toEqual(`commonjs lodash/fp/map`);
      });
    });

    it(`transform local modules with webpack loader syntax`, function it() {
      webpackExternalsResolver(context, `css?module!flexboxgrid`, (error, result) => {
        expect(result).toEqual(`commonjs flexboxgrid`);
      });
    });
  });
});
