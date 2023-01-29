/** @typedef {import("webpack/lib/Compiler.js")} WebpackCompiler */
/** @typedef {import("../types/index").BilldHtmlWebpackPluginOption} PluginOption */

import { version as __VERSION__ } from '../package.json';
import Next12Apply from './next12';
import Nuxt2Apply from './nuxt2';
import Vuecli4Apply from './vuecli4';
import Vuecli5Apply from './vuecli5';
import Webpack5Apply from './webpack5';

class BilldHtmlWebpackPlugin {
  pluginName = 'BilldHtmlWebpackPlugin';

  options;
  env;
  NODE_ENV;
  envList = ['nuxt2', 'vuecli4', 'vuecli5', 'next12', 'webpack5'];
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

  /**
   * @param {PluginOption} options
   */
  constructor(options) {
    if (!options.env) {
      throw new Error('请传入env属性!');
    } else if (!this.envList.includes(options.env)) {
      throw new Error(`env属性必须是: ${this.envList} 中的一个!`);
    }
    try {
      this.env = options.env;
      options.log && (this.log = { ...this.log, ...options.log });
      options.NODE_ENV && (this.NODE_ENV = options.NODE_ENV);
    } catch (error) {
      console.log(error);
      throw new Error('配置有误!');
    }

    this.options = options;
  }

  /**
   * @param {WebpackCompiler} compiler
   */
  apply(compiler) {
    const options = {
      pluginName: this.pluginName,
      log: this.log,
      env: this.env,
      NODE_ENV: this.NODE_ENV,
    };

    switch (this.options.env) {
      case 'nuxt2':
        new Nuxt2Apply(compiler, options);
        break;
      case 'vuecli4':
        new Vuecli4Apply(compiler, options);
        break;
      case 'vuecli5':
        new Vuecli5Apply(compiler, options);
        break;
      case 'next12':
        new Next12Apply(compiler, options);
        break;
      case 'webpack5':
        new Webpack5Apply(compiler, options);
        break;
    }
  }
}

export { logData } from './getData';
export default BilldHtmlWebpackPlugin;
export const version = __VERSION__;
