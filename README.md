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
