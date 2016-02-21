import {
  Observable,
} from "rx";

import {
  srcFileToAbsolutePath,
  srcFileToSrcWithWorkspace,
  srcWithWorkspaceToSource,
  sourceToWebpackMultiCompiler,
  runWebpackMultiCompilerToMultiStats,
  joinStatsWithArgumentListToFinalBundle,
  finalBundleToOutputSideEffect,
} from "./core";

export default function build(
  __srcFile__: Observable,
  __outDir__: Observable,
  __prerenderPropsList__: Observable,
): Observable {
  const __source__ = __srcFile__
    .let(srcFileToAbsolutePath)
    .let(srcFileToSrcWithWorkspace)
    .let(srcWithWorkspaceToSource)
    .shareReplay();

  const __webpackMultiCompiler__ = __source__
    .let(sourceToWebpackMultiCompiler);

  const __webpackJoinStatsMap__ = __webpackMultiCompiler__
    .let(runWebpackMultiCompilerToMultiStats);

  const __finalBundle__ = __webpackJoinStatsMap__
    .withLatestFrom(
      __outDir__,
      __prerenderPropsList__,
      __source__,
    )
    .let(joinStatsWithArgumentListToFinalBundle);

  return __finalBundle__
    .let(finalBundleToOutputSideEffect);
}
