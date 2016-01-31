import {
  default as fs,
} from "mz/fs";

import {
  resolve as resolvePath,
} from "path";

import {
  transform,
} from "babel-core";

import {
  default as appendRelativePathPlugin,
} from "./appendRelativePathPlugin";

// FIXME
const BabelPluginSyntaxList = fs.readdirSync(resolvePath(__dirname, `../../node_modules`), `utf8`)
  .filter(name => /^babel-plugin-syntax/.test(name));

export default function transformRelativePath(
  text: string, moduleExcludeList: Array<string>
): string {
  return transform(text, {
    babelrc: false,
    plugins: [
      ...BabelPluginSyntaxList,
      [
        appendRelativePathPlugin, {
          appendPath: `..`,
          moduleExcludeList,
        },
      ],
    ],
  }).code;
}
