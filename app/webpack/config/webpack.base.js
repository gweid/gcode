const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'entry.page1': path.resolve(process.cwd(), './app/pages/page1/entry.page1.js'),
    'entry.page2': path.resolve(process.cwd(), './app/pages/page2/entry.page2.js'),
  },
  output: {
    filename: 'js/[name]_[chunkhash:8].bundle.js',
    path: path.resolve(process.cwd(), './app/public/dist/prod'),
    // 打包出来的 html 文件引用资源的公共路径前缀
    // <script src="/dist/prod/js/entry.page1_xxxxxxxx.bundle.js"></script>
    publicPath: '/dist/prod',
    crossOriginLoading: 'anonymous', // 不带凭据(credential) 允许跨域加
  },
  resolve: {
    extensions: ['.js', '.vue', '.css', '.less'],
    alias: {
      '@pages': path.resolve(process.cwd(), './app/pages'),
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
    new HtmlWebpackPlugin({
      filename: path.resolve(process.cwd(), './app/public/dist/entry.page1.html'),
      template: path.resolve(process.cwd(), './app/public/entry-tpl.html'),
      chunks: ['entry.page1'],
    }),
    new HtmlWebpackPlugin({
      // 产物输出地址
      filename: path.resolve(process.cwd(), './app/public/dist/entry.page2.html'),
      // 使用的模板文件
      template: path.resolve(process.cwd(), './app/public/entry-tpl.html'),
      // 要注入的代码（与多页面打包入口 entry 对应）
      chunks: ['entry.page2'],
    }),
  ],
  optimization: {},
};
