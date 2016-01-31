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
  devServer,
} from "../index";

// Git-style sub-commands
// https://github.com/tj/commander.js/blob/master/examples/pm-install
program
  .arguments(`<srcFile>`)
  .option(`--public-dir <publicDir>`, `required. All *.(html|js|css|…) will go
 "virtually" under this path. Also put your extra static files in this path.`)
  .option(`--prerender-props-json-path [prerenderPropsJsonPath]`,
    `optional. Prerender props in json format with react-router/match.`
  )
  .parse(process.argv);

const { args, publicDir, prerenderPropsJsonPath } = program;

if (args.length === 0 || !publicDir) {
  program.outputHelp();
  process.exit(1);
} else {
  const [srcFile] = args;
  const __srcFile__ = Observable.of(srcFile);
  const __publicDir__ = Observable.of(publicDir);
  const __prerenderPropsList__ = prerenderProps(prerenderPropsJsonPath);

  const __consoleObserver__ = Observer.create(() => {
    console.log(`Next!`);
  }, (error) => {
    console.error(`ERRRRRRRRRORRRRRR`);
    console.error(`ERRRRRRRRRORRRRRR`);
    console.error(`ERRRRRRRRRORRRRRR`);
    console.error(error.stack);
  }, () => {
    console.log(`Complete!`);
  });

  const subscrpition = devServer(__srcFile__, __publicDir__, __prerenderPropsList__)
    .subscribe(__consoleObserver__);

  process.on(`SIGINT`, ::subscrpition.dispose);
}
