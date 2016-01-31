import {
  default as fs,
} from "mz/fs";

import {
  Observable,
} from "rx";

export default function prerenderProps(prerenderPropsJsonPath) {
  if (!prerenderPropsJsonPath) {
    return Observable.of([{ location: `/` }]);
  }
  return Observable.fromPromise(
    fs.readFile(prerenderPropsJsonPath, `utf8`)
  ).map(text => JSON.parse(text));
}
