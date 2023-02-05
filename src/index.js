/** @typedef {import("webpack/lib/Compiler.js")} WebpackCompiler */
/** @typedef {import("../types/index").BilldHtmlWebpackPluginOption} PluginOption */

import { version as __VERSION__ } from '../package.json';
import Next12Apply from './next12';
import Nuxt2Apply from './nuxt2';
import Nuxt3Plugin from './nuxt3';
import { errorLog } from './utils';
import Vuecli4Apply from './vuecli4';
import Vuecli5Apply from './vuecli5';
import Webpack5Apply from './webpack5';

class BilldHtmlWebpackPlugin {
  billdConfig = {
    pluginName: 'BilldHtmlWebpackPlugin',
    NODE_ENV: undefined,
    options: undefined,
    env: undefined,
    envList: ['nuxt2', 'nuxt3', 'vuecli4', 'vuecli5', 'next12', 'webpack5'],
    log: {
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
    },
  };

  /**
   * @param {PluginOption} options
   */
  constructor(options) {
    if (!options.env) {
      errorLog(`请传入env属性!`, true);
    } else if (!this.billdConfig.envList.includes(options.env)) {
      errorLog(`env属性必须是: ${this.billdConfig.envList} 中的一个!`, true);
    }

    try {
      this.billdConfig.env = options.env;
      options.log &&
        (this.billdConfig.log = {
          ...this.billdConfig.log,
          ...options.log,
        });
      options.NODE_ENV && (this.billdConfig.NODE_ENV = options.NODE_ENV);
    } catch (error) {
      console.log(error);
      errorLog(`配置错误!`, true);
    }

    this.billdConfig.options = options;
    try {
      if (options.env === 'nuxt3') {
        this.config = new Nuxt3Plugin(this.billdConfig);
      }
    } catch (error) {
      errorLog(error);
    }
  }

  /**
   * @param {WebpackCompiler} compiler
   */
  apply(compiler) {
    try {
      switch (this.billdConfig.options.env) {
        case 'nuxt2':
          new Nuxt2Apply(compiler, this.billdConfig);
          break;
        case 'vuecli4':
          new Vuecli4Apply(compiler, this.billdConfig);
          break;
        case 'vuecli5':
          new Vuecli5Apply(compiler, this.billdConfig);
          break;
        case 'next12':
          new Next12Apply(compiler, this.billdConfig);
          break;
        case 'webpack5':
          new Webpack5Apply(compiler, this.billdConfig);
          break;
      }
    } catch (error) {
      errorLog(error);
    }
  }
}

export { logData } from './getData';
export const version = __VERSION__;
export default BilldHtmlWebpackPlugin;
