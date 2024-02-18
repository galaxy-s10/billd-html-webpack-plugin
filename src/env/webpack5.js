/** @typedef {import("webpack/lib/Compiler.js")} WebpackCompiler */
/** @typedef {import("webpack/lib/Compilation.js")} WebpackCompilation */

import webpack from 'webpack';

import { logInfo } from '../getData';

class PluginApply {
  /**
   * @param {WebpackCompiler} compiler
   */
  constructor(compiler, { pluginName, log }) {
    compiler.hooks.compilation.tap(
      pluginName,
      /**
       * @param {WebpackCompilation} compilation
       */
      (compilation) => {
        compilation.hooks.processAssets.tapAsync(
          {
            name: pluginName,
            stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL, // 在编译中添加额外的 asset。
            additionalAssets: true,
          },
          (assets, cb) => {
            Object.entries(assets).forEach(([pathname, source]) => {
              if (pathname.match(/.html$/)) {
                // webpack5的某些版本的PROCESS_ASSETS_STAGE_ADDITIONAL阶段的source会没有_value
                // eslint-disable-next-line
                if (source._value) {
                  // source._value有可能是一个buffer，因此需要toString()
                  // eslint-disable-next-line
                  const str = source._value
                    .toString()
                    .replace(
                      '</head>',
                      `<script>${logInfo(log)}</script></head>`
                    );
                  // eslint-disable-next-line
                  source._value = str;
                }
              }
            });
            cb();
          }
        );
      }
    );
  }
}

export default PluginApply;
