/** @typedef {import("webpack/lib/Compiler.js")} WebpackCompiler */
/** @typedef {import("../types/index").BilldHtmlWebpackPluginOption} PluginOption */

import { version as __VERSION__ } from '../package.json';
import Next12Apply from './env/next12';
import Nuxt2Apply from './env/nuxt2';
import Nuxt3Plugin from './env/nuxt3';
import Vite4Plugin from './env/vite4';
import Vuecli4Apply from './env/vuecli4';
import Vuecli5Apply from './env/vuecli5';
import Webpack4Apply from './env/webpack4';
import Webpack5Apply from './env/webpack5';
import { errorLog } from './utils';

class BilldHtmlWebpackPlugin {
  billdConfig = {
    pluginName: 'BilldHtmlWebpackPlugin',
    NODE_ENV: undefined,
    options: undefined,
    env: undefined,
    envList: [
      'nuxt2',
      'nuxt3',
      'vuecli4',
      'vuecli5',
      'webpack4',
      'webpack5',
      'next12',
      'vite4',
    ],
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
      } else if (options.env === 'vite4') {
        this.config = new Vite4Plugin(this.billdConfig);
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
        case 'webpack4':
          new Webpack4Apply(compiler, this.billdConfig);
          break;
        case 'webpack5':
          new Webpack5Apply(compiler, this.billdConfig);
          break;
        case 'next12':
          new Next12Apply(compiler, this.billdConfig);
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
