/** @typedef {import("webpack/lib/Compiler.js")} WebpackCompiler */
/** @typedef {import("webpack/lib/Compilation.js")} WebpackCompilation */

import { readFileSync, writeFileSync } from 'fs';
import nodePath from 'path';

import { logInfo } from './getData';

class PluginApply {
  clientReg = /\/client\.js$/;

  serverReg = /\/server\.js$/;

  arr = [];

  /**
   * @param {WebpackCompiler} compiler
   */
  constructor(compiler, { pluginName, log, NODE_ENV = process.env.NODE_ENV }) {
    try {
      const info = logInfo(log);
      const isDev = NODE_ENV === 'development';
      if (!isDev) {
        compiler.hooks.entryOption.tap(pluginName, (context, entry) => {
          this.arr = entry.app;
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
              // ?????????????????????
              const contens = compilation.assets[name].source();
              const str = info + contens;
              compilation.assets[name] = {
                source: () => str,
                size: () => str.length,
              };
            }
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default PluginApply;
