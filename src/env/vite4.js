/** @typedef {import("vite").Plugin} Plugin */

import { logInfo } from '../getData';

class PluginConfig {
  constructor({ pluginName, log }) {
    const str = logInfo(log);
    /** @type {Plugin} */
    const plugin = {
      name: pluginName,
      /**
       * transformIndexHtml是vite插件独有的钩子，nuxt3基于vite，直接使用transformIndexHtml这个钩子即可
       * https://cn.vitejs.dev/guide/api-plugin.html#transformindexhtml
       */
      transformIndexHtml(html) {
        return html.replace('</head>', `<script>${str}</script></head>`);
      },
    };
    return plugin;
  }
}

export default PluginConfig;
