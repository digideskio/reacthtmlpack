import {
  default as nodeDebug,
} from "debug";

import {
  basename as extractBasename,
  extname as extractExtname,
} from "path";

import {
  default as thenify,
} from "thenify";

import {
  get as getByObjectPath,
} from "object-path";

import {
  default as invariant,
} from "invariant";

import {
  default as evaluateAsModule,
} from "eval-as-module";

const debugElementProcessor = nodeDebug(`reacthtmlpack:elementProcessor`);

const MODULE_NAME = `data-reacthtmlpack-module-name`;

export function evaluateAsES2015Module(code: string, filepath: ?string) {
  const cjsModule = evaluateAsModule(code, filepath);
  const shouldBeAES2015Module = cjsModule.exports && cjsModule.exports.__esModule;
  invariant(shouldBeAES2015Module, `The code should be in module format`);
  return cjsModule.exports;
}

function moduleChunkName(moduleName) {
  return extractBasename(moduleName, extractExtname(moduleName));
}

export function processModule($) {
  return (index, element) => {
    const $entry = $(element);
    const moduleName = $entry.attr(MODULE_NAME);
    invariant(moduleName, `You must provide a valid value to ${ MODULE_NAME }`);

    return {
      moduleName,
      chunkName: moduleChunkName(moduleName),
      text: $entry.text(),
      providePropsName: $entry.attr(`data-reacthtmlpack-provide-props`),
    };
  };
}

const ENTRY_TARGET = `data-reacthtmlpack-entry-target`;
const ENTRY_TARGET__WEB__SELECTOR = `[${ ENTRY_TARGET }="web"]`;
const ENTRY_TARGET__NODE__SELECTOR = `[${ ENTRY_TARGET }="node"]`;

export function extractClientEntryList($) {
  return $(ENTRY_TARGET__WEB__SELECTOR)
    .map(processModule($))
    .toArray();
}

export function extractServerEntryList($) {
  return $(ENTRY_TARGET__NODE__SELECTOR)
    .map(processModule($))
    .toArray();
}

export function extractModuleList($) {
  return $(`[${ MODULE_NAME }]`)
    .not(`[${ ENTRY_TARGET }]`)
    .map(processModule($))
    .toArray();
}

export async function renderServerEntryList(prerenderProps, serverEntryList, serverJoinStats) {
  const promiseList = serverEntryList.map(async function selectServerEntryListToInjectProps(
    { chunkName, providePropsName }
  ) {
    const code = serverJoinStats.getSourceByChunkName(chunkName, `.js`);
    const { default: server } = evaluateAsES2015Module(code);
    debugElementProcessor({
      chunkName: !!chunkName,
      code: !!code,
      server: !!server.toString(),
      prerenderProps: !!prerenderProps,
    });

    const injectProps = await thenify(server)(prerenderProps);
    debugElementProcessor(`Provide ${ providePropsName } with `, {
      chunkName: !!chunkName,
      injectProps: !!injectProps,
    });
    return {
      providePropsName,
      injectProps,
    };
  });

  return (await Promise.all(promiseList))
    .reduce((acc, { providePropsName, injectProps }) => ({
      ...acc,
      [providePropsName]: injectProps,
    }), {});
}

const INJECT_PROPS = `data-reacthtmlpack-inject-props`;
const INJECT_METHOD = `data-reacthtmlpack-inject-method`;

export function alterInjectEntryList($, injectPropsByProvideName) {
  $(`[${ INJECT_PROPS }]`)
    .each((index, element) => {
      const $entry = $(element);
      const objectPath = $entry.attr(INJECT_PROPS);
      const method = $entry.attr(INJECT_METHOD) || `innerHTML`;

      $entry
        .removeAttr(INJECT_PROPS)
        .removeAttr(INJECT_METHOD);

      const value = getByObjectPath(injectPropsByProvideName, objectPath);
      const valueAsString = String(value);

      debugElementProcessor({
        objectPath: !!objectPath,
        method: !!method,
        value: !!value,
        valueAsString: !!valueAsString,
      });

      switch (method) {
        case `innerHTML`: {
          $entry.html(valueAsString);
          break;
        }
        case `replaceWith`: {
          $entry.replaceWith(valueAsString);
          break;
        }
        default: {
          invariant(false, `Unimplemented`);
        }
      }
    });
}

export function alterServerEntryList($) {
  $(ENTRY_TARGET__NODE__SELECTOR)
    .each((index, element) => {
      const $entry = $(element);

      $entry.remove();
    });
}

const EXTRACT_TEXT_FROM_MODULE_NAME = `data-reacthtmlpack-extract-text-from-module-name`;

export function alterClientEntryList($, clientJoinStats) {
  const alterElement = element => {
    const $entry = $(element);

    const moduleName = $entry.attr(MODULE_NAME) || $entry.attr(EXTRACT_TEXT_FROM_MODULE_NAME);
    const chunkName = moduleChunkName(moduleName);
    const extension = {
      script: `.js`,
      link: `.css`,
    }[element.tagName];

    const clientPath = clientJoinStats.getPublicPathByChunkName(chunkName, extension);

    const pathKey = {
      script: `src`,
      link: `href`,
    }[element.tagName];

    $entry
      .attr(pathKey, clientPath)
      .removeAttr(ENTRY_TARGET)
      .removeAttr(MODULE_NAME)
      .removeAttr(EXTRACT_TEXT_FROM_MODULE_NAME)
      .html(``);
  };

  $(ENTRY_TARGET__WEB__SELECTOR)
    .each((index, element) => alterElement(element));

  if (process.env.NODE_ENV === `production`) {
    $(`[${ EXTRACT_TEXT_FROM_MODULE_NAME }]`)
      .each((index, element) => alterElement(element));
  } else {
    $(`[${ EXTRACT_TEXT_FROM_MODULE_NAME }]`)
      .remove();
  }
}

export function alterModuleEntryList($) {
  $(`[${ MODULE_NAME }]`)
    .each((index, element) => {
      const $entry = $(element);

      $entry.remove();
    });
}
