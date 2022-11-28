import { info } from './getData';

class PluginApply {
  reg = /static\/chunks\/webpack/;

  constructor(compiler, { pluginName, NODE_ENV = process.env.NODE_ENV }) {
    compiler.hooks.emit.tap(pluginName, (compilation) => {
      Object.keys(compilation.assets).forEach((data) => {
        const content = compilation.assets[data].source();
        if (this.reg.exec(data)) {
          const str = info + content;
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
