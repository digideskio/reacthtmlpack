"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJoinsStatsWithJsonStatsOnly = createJoinsStatsWithJsonStatsOnly;
exports.default = createJoinStats;

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

var _path = require("path");

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debugWepback = (0, _debug2.default)("reacthtmlpack:webpack");

function createJoinsStatsWithJsonStatsOnly(jsonStats) {
  (0, _invariant2.default)(false, "Unimplemented");
}

function getMatchedAssetName(jsonStats, chunkName, extname) {
  debugWepback(jsonStats.assetsByChunkName);
  var assets = jsonStats.assetsByChunkName[chunkName];
  var matchedAssetNameList = [].concat(assets).filter(function (assetName) {
    return !assetName.match(/hot-update/);
  }).filter(function (assetName) {
    return (0, _path.extname)(assetName) === extname;
  });
  var MESSAGE = "\nFrom assets (%s), there should be one assetName for chunkName %s with extname %s";
  (0, _invariant2.default)(matchedAssetNameList.length === 1, MESSAGE, assets, chunkName, extname);
  return matchedAssetNameList[0];
}

function createJoinStats(stats) {
  var jsonStats = stats.toJson();

  return {
    getSourceByChunkName: function getSourceByChunkName(chunkName, extname) {
      var assetName = getMatchedAssetName(jsonStats, chunkName, extname);
      var asset = stats.compilation.assets[assetName];
      (0, _invariant2.default)(asset, "Should exist asset for assetName(%s), chunkName(%s)", assetName, chunkName);
      var code = asset.source();
      (0, _invariant2.default)(code, "Should exist code for assetName(%s), chunkName(%s)", assetName, chunkName);
      return code;
    },
    getPublicPathByChunkName: function getPublicPathByChunkName(chunkName, extname) {
      var assetName = getMatchedAssetName(jsonStats, chunkName, extname);
      return "" + jsonStats.publicPath + assetName;
    }
  };
}