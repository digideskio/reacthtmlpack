import {
  transform,
} from "babel-core";

import {
  default as appendRelativePathPlugin,
} from "./appendRelativePathPlugin";

export default function transformRelativePath(
  text: string, moduleExcludeList: Array<string>
): string {
  return transform(text, {
    babelrc: false,
    presets: [
      `babel-preset-syntax-from-presets`,
    ],
    plugins: [
      [
        appendRelativePathPlugin, {
          appendPath: `..`,
          moduleExcludeList,
        },
      ],
    ],
  }).code;
}
