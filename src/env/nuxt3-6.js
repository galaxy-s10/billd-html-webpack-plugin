/** @typedef {import("rollup").Plugin} PluginContext */
/** @typedef {import("rollup").NormalizedAmdOptions} NormalizedOutputOptions */
/** @typedef {import("rollup").OutputBundle} OutputBundle */
/** @typedef {import("rollup").OutputAsset} OutputAsset */
/** @typedef {import("vite").Plugin} Plugin */

import { logInfo } from '../getData';

class PluginConfig {
  constructor({ pluginName, log }) {
    let entry;

    const info = logInfo(log);

    /** @type {Plugin} */
    const plugin = {
      name: pluginName,
      configResolved(resolvedConfig) {
        // @ts-ignore
        entry = resolvedConfig.build.rollupOptions.input.entry;
      },
      transform(code, id) {
        if (entry?.indexOf(id) !== -1) {
          const str1 = code.replace(
            'if (process.client) {',
            `if (process.client) {${info}\n`
          );
          return { code: str1 };
        }
      },
    };

    return plugin;
  }
}

export default PluginConfig;
