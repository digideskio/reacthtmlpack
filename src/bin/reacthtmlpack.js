import {
  default as program,
} from "commander";

import {
  version,
} from "../../package.json";

// Git-style sub-commands
// https://github.com/tj/commander.js#git-style-sub-commands

program
  .version(version)
  .command(`build`, `build into html + assets`)
  .command(`devServer`, `build and also start a server at localhost:8080`)
  .parse([
    process.argv[0],
    __filename,
    ...process.argv.slice(2),
  ]);
