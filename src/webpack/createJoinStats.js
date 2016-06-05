import {
  default as nodeDebug,
} from "debug";

import {
  extname as extractExtname,
} from "path";

import {
  default as invariant,
} from "invariant";

const debugWepback = nodeDebug(`reacthtmlpack:webpack`);

export function createJoinsStatsWithJsonStatsOnly(jsonStats) {
  invariant(false, `Unimplemented`);
}

function getMatchedAssetName(jsonStats, chunkName, extname) {
  debugWepback(jsonStats.assetsByChunkName);
  const assets = jsonStats.assetsByChunkName[chunkName];
  const matchedAssetNameList = [].concat(assets)
    .filter(assetName => !assetName.match(/hot-update/))
    .filter(assetName => extractExtname(assetName) === extname);
  const MESSAGE = `
From assets (%s), there should be one assetName for chunkName %s with extname %s`;
  invariant(matchedAssetNameList.length === 1, MESSAGE, assets, chunkName, extname);
  return matchedAssetNameList[0];
}

export default function createJoinStats(stats) {
  const jsonStats = stats.toJson();

  return {
    getSourceByChunkName(chunkName, extname) {
      const assetName = getMatchedAssetName(jsonStats, chunkName, extname);
      const asset = stats.compilation.assets[assetName];
      invariant(asset, `Should exist asset for assetName(%s), chunkName(%s)`, assetName, chunkName);
      const code = asset.source();
      invariant(code, `Should exist code for assetName(%s), chunkName(%s)`, assetName, chunkName);
      return code;
    },

    getPublicPathByChunkName(chunkName, extname) {
      const assetName = getMatchedAssetName(jsonStats, chunkName, extname);
      return `${jsonStats.publicPath}${assetName}`;
    },
  };
}
