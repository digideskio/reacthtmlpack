import {
  Observable,
} from "rx";

import {
  srcFileToSrcWithWorkspace,
  srcWithWorkspaceAddWatcher,
  srcWithWorkspaceToSource,
  sourceToWebpackMultiCompilerWithHMR,
  watchWebpackMultiCompilerWithConnectAppToMultiStats,
  joinStatsWithArgumentListToFinalBundle,
  finalBundleToOutputSideEffect,
} from "./core";

export default function devServer(
  __srcFile__: Observable,
  __publicDir__: Observable,
  __prerenderPropsList__: Observable
): Observable {
  const __source__ = __srcFile__
    .let(srcFileToSrcWithWorkspace)
    .let(srcWithWorkspaceAddWatcher)
    .let(srcWithWorkspaceToSource)
    .shareReplay();

  const __webpackMultiCompiler__ = __source__
    .let(sourceToWebpackMultiCompilerWithHMR);

  const __webpackJoinStatsMap__ = __webpackMultiCompiler__
    .withLatestFrom(
      __publicDir__,
    )
    .let(watchWebpackMultiCompilerWithConnectAppToMultiStats);

  const __finalBundle__ = __webpackJoinStatsMap__
    .withLatestFrom(
      __publicDir__,
      __prerenderPropsList__,
      __source__,
    )
    .let(joinStatsWithArgumentListToFinalBundle);

  return __finalBundle__
    .let(finalBundleToOutputSideEffect);
}
