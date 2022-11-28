import { info } from './getData';

class PluginApply {
  constructor(compiler, pluginName) {
    compiler.hooks.emit.tap(pluginName, (compilation) => {
      // [DEP_WEBPACK_COMPILATION_ASSETS] DeprecationWarning: Compilation.assets will be frozen in future, all modifications are deprecated.
      // 即webpack5不推荐使用compilation.assets来修改资产，使用Compilation.hooks.processAssets来替换
      Object.keys(compilation.assets).forEach((data) => {
        const content = compilation.assets[data].source();
        if (data === 'index.html') {
          const str = content.replace(
            '</head>',
            `<script>${info}</script></head>`
          );
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
    });
  }
}

export default PluginApply;
