import { DEFAULT_EXTENSIONS } from '@babel/core';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import { defineConfig } from 'rollup';

import pkg from './package.json';

console.log(`读取了: ${__filename.slice(__dirname.length + 1)}`);

const babelRuntimeVersion = pkg.devDependencies[
  '@babel/runtime-corejs3'
].replace(/^[^0-9]*/, '');

const allDep = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
].map((name) => RegExp(`^${name}($|/)`)); // 在打包esm和cjs的时候，排除所有依赖，让上层应用去处理（如果不排除就会有重复的polyfill）

export default defineConfig([
  // esm
  {
    input: './src/index.js',
    output: {
      format: 'esm',
      file: 'dist/index.esm.js',
    },
    external: allDep,
    plugins: [
      /**
       * @rollup/plugin-commonjs插件主要是将commonjs转换为esm
       * @rollup/plugin-commonjs一般和@rollup/plugin-node-resolve一起使用
       * @babel/plugin-transform-runtime使用corejs:3（即@babel/runtime-corejs3），
       * 而@babel/runtime-corejs3源码是使用commonjs规范写的，因此需要添加@rollup/plugin-commonjs插件
       * 让rollup支持commonjs 规范，识别 commonjs 规范的依赖。
       * 打包esm和cjs时，当前的billd-monorepo里面的源码基本都没有依赖第三方的包，并且排除了所有外部依赖，因此
       * 这里其实不需要用@rollup/plugin-commonjs插件
       * @rollup/plugin-commonjs和@rollup/plugin-babel一起用的使用，先使用@rollup/plugin-commonjs,再用@rollup/plugin-babel
       * https://github.com/rollup/plugins/blob/master/packages/babel/README.md#using-with-rollupplugin-commonjs
       */
      commonjs(),
      /**
       * @rollup/plugin-node-resolve只对引入node_modules包的代码起作用
       * 不使用@rollup/plugin-node-resolve插件的话,import { ref } from 'vue';就不会把node_modules包
       * 里的vue的ref的代码引进来，而是会原封不动的把import { ref } from 'vue';放到打包的代码里面;
       * 使用@rollup/plugin-node-resolve插件的话,会将node_modules包里的vue的ref的代码都引进来
       * 打包esm和cjs时，当前的billd-monorepo里面的源码基本都没有依赖第三方的包，并且排除了所有外部依赖，因此
       * 这里其实不需要用@rollup/plugin-node-resolve插件
       */
      nodeResolve(),
      json(),
      babel({
        exclude: 'node_modules/**', // 只编译我们的源代码，最好加上它，否则打包umd可能会报错
        extensions: [...DEFAULT_EXTENSIONS],
        // 这里面的plugins如果和babel.config.js里的plugins冲突，
        // 会执行这里的plugins，不会执行babel.config.js里的plugins
        plugins: [
          [
            /**
             * @babel/plugin-transform-runtime
             * useBuiltIns和polyfill选项在 v7 中被删除，只是将其设为默认值。
             */
            '@babel/plugin-transform-runtime',
            {
              // absoluteRuntime: false, // boolean或者string，默认为false。
              /**
               * corejs:false, 2,3或{ version: 2 | 3, proposals: boolean }, 默认为false
               * 设置对应值需要安装对应的包：
               * false	npm install --save @babel/runtime
               * 2	npm install --save @babel/runtime-corejs2
               * 3	npm install --save @babel/runtime-corejs3
               */
              corejs: 3,
              /**
               * helpers: boolean, 默认true。在纯babel的情况下：
               * 如果是true，就会把需要他runtime包给引进来，如：import _defineProperty from "@babel/runtime/helpers/defineProperty"
               * 如果是false，就会把需要的runtime包里面的代码给嵌进bundle里，如function _defineProperty(){}
               * 设置false的话，会导致同一个runtime包里面的代码被很多文件设置，产生冗余的代码。而且因为虽然是同一
               * 份runtime包里面的代码，但是他们在不同的文件（模块）里面，都有自己的作用域，因此在使用类似webpack之类的
               * 打包工具打包的时候，不会做优化。因此推荐设置true，这样可以通过静态分析的手段进行打包，减少打包后的代码体积。
               */
              helpers: true, // 当helpers设置true的时候，babelHelpers需要设置为runtime
              // helpers: false, // 当helpers设置false的时候，babelHelpers需要设置为bundled
              // regenerator: true, // 切换生成器函数是否转换为使用不污染全局范围的再生器运行时。默认为true
              version: babelRuntimeVersion,
            },
          ],
        ],
        /**
         * babelHelpers,建议显式配置此选项（即使使用其默认值）
         * runtime: 您应该使用此功能，尤其是在使用汇总构建库时，它结合external使用
         * bundled: 如果您希望生成的捆绑包包含这些帮助程序（每个最多一份），您应该使用它。特别是在捆绑应用程序代码时很有用
         * 如果babelHelpers设置成bundled，@babel/plugin-transform-runtime的helpers得设置false！
         * 如果babelHelpers设置成runtime，@babel/plugin-transform-runtime的helpers得设置true！
         * 在打包esm和cjs时,使用runtime,并且配合external;在打包umd时,使用bundled,并且不要用external,如果打包umd时使
         * 用了runtime但是没有配置external，会导致打包重复的polyfill，虽然打包的时候不报错，但是引入包使用的时候会报错
         */
        // babelHelpers: 'bundled', // 默认bundled,可选:"bundled" | "runtime" | "inline" | "external" | undefined
        babelHelpers: 'runtime', // 默认bundled,可选:"bundled" | "runtime" | "inline" | "external" | undefined
      }),
    ],
  },
  // cjs
  {
    input: './src/index.js',
    output: {
      format: 'cjs',
      file: 'dist/index.cjs.js',
      /**
       * exports默认值是auto，可选：default、none。https://rollupjs.org/guide/zh/#exports
       * 我们源代码使用了esm，而且默认导出和具名导出一起使用了，编译的时候会报警告(!) Mixing named and default exports
       * 设置exports: 'named'就不会报警告了，但是使用了exports: 'named'后，会生成：exports["default"] = BilldHtmlWebpackPlugin;
       * 别人通过cjs导入的话，就得const BilldHtmlWebpackPlugin = require("billd-html-webpack-plugin").default;才能拿到默认导出，
       * 如果不使用exports: 'named'，默认会生成：module.exports = BilldHtmlWebpackPlugin;
       * 别人通过cjs导入的话，就正常的const BilldHtmlWebpackPlugin = require("billd-html-webpack-plugin");即可
       * 这里的BilldHtmlWebpackPlugin是一个很简单的webpack插件，就一个默认导出，复杂度很低，所以不使用exports: 'named'
       * 报警告也不管它（这样别人用的时候可以省略.default）~
       */
      // exports: 'named',
    },
    external: allDep,
    plugins: [
      /**
       * @rollup/plugin-commonjs插件主要是将commonjs转换为esm
       * @rollup/plugin-commonjs一般和@rollup/plugin-node-resolve一起使用
       * @babel/plugin-transform-runtime使用corejs:3（即@babel/runtime-corejs3），
       * 而@babel/runtime-corejs3源码是使用commonjs规范写的，因此需要添加@rollup/plugin-commonjs插件
       * 让rollup支持commonjs 规范，识别 commonjs 规范的依赖。
       * 打包esm和cjs时，当前的billd-monorepo里面的源码基本都没有依赖第三方的包，并且排除了所有外部依赖，因此
       * 这里其实不需要用@rollup/plugin-commonjs插件
       * @rollup/plugin-commonjs和@rollup/plugin-babel一起用的使用，先使用@rollup/plugin-commonjs,再用@rollup/plugin-babel
       * https://github.com/rollup/plugins/blob/master/packages/babel/README.md#using-with-rollupplugin-commonjs
       */
      commonjs(),
      /**
       * @rollup/plugin-node-resolve只对引入node_modules包的代码起作用
       * 不使用@rollup/plugin-node-resolve插件的话,import { ref } from 'vue';就不会把node_modules包
       * 里的vue的ref的代码引进来，而是会原封不动的把import { ref } from 'vue';放到打包的代码里面;
       * 使用@rollup/plugin-node-resolve插件的话,会将node_modules包里的vue的ref的代码都引进来
       * 打包esm和cjs时，当前的billd-monorepo里面的源码基本都没有依赖第三方的包，并且排除了所有外部依赖，因此
       * 这里其实不需要用@rollup/plugin-node-resolve插件
       */
      nodeResolve(),
      json(),
      babel({
        exclude: 'node_modules/**', // 只编译我们的源代码，最好加上它，否则打包umd可能会报错
        extensions: [...DEFAULT_EXTENSIONS],
        // 这里面的plugins如果和babel.config.js里的plugins冲突，
        // 会执行这里的plugins，不会执行babel.config.js里的plugins
        plugins: [
          [
            /**
             * @babel/plugin-transform-runtime
             * useBuiltIns和polyfill选项在 v7 中被删除，只是将其设为默认值。
             */
            '@babel/plugin-transform-runtime',
            {
              // absoluteRuntime: false, // boolean或者string，默认为false。
              /**
               * corejs:false, 2,3或{ version: 2 | 3, proposals: boolean }, 默认为false
               * 设置对应值需要安装对应的包：
               * false	npm install --save @babel/runtime
               * 2	npm install --save @babel/runtime-corejs2
               * 3	npm install --save @babel/runtime-corejs3
               */
              corejs: 3,
              /**
               * helpers: boolean, 默认true。在纯babel的情况下：
               * 如果是true，就会把需要他runtime包给引进来，如：import _defineProperty from "@babel/runtime/helpers/defineProperty"
               * 如果是false，就会把需要的runtime包里面的代码给嵌进bundle里，如function _defineProperty(){}
               * 设置false的话，会导致同一个runtime包里面的代码被很多文件设置，产生冗余的代码。而且因为虽然是同一
               * 份runtime包里面的代码，但是他们在不同的文件（模块）里面，都有自己的作用域，因此在使用类似webpack之类的
               * 打包工具打包的时候，不会做优化。因此推荐设置true，这样可以通过静态分析的手段进行打包，减少打包后的代码体积。
               */
              helpers: true, // 当helpers设置true的时候，babelHelpers需要设置为runtime
              // helpers: false, // 当helpers设置false的时候，babelHelpers需要设置为bundled
              // regenerator: true, // 切换生成器函数是否转换为使用不污染全局范围的再生器运行时。默认为true
              version: babelRuntimeVersion,
            },
          ],
        ],
        /**
         * babelHelpers,建议显式配置此选项（即使使用其默认值）
         * runtime: 您应该使用此功能，尤其是在使用汇总构建库时，它结合external使用
         * bundled: 如果您希望生成的捆绑包包含这些帮助程序（每个最多一份），您应该使用它。特别是在捆绑应用程序代码时很有用
         * 如果babelHelpers设置成bundled，@babel/plugin-transform-runtime的helpers得设置false！
         * 如果babelHelpers设置成runtime，@babel/plugin-transform-runtime的helpers得设置true！
         * 在打包esm和cjs时,使用runtime,并且配合external;在打包umd时,使用bundled,并且不要用external,如果打包umd时使
         * 用了runtime但是没有配置external，会导致打包重复的polyfill，虽然打包的时候不报错，但是引入包使用的时候会报错
         */
        // babelHelpers: 'bundled', // 默认bundled,可选:"bundled" | "runtime" | "inline" | "external" | undefined
        babelHelpers: 'runtime', // 默认bundled,可选:"bundled" | "runtime" | "inline" | "external" | undefined
      }),
    ],
  },
]);
