const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const entryPages = {};
const htmlWebpackPluginList = [];

// 获取 app/pages 目录下所有的入口文件（固定格式：entry.xxx.js）
const entryFiles = glob.sync(path.resolve(process.cwd(), './app/pages/**/entry.*.js'));

entryFiles.forEach((file) => {
  const entryName = path.basename(file, '.js'); // 获取文件名作为入口名称
  entryPages[entryName] = file;
  htmlWebpackPluginList.push(
    new HtmlWebpackPlugin({
      filename: path.resolve(process.cwd(), `./app/public/dist/${entryName}.html`),
      template: path.resolve(process.cwd(), './app/public/entry-tpl.html'),
      chunks: [entryName],
    }),
  );
});

const baseConfig = {
  entry: entryPages,
  output: {},
  resolve: {
    extensions: ['.js', '.vue', '.css', '.less'],
    alias: {
      '@pages': path.resolve(process.cwd(), './app/pages'),
      '@assets': path.resolve(process.cwd(), './app/assets'),
      '@components': path.resolve(process.cwd(), './app/components'),
      '@stores': path.resolve(process.cwd(), './app/stores'),
      '@utils': path.resolve(process.cwd(), './app/utils'),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.js$/,
        include: [path.resolve(process.cwd(), './app/pages')],
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 300,
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    // 1. 克隆规则并应用到 .vue 文件的各个块
    //    - 将 webpack 配置中的其他 loader 规则（如 babel-loader、css-loader）复制并应用到 .vue 文件内的 <script>、<style>、<template> 块
    // 2. 处理单文件组件 (SFC) 的内部请求
    //    - .vue 文件会被拆分成多个虚拟模块
    //    - 插件确保每个块能正确匹配到对应的 loader
    new VueLoaderPlugin(),
    // 把第三方库暴露到 window context 下，就不用手动 import 了
    new webpack.ProvidePlugin({
      Vue: 'vue',
    }),
    // 注入全局变量
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true', // vue 支持 options api
      __VUE_PROD_DEVTOOLS__: 'false', // vue 生产环境禁用 devtools
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false', // vue 禁用生产环境显示“水合”信息
    }),
    // 使用 HtmlWebpackPlugin，但是这个多页面，有几个页面就需要 new 几个 HTMLWebpackPlugin
    ...htmlWebpackPluginList,
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(process.cwd(), './app/public/404.html'),
          to: path.resolve(process.cwd(), './app/public/dist'),
        },
      ],
    }),
  ],
  optimization: {
    /**
     * 把 js 文件打包成三种类型
     * 1. vendor: 第三方 lib 库，基本不会改动，除非依赖版本升级
     * 2. common: 业务组件代码的公共部分抽取出来，改动较少
     * 3. entry.{page}: 不同页面 entry 里的业务组件代码的差异部分，会经常改动
     * 目的：把改动和引用频率不一样的 js 区分出来，达到更好利用浏览器缓存的效果
     */
    splitChunks: {
      chunks: 'all', // 对所有类型的块进行代码拆分（包括同步和异步块）
      // maxAsyncRequests: 如果某个文件异步引入了 20 个 chunk，webpack 打包时会合并成 10 个，目的是优化浏览器的并发请求数
      maxAsyncRequests: 10, // 每次异步加载的最大并行请求数，如import()、路由懒加载等.
      maxInitialRequests: 10, // 入口点的最大并行请求数
      minSize: 20000, // 模块大于 20KB 才进行代码拆分
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors', // 打包后的文件名
          priority: 20, // 优先级，数字越大，优先级越高，node_modules 的优先级要比 common 高，保证第三方库不会被归为 common
          enforce: true, // 强制执行
          reuseExistingChunk: true, // 复用已有的公共 chunk
        },
        common: {
          test: /[\\/]components|utils[\\/]/, // 匹配到 components、utils 目录下的模块
          name: 'common',
          minChunks: 2, // 模块至少被两个不同的入口引用才会被打包到 common chunk 中
          priority: 10,
          enforce: true,
          reuseExistingChunk: true, // 复用已有的公共 chunk
        },
      },
    },
  },
};

module.exports = baseConfig;
