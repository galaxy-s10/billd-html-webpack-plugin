import { logInfo } from './getData';

class PluginApply {
  reg = /static\/chunks\/webpack/;

  constructor(compiler, { pluginName, NODE_ENV = process.env.NODE_ENV, log }) {
    try {
      compiler.hooks.emit.tap(pluginName, (compilation) => {
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
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default PluginApply;
