/** @typedef {import("webpack/lib/Compiler.js")} WebpackCompiler */
/** @typedef {import("webpack/lib/Compilation.js")} WebpackCompilation */

import { readFileSync, writeFileSync } from 'fs';
import nodePath from 'path';

import { logInfo } from '../getData';

class PluginApply {
  clientReg = /\/client\.js$/;
  serverReg = /\/server\.js$/;
  arr = [];

  /**
   * @param {WebpackCompiler} compiler
   */
  constructor(compiler, { pluginName, log, NODE_ENV = process.env.NODE_ENV }) {
    const info = logInfo(log);
    const isDev = NODE_ENV === 'development';
    if (!isDev) {
      // @ts-ignore
      compiler.hooks.entryOption.tap(pluginName, (context, entry) => {
        // win环境下，entry.app的值可能是：
        // [                                                                                                                                     18:24:55
        //   'C:/ldmnq/nuxt/node_modules/.pnpm/@nuxt+components@2.2.1/node_modules/@nuxt/components/lib/installComponents.js',
        //   'C:\\ldmnq\\nuxt\\.nuxt\\server.js'
        // ]
        this.arr = entry.app.map((val) => val.replace(/\\\\/g, '/'));
      });

      compiler.hooks.done.tapAsync(pluginName, (compilation, callback) => {
        this.arr.forEach((path) => {
          if (this.clientReg.exec(path)) {
            const path1 = path.replace(this.clientReg, '');
            const htmlpath = nodePath.join(
              path1,
              'dist',
              'server',
              'index.spa.html'
            );
            const str = readFileSync(htmlpath).toString();
            const str1 = str.replace(
              '</head>',
              `<script>${info}</script></head>`
            );
            writeFileSync(htmlpath, str1);
          }
          if (this.serverReg.exec(path)) {
            const path1 = path.replace(this.serverReg, '');
            const htmlpath = nodePath.join(
              path1,
              'dist',
              'server',
              'index.ssr.html'
            );
            const str = readFileSync(htmlpath).toString();
            const str1 = str.replace(
              '</head>',
              `<script>${info}</script></head>`
            );
            writeFileSync(htmlpath, str1);
          }
        });
        callback();
      });
    } else {
      compiler.hooks.emit.tap(pluginName, (compilation) => {
        Object.keys(compilation.assets).forEach((name) => {
          if (name === 'app.js') {
            // 获取之前的内容
            const contens = compilation.assets[name].source();
            const str = info + contens;
            // @ts-ignore
            compilation.assets[name] = {
              source: () => str,
              size: () => str.length,
            };
          }
        });
      });
    }
  }
}

export default PluginApply;
