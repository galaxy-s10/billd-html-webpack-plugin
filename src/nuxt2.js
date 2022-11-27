import { readFileSync, writeFileSync } from 'fs';
import nodePath from 'path';

import { info } from './getData';

class PluginApply {
  clientReg = /\/client\.js$/;

  serverReg = /\/server\.js$/;

  arr = [];

  pluginName = '';

  constructor(compiler, { pluginName, NODE_ENV = process.env.NODE_ENV }) {
    this.pluginName = pluginName;
    const isDev = NODE_ENV === 'development';
    console.log(isDev, 'isDev');
    if (!isDev) {
      compiler.hooks.entryOption.tap(this.pluginName, (context, entry) => {
        this.arr = entry.app;
      });

      compiler.hooks.done.tapAsync(this.pluginName, (compilation, callback) => {
        this.arr.forEach((path) => {
          if (this.clientReg.exec(path)) {
            console.log('匹配到clientReg');
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
            console.log('匹配到serverReg');
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
      compiler.hooks.emit.tap(this.pluginName, (compilation) => {
        Object.keys(compilation.assets).forEach((name) => {
          if (name === 'app.js') {
            //   获取之前的内容
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
  }
}

export default PluginApply;
