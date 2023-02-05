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
      configResolved(config) {
        // @ts-ignore
        entry = config.entry;
      },
      transform(code, id) {
        if (id.indexOf(entry) !== -1) {
          const str1 = info + code;
          return { code: str1 };
        }
      },
      /**
       * @param {PluginContext} ctx
       * @param {PluginContext} opt
       * @param {PluginContext} bundle
       * @param {Boolean} iswrite
       */
      // writeBundle(ctx, opt, bundle, iswrite) {
      //   console.log('writeBundlewriteBundle');
      //   Object.keys(opt).forEach((id) => {
      //     if (id.match(/.html$/)) {
      //       /** @type {OutputAsset} */
      //       const asset = opt[id];
      //       // @ts-ignore
      //       const newstr = asset.source.replace(
      //         '</head>',
      //         `<script>${logInfo(log)}</script></head>`
      //       );
      //       fs.writeFileSync(path.resolve(outDir, asset.fileName), newstr);
      //     }
      //   });
      // },
    };

    return plugin;
  }
}

export default PluginConfig;
