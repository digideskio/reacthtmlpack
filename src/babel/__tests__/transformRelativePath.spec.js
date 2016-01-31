/* eslint-disable prefer-arrow-callback */

import {
  default as expect,
} from "expect";

import {
  default as transformRelativePath,
} from "../transformRelativePath";

describe(`transformRelativePath`, function describeTransformRelativePath() {
  describe(`default`, function describeDefault() {
    it(`transform commonjs require`, function it() {
      const code = transformRelativePath(`require("./path");`, []);
      expect(code).toEqual(`require("../path");`);
    });

    it(`transform ES2015 import`, function it() {
      const code = transformRelativePath(`import "./path";`, []);
      expect(code).toEqual(`import "../path";`);
    });

    context(`node_modules name`, function contextNodeModulesName() {
      it(`will not transform ES2015 import`, function it() {
        const code = transformRelativePath(`import "path";`, []);
        expect(code).toEqual(`import "path";`);
      });
    });

    context(`with exclude module list`, function contextWithExcludeModuleList() {
      it(`will not transform`, function it() {
        const code = transformRelativePath(`import * as p from "./path";`, [
          `./path`,
        ]);
        expect(code).toEqual(`import * as p from "./path";`);
      });

      it(`will transform`, function it() {
        const code = transformRelativePath(`import * as p from "./node";`, [
          `./path`,
        ]);
        expect(code).toEqual(`import * as p from "../node";`);
      });
    });
  });
});
