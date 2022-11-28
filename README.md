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

一个给你的项目注入构建信息的 webpack 插件，兼容 next12、nuxt2、vuecli5

> webpack5 试验性兼容，create-react-app 即将兼容

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
    config.plugin('BilldHtmlWebpackPlugin').use(BilldHtmlWebpackPlugin, [
      {
        vuecli5: true,
      },
    ]);
  },
});
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
