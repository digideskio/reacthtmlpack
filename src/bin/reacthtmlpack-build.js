/* eslint-disable no-console */
import {
  default as program,
} from "commander";

import {
  Observable,
  Observer,
} from "rx";

import {
  default as prerenderProps,
} from "./prerenderProps";

import {
  build,
} from "../index";

// Git-style sub-commands
// https://github.com/tj/commander.js/blob/master/examples/pm-install
program
  .arguments(`<srcFile>`)
  .option(`--out-dir <outDir>`, `required. Output directory path for *.(html|js|css|…)`)
  .option(`--prerender-props-json-path [prerenderPropsJsonPath]`,
    `optional. Prerender props in json format with react-router/match.`
  )
  .parse(process.argv);

const { args, outDir, prerenderPropsJsonPath } = program;

if (args.length === 0 || !outDir) {
  program.outputHelp();
  process.exit(1);
} else {
  const [srcFile] = args;
  const __srcFile__ = Observable.of(srcFile);
  const __outDir__ = Observable.of(outDir);
  const __prerenderPropsList__ = prerenderProps(prerenderPropsJsonPath);

  const __consoleObserver__ = Observer.create(() => {
    console.log(`Next!`);
  }, (error) => {
    console.error(error.stack);
  }, () => {
    console.log(`Complete!`);
  });

  build(__srcFile__, __outDir__, __prerenderPropsList__).subscribe(__consoleObserver__);
}
