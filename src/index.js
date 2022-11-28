import Next12Apply from './next12';
import Nuxt2Apply from './nuxt2';
import Vuecli5Apply from './vuecli5';
import Webpack5Apply from './webpack5';

class BilldHtmlWebpackPlugin {
  pluginName = 'BilldHtmlWebpackPlugin';

  options;

  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    if (this.options.nuxt2) {
      // eslint-disable-next-line
      new Nuxt2Apply(compiler, { pluginName: this.pluginName });
    } else if (this.options.next12) {
      // eslint-disable-next-line
      new Next12Apply(compiler, { pluginName: this.pluginName });
    } else if (this.options.vuecli5) {
      // eslint-disable-next-line
      new Vuecli5Apply(compiler, { pluginName: this.pluginName });
    } else if (this.options.webpack5) {
      // eslint-disable-next-line
      new Webpack5Apply(compiler, { pluginName: this.pluginName });
    }
  }
}

export default BilldHtmlWebpackPlugin;
