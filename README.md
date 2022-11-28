<p align="center">
  <a href="">
    <img
      width="200"
      src="https://resource.hsslive.cn/image/1613141138717Billd.webp"
      alt="billd-html-webpack-plugin logo"
    />
  </a>
</p>

<h1 align="center">
  billd-html-webpack-plugin
</h1>

<p align="center">
给你的项目注入构建信息
</p>

<div align="center">
<a href="https://www.npmjs.com/package/billd-html-webpack-plugin"><img src="https://img.shields.io/npm/v/billd-html-webpack-plugin.svg" alt="Version"></a>
<a href="https://www.npmjs.com/package/billd-html-webpack-plugin"><img src="https://img.shields.io/npm/dw/billd-html-webpack-plugin.svg" alt="Downloads"></a>
<a href="https://www.npmjs.com/package/billd-html-webpack-plugin"><img src="https://img.shields.io/npm/l/billd-html-webpack-plugin.svg" alt="License"></a>
</div>

# 简介

一个给你的项目注入构建信息的 webpack 插件，兼容 next12、nuxt2、vuecli4、vuecli5

> vuecli4/5 都是只支持默认的单页应用，如果你的 vuecli 配置了多页应用，可能会不生效！

# 原理

- nuxt2、vuecli4 是基于 webpack4 的，主要是根据 compiler.hooks.emit 这个钩子，在入口文件注入项目信息然后再输出
- next12、vuecli5 是基于 webpack5 的，主要是根据 compiler.hooks.compilation 这个钩子以及 compilation.hooks.processAssets， 对入口文件进行注入项目信息然后再输出

> 虽然 billd-html-webpack-plugin 是个 webpack 插件，但目前并没有做到足够通用，在一些集成 webpack 的脚手架上如 vuecli、nuxt、next 等，基本能兼容（因为它们的配置基本都是写固定了），但如果是你自己搭建的 webpack 的话，目前只会给 index.html 注入项目信息~

# 安装

```sh
npm i billd-html-webpack-plugin --save-dev
```

# 使用

## nuxt2

nuxt.config.js

```js
import BilldHtmlWebpackPlugin from 'billd-html-webpack-plugin';

export default {
  // ...
  build: {
    plugins: [
      // ...
      new BilldHtmlWebpackPlugin({ nuxt2: true }),
    ],
  },
};
```

## next12

next.config.js

```js
const BilldHtmlWebpackPlugin = require('billd-html-webpack-plugin');

const nextConfig = {
  // ...
  webpack: (config) => {
    config.plugins = [
      ...config.plugins,
      // ...
      new BilldHtmlWebpackPlugin({ next12: true }),
    ];
    return config;
  },
};

module.exports = nextConfig;
```

## vuecli5

vue.config.js

```js
const { defineConfig } = require('@vue/cli-service');
const BilldHtmlWebpackPlugin = require('billd-html-webpack-plugin');

module.exports = defineConfig({
  // ...
  chainWebpack: (config) => {
    // ...
    config.plugin('billd-html-webpack-plugin').use(BilldHtmlWebpackPlugin, [
      {
        vuecli5: true,
      },
    ]);
  },
});
```

## vuecli4

vue.config.js

```js
const BilldHtmlWebpackPlugin = require('billd-html-webpack-plugin');

module.exports = {
  // ...
  chainWebpack: (config) => {
    // ...
    config.plugin('billd-html-webpack-plugin').use(BilldHtmlWebpackPlugin, [
      {
        vuecli4: true,
      },
    ]);
  },
};
```

## webpack5

webpack.config.js

```js
const BilldHtmlWebpackPlugin = require('billd-html-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    // ...
    new BilldHtmlWebpackPlugin({ webpack5: true }),
  ],
};
```
