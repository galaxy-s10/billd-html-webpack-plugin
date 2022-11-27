import Next12Apply from './next12';
import Nuxt2Apply from './nuxt2';
import VuecliApply from './vuecli';

class BilldHtmlWebpackPlugin {
  pluginName = 'BilldHtmlWebpackPlugin';

  options;

  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    console.log('执行了');
    if (this.options.nuxt2) {
      // eslint-disable-next-line
      new Nuxt2Apply(compiler, { pluginName: this.pluginName });
    } else if (this.options.next12) {
      // eslint-disable-next-line
      new Next12Apply(compiler, { pluginName: this.pluginName });
    } else if (this.options.vuecli) {
      // eslint-disable-next-line
      new VuecliApply(compiler, { pluginName: this.pluginName });
    }
  }
}

export default BilldHtmlWebpackPlugin;
