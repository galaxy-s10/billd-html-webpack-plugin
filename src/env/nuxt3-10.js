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
        console.log('configResolvedconfigResolved');
        // @ts-ignore
        const str1 = resolvedConfig.build.rollupOptions.input.entry;
        const url = str1?.split('?')[0];
        if (url) {
          entry = url;
        }
      },
      transform(code, id) {
        console.log('kkkkkkkkk', info);
        const str = id?.split('?')[0];
        console.log(entry, str, '999');
        if (entry === str) {
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
