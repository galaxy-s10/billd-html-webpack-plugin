/** @typedef {import("webpack/lib/Compiler.js")} WebpackCompiler */
/** @typedef {import("webpack/lib/Compilation.js")} WebpackCompilation */

import { logInfo } from './getData';

class PluginApply {
  reg = /static\/chunks\/webpack/;

  /**
   * @param {WebpackCompiler} compiler
   */
  constructor(compiler, { pluginName, log }) {
    try {
      compiler.hooks.emit.tap(
        pluginName,
        /**
         * @param {WebpackCompilation} compilation
         */
        (compilation) => {
          Object.keys(compilation.assets).forEach((data) => {
            const content = compilation.assets[data].source();
            if (this.reg.exec(data)) {
              const str = logInfo(log) + content;
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
    } catch (error) {
      console.log(error);
    }
  }
}

export default PluginApply;
