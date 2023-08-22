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

一个给你的项目注入构建信息的 webpack / vite 插件，兼容 nuxt2/3、vuecli4/5、webpack4/5、vite4、next12

# 效果

![https://resource.hsslive.cn/image/b1c7975436bfbe9a79ffe862a31c8440.webp](https://resource.hsslive.cn/image/b1c7975436bfbe9a79ffe862a31c8440.webp)

> 从控制台可以看到，打印了当前项目的 git 信息以及最后部署时间，非常人性化，再也不用担心部署的代码是不是最新的了~

# 原理

- nuxt2、vuecli4 是基于 webpack4 的，主要是根据 compiler.hooks.emit 这个钩子，在入口文件注入项目信息然后再输出
- next12、vuecli5 是基于 webpack5 的，主要是根据 compiler.hooks.compilation 这个钩子以及 compilation.hooks.processAssets， 对入口文件进行注入项目信息然后再输出
- nuxt3 是基于 vite 的，主要是根据 configResolved 这个钩子（ vite 插件特有），通过 configResolved 钩子找入口，然后使用 transform 钩子（rollup 插件）将项目信息注入到入口文件
- vite4，主要是根据 transformIndexHtml 这个钩子（vite 插件特有），对 index.html 注入项目信息

> 本质上就是给你的项目入口/所有 html 插入一串 js 代码。

# 安装

```sh
npm i billd-html-webpack-plugin --save-dev
```

# 使用前注意

**请确保你的package.json里面有以下字段：**

```json
{
  "name": "xxxxxxxxxx",
  "version": "xxxxxxxxxx",
  "repository": {
    "type": "xxxxxxxxxx",
    "url": "xxxxxxxxxx"
  }
}
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
      new BilldHtmlWebpackPlugin({ env: 'nuxt2' }),
    ],
  },
};
```

## nuxt3

nuxt.config.ts

```ts
import BilldHtmlWebpackPlugin from 'billd-html-webpack-plugin';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ...
  vite: {
    // ...
    plugins: [
      // ...
      new BilldHtmlWebpackPlugin({ env: 'nuxt3' }).config,
    ],
  },
});
```

## nuxt3.6+

nuxt.config.ts

```ts
import BilldHtmlWebpackPlugin from 'billd-html-webpack-plugin';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ...
  vite: {
    // ...
    plugins: [
      // ...
      new BilldHtmlWebpackPlugin({ env: 'nuxt3-6' }).config,
    ],
  },
});
```

## vuecli4

vue.config.js

```js
const BilldHtmlWebpackPlugin = require('billd-html-webpack-plugin').default;

module.exports = {
  // ...
  chainWebpack: (config) => {
    // ...
    config
      .plugin('billd-html-webpack-plugin')
      .use(BilldHtmlWebpackPlugin, [{ env: 'vuecli4' }]);
  },
};
```

## vuecli5

vue.config.js

```js
const { defineConfig } = require('@vue/cli-service');
const BilldHtmlWebpackPlugin = require('billd-html-webpack-plugin').default;

module.exports = defineConfig({
  // ...
  chainWebpack: (config) => {
    // ...
    config
      .plugin('billd-html-webpack-plugin')
      .use(BilldHtmlWebpackPlugin, [{ env: 'vuecli5' }]);
  },
});
```

## webpack4

webpack.config.js

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BilldHtmlWebpackPlugin = require('billd-html-webpack-plugin').default;

module.exports = {
  // ...
  plugins: [
    // ...
    new HtmlWebpackPlugin(),
    // 请确保billd-html-webpack-plugin插件在html-webpack-plugin插件后面
    new BilldHtmlWebpackPlugin({ env: 'webpack4' }),
  ],
};
```

## webpack5

webpack.config.js

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BilldHtmlWebpackPlugin = require('billd-html-webpack-plugin').default;

module.exports = {
  // ...
  plugins: [
    // ...
    new HtmlWebpackPlugin(),
    // 请确保billd-html-webpack-plugin插件在html-webpack-plugin插件后面
    new BilldHtmlWebpackPlugin({ env: 'webpack5' }),
  ],
};
```

## next12

next.config.js

```js
const BilldHtmlWebpackPlugin = require('billd-html-webpack-plugin').default;

const nextConfig = {
  // ...
  webpack: (config) => {
    config.plugins = [
      ...config.plugins,
      // ...
      new BilldHtmlWebpackPlugin({ env: 'next12' }),
    ];
    return config;
  },
};

module.exports = nextConfig;
```

## vite4

vite.config.ts

```ts
import BilldHtmlWebpackPlugin from 'billd-html-webpack-plugin';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // ...
  plugins: [
    // ...
    new BilldHtmlWebpackPlugin({ env: 'vite4' }).config,
  ],
});
```

> 注意：如果package.json里面配置了 `"type": "module"` ，则需要添加.default：`new BilldHtmlWebpackPlugin.default({ env: 'vite4' }).config`

# 配置

## 打印选项

```js
import BilldHtmlWebpackPlugin from 'billd-html-webpack-plugin';

new BilldHtmlWebpackPlugin({
  env: 'nuxt2',
  log: {
    pkgName: true, // pkg名称
    pkgVersion: true, // pkg版本
    pkgRepository: false, // 不显示pkg仓库
    commitSubject: false, // 不显示git提交主题
    commitBranch: true, // git提交分支
    committerDate: true, // git提交日期
    commitHash: true, // git提交哈希
    committerName: true, // git提交者名字
    committerEmail: true, // git提交者邮箱
    lastBuildDate: true, // 最后构建日期
  },
});
```

## 获取打印数据

> 注意：只支持在 node 环境执行

```js
import { logData } from 'billd-html-webpack-plugin';

console.log(
  logData({
    pkgRepository: false, // 不显示pkg仓库
  })
);
// {
//   pkgName: 'xxxxx',
//   pkgVersion: '0.0.1',
//   pkgRepository: '-',
//   commitSubject: 'xxxxxx',
//   commitBranch: 'feat-webrtc',
//   committerDate: '2023-01-06 20:58:03 +0800',
//   commitHash: 'dsggggsdgdsgsdgs',
//   committerName: 'shuisheng',
//   committerEmail: '2274751790@qq.com',
//   lastBuildDate: '2023/1/10 11:11:56',
// };
```

# 引用

- [https://git-scm.com/docs/git-show](https://git-scm.com/docs/git-show)
- [https://github.com/jantimon/html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)
- [https://webpack.docschina.org/api/compiler-hooks/](https://webpack.docschina.org/api/compiler-hooks/)
- [https://webpack.docschina.org/api/compilation-hooks/](https://webpack.docschina.org/api/compilation-hooks/)
- [https://webpack.docschina.org/api/compilation-hooks/#processassets](https://webpack.docschina.org/api/compilation-hooks/#processassets)

# 源码

[https://github.com/galaxy-s10/babel-plugin-import-billd](https://github.com/galaxy-s10/babel-plugin-import-billd)，欢迎 star~
