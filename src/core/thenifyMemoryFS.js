import {
  default as thenify,
} from "thenify";

const api = [
  // From mz/fs
  `rename`,
  `ftruncate`,
  `chown`,
  `fchown`,
  `lchown`,
  `chmod`,
  `fchmod`,
  `stat`,
  `lstat`,
  `fstat`,
  `link`,
  `symlink`,
  `readlink`,
  `realpath`,
  `unlink`,
  `rmdir`,
  `mkdir`,
  `readdir`,
  `close`,
  `open`,
  `utimes`,
  `futimes`,
  `fsync`,
  `write`,
  `read`,
  `readFile`,
  `writeFile`,
  `appendFile`,
];

export default function thenifyMemoryFS(memoryFS) {
  return Object.keys(Object.getPrototypeOf(memoryFS)).reduce((acc, key) => {
    const isAsyncFunction = api.indexOf(key) !== -1;
    const boundFn = ::memoryFS[key];
    /* eslint-disable no-param-reassign */
    acc[key] = isAsyncFunction ? thenify(boundFn) : boundFn;
    /* eslint-enable no-param-reassign */
    return acc;
  }, {
    ...memoryFS,
  });
}
