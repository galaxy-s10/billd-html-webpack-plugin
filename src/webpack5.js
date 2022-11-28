import webpack from 'webpack';

import { info } from './getData';

class PluginApply {
  constructor(compiler, pluginName) {
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: pluginName,
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL, // 在编译中添加额外的 asset。
          additionalAssets: true,
        },
        (assets, cb) => {
          Object.entries(assets).forEach(([pathname, source]) => {
            if (pathname === 'index.html') {
              // eslint-disable-next-line
              const str = source._value.replace(
                '</head>',
                `<script>${info}</script></head>`
              );
              // eslint-disable-next-line
              source._value = str;
            }
          });
          cb();
        }
      );
    });
  }
}

export default PluginApply;
