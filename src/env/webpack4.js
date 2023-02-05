/** @typedef {import("webpack/lib/Compiler.js")} WebpackCompiler */
/** @typedef {import("webpack/lib/Compilation.js")} WebpackCompilation */

import { logInfo } from '../getData';

class PluginApply {
  /**
   * @param {WebpackCompiler} compiler
   */
  constructor(compiler, { pluginName, log }) {
    compiler.hooks.emit.tap(
      pluginName,
      /**
       * @param {WebpackCompilation} compilation
       */
      (compilation) => {
        // [DEP_WEBPACK_COMPILATION_ASSETS] DeprecationWarning: Compilation.assets will be frozen in future, all modifications are deprecated.
        // 即webpack5不推荐使用compilation.assets来修改资产，使用Compilation.hooks.processAssets来替换
        Object.keys(compilation.assets).forEach((data) => {
          const content = compilation.assets[data].source();
          if (data.match(/.html$/)) {
            // @ts-ignore
            const str = content.replace(
              '</head>',
              `<script>${logInfo(log)}</script></head>`
            );
            // @ts-ignore
            compilation.assets[data] = {
              source() {
                return str;
              },
              size() {
                return str.length;
              },
            };
          }
        });
      }
    );
  }
}

export default PluginApply;
