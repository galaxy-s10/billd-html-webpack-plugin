import Next12Apply from './next12';
import Nuxt2Apply from './nuxt2';
import Vuecli4Apply from './vuecli4';
import Vuecli5Apply from './vuecli5';
import Webpack5Apply from './webpack5';

class BilldHtmlWebpackPlugin {
  pluginName = 'BilldHtmlWebpackPlugin';

  options;

  log = {
    pkgName: true,
    pkgVersion: true,
    pkgRepository: true,
    commitSubject: true,
    commitBranch: true,
    committerDate: true,
    commitHash: true,
    committerName: true,
    committerEmail: true,
    lastBuildDate: true,
  };

  constructor(options) {
    this.options = options;
    if (this.options.log) {
      try {
        this.log = { ...this.log, ...this.options.log };
      } catch (error) {
        console.log(error);
      }
    }
  }

  apply(compiler) {
    if (this.options.nuxt2) {
      // eslint-disable-next-line
      new Nuxt2Apply(compiler, {
        pluginName: this.pluginName,
        log: this.log,
      });
    } else if (this.options.next12) {
      // eslint-disable-next-line
      new Next12Apply(compiler, {
        pluginName: this.pluginName,
        log: this.log,
      });
    } else if (this.options.vuecli5) {
      // eslint-disable-next-line
      new Vuecli5Apply(compiler, {
        pluginName: this.pluginName,
        log: this.log,
      });
    } else if (this.options.vuecli4) {
      // eslint-disable-next-line
      new Vuecli4Apply(compiler, {
        pluginName: this.pluginName,
        log: this.log,
      });
    } else if (this.options.webpack5) {
      // eslint-disable-next-line
      new Webpack5Apply(compiler, {
        pluginName: this.pluginName,
        log: this.log,
      });
    }
  }
}

export default BilldHtmlWebpackPlugin;
