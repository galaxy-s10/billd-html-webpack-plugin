/** @typedef {import("webpack/lib/Compiler.js")} WebpackCompiler */
/** @typedef {import("webpack/lib/Compilation.js")} WebpackCompilation */

import webpack from 'webpack';

import { logInfo } from './getData';

class PluginApply {
  /**
   * @param {WebpackCompiler} compiler
   */
  constructor(compiler, { pluginName, log }) {
    try {
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
                  // eslint-disable-next-line
                  const str = source._value.replace(
                    '</head>',
                    `<script>${logInfo(log)}</script></head>`
                  );
                  // eslint-disable-next-line
                  source._value = str;
                }
              });
              cb();
            }
          );
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
}

export default PluginApply;
